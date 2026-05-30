<?php

namespace App\Http\Controllers;

use App\Models\Material;
use App\Models\Submission;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LibraryController extends Controller
{
    /**
     * Вывод главной страницы библиотеки
     */
    public function index()
    {
        $user = Auth::user();
        $userId = \Illuminate\Support\Facades\Auth::id();
        $materials = Material::where('is_published', true)->get()->map(function ($material) use ($userId) {
            $isSubmitted = Submission::where('user_id', $userId)
            ->with('category')
            ->where('material_id', $material->id)
            ->whereIn('status', ['pending', 'verified'])
            ->exists();
            return [
                'id' => $material->id,
                'url' => $material->url,
                'title' => $material->title,
                'content' => $material->content,
                'teacher' => $material->user->name ?? 'teacher',
                'tags' => is_string($material->tags) ? json_decode($material->tags) : $material->tags ?? [],
                'date' => $material->created_at ? $material->created_at->toISOString() : now()->toISOString(),
                'category' => $material->category->name,
                'type' => $material->type ?? 'manual',
                'fileUrl' => is_array($material->file_url) ? $material->file_url : (json_decode($material->file_url, true) ?? []),
                'is_submitted' => $isSubmitted,
            ];
        });

        return Inertia::render('Welcome', [
            'materials' => $materials,
            'studentWorks' => $user && !$user->is_teacher
            ? Submission::where('user_id', $user->id)->get()
            : []
        ]);
    }
}
