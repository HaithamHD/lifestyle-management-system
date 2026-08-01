<?php

namespace App\Http\Requests;

use App\Models\Task;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('task')) ?? false;
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string', 'max:2000'],
            'due_date' => ['sometimes', 'nullable', 'date'],
            'status' => ['sometimes', Rule::in([Task::STATUS_PENDING, Task::STATUS_IN_PROGRESS, Task::STATUS_COMPLETED])],
            'priority' => ['sometimes', 'in:low,medium,high'],
            'category' => ['sometimes', 'nullable', 'string', 'max:40'],
        ];
    }
}
