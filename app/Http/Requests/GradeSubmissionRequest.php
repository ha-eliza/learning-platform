<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class GradeSubmissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check() && Auth::user()->role === 'teacher';
    }

    public function rules(): array
    {
        return [
            'submission_id' => ['required', 'integer', 'exists:submissions,id'],
            'status'        => ['required', 'in:verified,rejected'],
            'grade'         => ['required_if:status,verified', 'nullable', 'integer', 'between:2,5'],
            'teacher_comment'       => ['required_if:status,rejected', 'nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'grade.required_if' => 'Необходимо выбрать оценку для зачета работы.',
            'teacher_comment.required_if' => 'Пожалуйста, укажите причину возврата работы на доработку.',
        ];
    }
}
