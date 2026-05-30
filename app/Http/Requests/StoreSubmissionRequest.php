<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreSubmissionRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'material_id' => ['required', 'integer', 'exists:materials,id'],
            'file'        => ['required_without:comment', 'nullable', 'file', 'mimes:zip,rar,pdf', 'max:20480'],
            'comment'     => ['required_without:file', 'nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'file.required_without' => 'Необходимо прикрепить файл архива или оставить комментарий/ссылку.',
            'comment.required_without' => 'Необходимо оставить текстовый комментарий или прикрепить файл.',
        ];
    }
}
