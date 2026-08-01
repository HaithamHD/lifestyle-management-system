<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Habit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Carbon;

class HabitController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $habits = $request->user()->habits()->with(['ticks' => fn ($q) => $q->latest('date')->limit(30)])
            ->orderByDesc('current_streak')->get();
        return response()->json($habits);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'emoji' => ['nullable', 'string', 'max:8'],
            'frequency' => ['required', 'in:daily,weekdays,weekends,weekly'],
        ]);
        $habit = $request->user()->habits()->create($data);
        return response()->json(['message' => 'Habit created successfully.', 'data' => $habit], 201);
    }

    public function show(Request $request, Habit $habit): JsonResponse
    {
        abort_unless($habit->user_id === $request->user()->id, 403);
        return response()->json($habit->load('ticks'));
    }

    public function update(Request $request, Habit $habit): JsonResponse
    {
        abort_unless($habit->user_id === $request->user()->id, 403);
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:120'],
            'emoji' => ['sometimes', 'nullable', 'string', 'max:8'],
            'frequency' => ['sometimes', 'in:daily,weekdays,weekends,weekly'],
        ]);
        $habit->update($data);
        return response()->json($habit->fresh());
    }

    public function destroy(Request $request, Habit $habit): Response
    {
        abort_unless($habit->user_id === $request->user()->id, 403);
        $habit->delete();
        return response()->noContent();
    }

    public function tick(Request $request, Habit $habit): JsonResponse
    {
        abort_unless($habit->user_id === $request->user()->id, 403);
        $data = $request->validate(['date' => ['nullable', 'date', 'before_or_equal:today']]);
        $date = isset($data['date']) ? Carbon::parse($data['date']) : today();
        $habit->tickFor($date);
        return response()->json(['message' => 'Habit tick recorded successfully.', 'data' => $habit->fresh()->load('ticks')]);
    }
}
