<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Task;
use App\Repositories\Contracts\TaskRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TaskController extends Controller
{
    public function __construct(private readonly TaskRepositoryInterface $tasks)
    {
        $this->authorizeResource(Task::class, 'task');
    }

    public function index(Request $request): JsonResponse
    {
        return response()->json($this->tasks->forUser($request->user()->id, $request->query('filter', 'all')));
    }

    public function store(StoreTaskRequest $request): JsonResponse
    {
        return response()->json($this->tasks->create($request->user()->id, $request->validated()), 201);
    }

    public function show(Task $task): JsonResponse { return response()->json($task); }

    public function update(UpdateTaskRequest $request, Task $task): JsonResponse
    {
        return response()->json($this->tasks->update($task, $request->validated()));
    }

    public function destroy(Task $task): Response
    {
        $this->tasks->delete($task);
        return response()->noContent();
    }

    public function complete(Task $task): JsonResponse
    {
        $this->authorize('update', $task);
        $task->markComplete();
        return response()->json($task->fresh());
    }
}
