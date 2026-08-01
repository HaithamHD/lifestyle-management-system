<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Mood;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MoodController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json($request->user()->moods()->latest('recorded_on')->limit(30)->get());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'score' => ['required', 'integer', 'between:1,6'],
            'emoji' => ['nullable', 'string', 'max:8'],
            'note' => ['nullable', 'string', 'max:1000'],
            'recorded_on' => ['nullable', 'date', 'before_or_equal:today'],
        ]);
        $date = $data['recorded_on'] ?? today()->toDateString();
        $mood = Mood::updateOrCreate(
            ['user_id' => $request->user()->id, 'recorded_on' => $date],
            ['score' => $data['score'], 'emoji' => $data['emoji'] ?? null, 'note' => $data['note'] ?? null]
        );
        return response()->json($mood, $mood->wasRecentlyCreated ? 201 : 200);
    }
}
