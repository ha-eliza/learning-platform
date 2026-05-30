<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreMaterialRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check() && Auth::user()->role === 'teacher';
    }

    public function rules(): array
    {
        $materialId = $this->route('id') ?? $this->route('material');
        return [
            'title'    => ['required', 'string', 'max:255'],
            'url'      => ['required', 'string', 'max:255', 'unique:materials,url,' . $materialId,],
            'content'  => ['nullable', 'string'],
            'type'     => ['required', 'in:manual,practic'],
            'category' => ['required', 'string'],
            'tags'     => ['nullable', 'array'],
            'tags.*'   => ['string', 'max:50'],
            'pdf'   => ['nullable', 'array'],
            'pdf.*' => ['required', 'file', 'mimes:pdf', 'max:51200'],
            'is_published' => ['required', 'boolean'],
        ];
    }
}
