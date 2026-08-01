<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $notifications = $request->user()->appNotifications()
            ->when($request->query('status'), fn ($q, $status) => $q->where('status', $status))
            ->latest()->paginate(20);
        return response()->json($notifications);
    }

    public function markAsRead(Request $request, int $id): JsonResponse
    {
        $notification = $request->user()->appNotifications()->findOrFail($id);
        $notification->markAsRead();
        return response()->json($notification->fresh());
    }

    public function destroy(Request $request, int $id): Response
    {
        $request->user()->appNotifications()->findOrFail($id)->delete();
        return response()->noContent();
    }
}
