<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    public function dashboard(): JsonResponse
    {
        return response()->json([
            'stats' => [
                'total_users' => User::count(),
                'active_today' => User::whereDate('last_login_at', today())->count(),
                'tasks_completed' => Task::completed()->count(),
                'open_issues' => Notification::where('type', 'issue')->where('status', 'unread')->count(),
            ],
            'recent_users' => User::latest()->take(10)->get(),
        ]);
    }

    public function users(Request $request): JsonResponse
    {
        $users = User::query()
            ->when($request->query('search'), fn ($q, $search) => $q->where(fn ($qq) => $qq->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%")))
            ->latest()->paginate(25);
        return response()->json($users);
    }

    public function updateStatus(Request $request, User $user): JsonResponse
    {
        abort_if($user->isAdmin() && $request->input('status') === 'suspended', 422, 'An administrator cannot be suspended.');
        $data = $request->validate(['status' => ['required', Rule::in(['active', 'pending', 'suspended'])]]);
        $user->update($data);
        if ($data['status'] === 'suspended') {
            $user->tokens()->delete();
        }
        return response()->json($user->fresh());
    }
}
