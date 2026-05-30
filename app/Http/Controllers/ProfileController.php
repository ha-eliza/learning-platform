<?php

namespace App\Http\Controllers;

use App\Models\Material;
use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $favoriteMaterials = Material::whereIn('id', function ($query) use ($user) {
            $query->select('material_id')
                ->from('favorites')
                ->where('user_id', $user->id);
        })
            ->with(['user:id,name', 'category:id,name'])
            ->get()
            ->map(function ($material) {
                return [
                    'id'       => $material->id,
                    'title'    => $material->title,
                    'url'      => $material->url,
                    'type'     => $material->type,
                    'category' => $material->category->name ?? 'Общее',
                    'date'     => $material->created_at ? $material->created_at->format('d.m.Y') : now()->format('d.m.Y'),
                    'tags'     => is_string($material->tags) ? json_decode($material->tags) : $material->tags ?? [],
                ];
            });

        if ($user->role === 'student') {

            $studentWorks = Submission::where('user_id', $user->id)
                ->with([
                    'material:id,title,url,content,user_id',
                    'material.user:id,name,department'
                ])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($submission) {
                    return [
                        'id'              => $submission->id,
                        'status'          => $submission->status,
                        'grade'           => $submission->grade,
                        'comment'         => $submission->comment, // Текст студента
                        'teacher_comment' => $submission->teacher_comment,
                        'created_at'      => $submission->created_at->toISOString(),
                        'file_url'        => $submission->file_url, // Ссылка на файл работы
                        'material_title'  => $submission->material->title ?? 'Задание',
                        'material'        => [
                            'url'     => $submission->material->url ?? '',
                            'title'   => $submission->material->title ?? '',
                            'content' => $submission->material->content ?? '',
                            'teacher' => $submission->material->user->name ?? 'Не указан',
                            'department' => $submission->material->user->department ?? '',
                        ]
                    ];
                });


            $completedCount = Submission::where('user_id', $user->id)->where('status', 'verified')->count();
            $completedCount = Submission::where('user_id', $user->id)->where('status', 'verified')->count();

            $averageGrade = Submission::where('user_id', $user->id)
                ->where('status', 'verified')
                ->whereNotNull('grade')
                ->avg('grade');

            $averageGrade = $averageGrade ? round($averageGrade, 1) : 0;
        } else {
            // 1. Получаем ID материалов учителя
            $teacherMaterialIds = Material::where('user_id', $user->id)->pluck('id');

            // 2. Добавляем ВСЕ необходимые поля в жадную загрузку (with)
            $studentWorks = Submission::whereIn('material_id', $teacherMaterialIds)
                ->with([
                    // Обязательно подгружаем связи и нужные поля.
                    // Внешние ключи (например, material_id, user_id) должны быть в списке!
                    'user' => function ($query) {
                        $query->select('id', 'name', 'group');
                    },
                    'material' => function ($query) {
                        $query->select('id', 'title', 'url', 'content', 'file_url');
                    }
                ])
                ->orderByRaw("FIELD(status, 'pending', 'rejected', 'verified')")
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($submission) {
                    return [
                        'id'             => $submission->id,
                        'status'         => $submission->status,
                        'grade'          => $submission->grade,
                        'comment'        => $submission->comment,
                        // Защита от null для даты, если поля пустые
                        'created_at'     => $submission->created_at ? $submission->created_at->toISOString() : null,
                        'file_url'       => $submission->file_url,
                        'material_title' => $submission->material->title ?? 'Задание',
                        'user' => [
                            'name'  => $submission->user->name ?? 'Студент',
                            'group' => $submission->user->group ?? '—',
                        ],
                        'material' => [
                            'url'               => $submission->material->url ?? '',
                            'content'           => $submission->material->content ?? '',
                            'file_url_material' => $submission->material->file_url ?? '',
                        ]
                    ];
                });

            // 3. Подсчет количества на рассмотрении
            $pendingReviewCount = Submission::whereIn('material_id', $teacherMaterialIds)
                ->where('status', 'pending')
                ->count();

            $favoritesCount = count($favoriteMaterials);
            $totalMaterialsCount = $teacherMaterialIds->count();
        }
        return Inertia::render('Dashboard', [
            'recentMaterials'     => $favoriteMaterials,
            'studentWorks'        => $studentWorks,
            'completedCount'      => $user->role === 'student' ? ($completedCount ?? 0) : 0,
            'averageGrade'        => $user->role === 'student' ? ($averageGrade ?? 0) : 0,
            'pendingReviewCount'  => $user->role === 'teacher' ? ($pendingReviewCount ?? 0) : 0,
            'favoritesCount'      => $user->role === 'teacher' ? ($favoritesCount ?? 0) : 0,
            'totalMaterialsCount' => $user->role === 'teacher' ? ($totalMaterialsCount ?? 0) : 0,
        ]);
    }

    /**
     * Отображение личного кабинета
     */
    public function edit()
    {
        return Inertia::render('Profile/Edit', [
            'user' => Auth::user(),
        ]);
    }

    /**
     * Обновление ФИО, группы или кафедры
     */
    public function update(Request $request)
    {
        $user = Auth::user();

        $rules = [
            'name' => ['required', 'string', 'max:255'],
        ];

        if ($user->role === 'student') {
            $rules['group'] = ['required', 'string', 'max:50'];
        } else {
            $rules['department'] = ['required', 'string', 'max:255'];
        }

        $validated = $request->validate($rules);

        $user->update($validated);

        return redirect('/dashboard');
    }
}
