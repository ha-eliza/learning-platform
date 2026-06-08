<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMaterialRequest;
use App\Models\Category;
use App\Models\Material;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\RedirectResponse;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Str;
use ZipArchive;

class MaterialController extends Controller
{
    public function getTeacherManuals(Request $request): Response
    {
        $teacherId = $request->user()->id;

        $manuals = Material::where('user_id', $teacherId)
            ->where('type', 'manual')
            ->with('category')
            ->latest()
            ->get();

        return Inertia::render('Materials/Manuals', [
            'manuals' => $manuals
        ]);
    }
    public function getTeacherPracticums(Request $request): Response
    {
        $teacherId = $request->user()->id;

        $practicums = Material::where('user_id', $teacherId)
            ->where('type', 'practic')
            ->with('category')
            ->latest()
            ->get();

        return Inertia::render('Materials/Practicums', [
            'practicums' => $practicums
        ]);
    }
    public function create()
    {
        return inertia('Materials/Create');
    }
    public function store(StoreMaterialRequest $request)
    {
        $validated = $request->validated();
        $storedFiles = [];

        if ($request->hasFile('pdf')) {
            foreach ($request->file('pdf') as $file) {
                $path = $file->store('materials', 'public');
                $storedFiles[] = \Illuminate\Support\Facades\Storage::url($path);
            }
        }

        Material::create([
            'title'       => $validated['title'],
            'content'     => $validated['content'] ?? '',
            'user_id'     => Auth::id(),
            'category_id' => $validated['category'],
            'type'        => $validated['type'],
            'url'         => $validated['url'],
            'tags'        => $validated['tags'] ?? [],
            'file_url'    => $storedFiles,
            'is_published' => $validated['is_published'],
        ]);

        return redirect('/dashboard')->with('success', 'Материал успешно опубликован.');
    }
    public function show(string $url_slug)
    {
        $material = Material::with(['user:id,name', 'category:id,name'])
            ->where('url', $url_slug)
            ->firstOrFail();
        $isFavorite = false;
        if (Auth::check()) {
            $isFavorite = DB::table('favorites')
                ->where('user_id', Auth::id())
                ->where('material_id', $material->id)
                ->exists();
        }
        return Inertia::render('Materials/Show', [
            'material' => [
                'id'       => $material->id,
                'title'    => $material->title,
                'type' => $material->type,
                'content'  => $material->content, // Текст в формате Markdown
                'teacher'  => $material->user->name ?? 'Не указан',
                'category' => $material->category->name ?? 'Общее',
                'tags' => $material->tags ?? 'Без тегов',
                'date'     => $material->created_at->toISOString(),
                'fileUrl'  => is_array($material->file_url) ? $material->file_url : json_decode($material->file_url) ?? [],
                'is_favorite' => $isFavorite,
            ]
        ]);
    }
    public function destroy(Request $request, int $id): RedirectResponse
    {
        $material = Material::where('user_id', $request->user()->id)
            ->where('id', $id)
            ->firstOrFail();

        if (!empty($material->file_url)) {
            foreach ($material->file_url as $filePath) {
                if (Storage::disk('public')->exists($filePath)) {
                    Storage::disk('public')->delete($filePath);
                }
            }
        }

        $material->delete();

        return redirect()->back()->with('success', 'Материал успешно удален');
    }
    public function edit(int $id): Response
    {
        // Проверяем принадлежность материала текущему автору
        $material = Material::where('user_id', Auth::id())
            ->findOrFail($id);

        // Получаем категории для выпадающего списка
        $categories = Category::select('id', 'name')->get();

        return Inertia::render('Materials/Edit', [
            'material' => $material,
            'categories' => $categories
        ]);
    }
    public function update(StoreMaterialRequest $request, int $id): RedirectResponse
    {
        $material = Material::where('user_id', Auth::id())->findOrFail($id);

        $request->validate([
            'title'    => 'required|string|max:255',
            'category' => 'required|exists:categories,id',
            'pdf'      => 'nullable|array',
            'pdf.*'    => 'file|max:20480',
        ]);

        $existingFiles = $request->input('existing_files') ? $request->input('existing_files') : [];
        if (!is_array($existingFiles)) {
            $existingFiles = array_filter([$existingFiles]);
        }

        $currentFiles = is_array($material->file_url) ? $material->file_url : (json_decode($material->file_url, true) ?? []);

        foreach ($currentFiles as $oldFileUrl) {
            if (!in_array($oldFileUrl, $existingFiles)) {
                $pathToDelete = str_replace('/storage/', '', $oldFileUrl);
                Storage::disk('public')->delete($pathToDelete);
            }
        }

        $newFilePaths = [];
        if ($request->hasFile('pdf')) {
            foreach ($request->file('pdf') as $file) {
                $path = '/storage/' . $file->store('materials', 'public');
                $newFilePaths[] = $path;
            }
        }

        $finalFileUrls = array_merge($existingFiles, $newFilePaths);

        $material->update([
            'title'        => $request->input('title'),
            'url'          => $request->input('url'),
            'content'      => $request->input('content'),
            'type'         => $request->input('type'),
            'category_id'  => $request->input('category'),
            'is_published' => $request->input('is_published') === '1',
            'tags'         => $request->input('tags', []),
            'file_url'     => $finalFileUrls,
        ]);

        return redirect('/dashboard')->with('success', 'Материал успешно обновлен');
    }
    public function downloadFiles(Material $material)
    {
        $files = is_array($material->file_url)
            ? $material->file_url
            : (json_decode($material->file_url, true) ?? []);
        $zip = new ZipArchive();
        $zipFileName = Str::slug($material->title, '_') . '_all_materials.zip';
        $zipPath = storage_path('app/public/' . $zipFileName);
        if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) === true) {
            $converter = new \League\CommonMark\GithubFlavoredMarkdownConverter();
            $htmlContent = $converter->convert($material->content ?? '')->getContent();
            $pdf = Pdf::loadView('pdf.material', [
                'title'    => $material->title,
                'content'  => $htmlContent,
                'teacher'  => $material->user->name ?? 'Преподаватель',
                'category' => $material->category->name ?? 'Без категории',
                'date'     => $material->created_at ? $material->created_at->format('d.m.Y') : now()->format('d.m.Y'),
            ]);
            $pdfOutput = $pdf->output();
            $pdfFileName = Str::slug($material->title, '_') . '_инструкция.pdf';
            $zip->addFromString($pdfFileName, $pdfOutput);
            if (!empty($files)) {
                foreach ($files as $fileUrl) {
                    $relativeId = str_replace('/storage/', '', $fileUrl);

                    if (Storage::disk('public')->exists($relativeId)) {
                        $fullPath = Storage::disk('public')->path($relativeId);
                        $zip->addFile($fullPath, basename($fullPath));
                    }
                }
            }
            $zip->close();
            return response()->download($zipPath)->deleteFileAfterSend(true);
        }

        return redirect()->back()->with('error', 'Не удалось сформировать архив материалов');
    }
}
