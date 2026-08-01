<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JournalEntry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class JournalController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $entries = $request->user()->journalEntries()
            ->when($request->query('search'), fn ($q, $search) => $q->where(fn ($qq) => $qq->where('title', 'like', "%{$search}%")->orWhere('content', 'like', "%{$search}%")))
            ->latest()->paginate(20);
        return response()->json($entries);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:40'],
        ]);
        return response()->json($request->user()->journalEntries()->create($data), 201);
    }

    public function show(Request $request, JournalEntry $journal): JsonResponse
    {
        abort_unless($journal->user_id === $request->user()->id, 403);
        return response()->json($journal);
    }

    public function update(Request $request, JournalEntry $journal): JsonResponse
    {
        abort_unless($journal->user_id === $request->user()->id, 403);
        $data = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'content' => ['sometimes', 'string'],
            'tags' => ['sometimes', 'nullable', 'array'],
            'tags.*' => ['string', 'max:40'],
        ]);
        $journal->update($data);
        return response()->json($journal->fresh());
    }

    public function destroy(Request $request, JournalEntry $journal): Response
    {
        abort_unless($journal->user_id === $request->user()->id, 403);
        $journal->delete();
        return response()->noContent();
    }
}
