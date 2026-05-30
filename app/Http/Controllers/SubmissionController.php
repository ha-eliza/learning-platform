<?php

namespace App\Http\Controllers;

use App\Http\Requests\GradeSubmissionRequest;
use App\Http\Requests\StoreSubmissionRequest;
use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class SubmissionController extends Controller
{
    public function store(StoreSubmissionRequest $request)
    {
        $validated = $request->validated();
        $path = null;
        if ($request->hasFile('file')) {
            $path = '/storage/' . $request->file('file')->store('submissions', 'public');
        }
        Submission::create([
            'user_id'     => Auth::id(),
            'material_id' => $validated['material_id'],
            'file_url'    => $path,
            'status'      => 'pending',
            'comment'     => $validated['comment'] ?? null,
        ]);
        return redirect()->back();
    }
    public function update(Request $request, Submission $submission)
    {
        $submission->comment = $request->input('comment');
        $submission->teacher_comment = null;
        if ($request->hasFile('file')) {
            if ($submission->file_url) {
                $oldPath = str_replace('/storage/', '', $submission->file_url);
                Storage::disk('public')->delete($oldPath);
            }
            $path = '/storage/' . $request->file('file')->store('submissions', 'public');
            $submission->file_url = $path;
        }
        $submission->status = 'pending';
        $submission->save();
        return redirect()->back()->with('success', 'Решение успешно обновлено');
    }
    public function grade(GradeSubmissionRequest $request)
    {
        $validated = $request->validated();
        $submission = Submission::findOrFail($validated['submission_id']);
        $submission->update([
            'status'  => $validated['status'],
            'grade'   => $validated['status'] === 'verified' ? $validated['grade'] : null,
            'teacher_comment' => $validated['teacher_comment'] ?? null,
        ]);
        return redirect()->back()->with('success', 'Результат проверки успешно сохранен.');
    }
}
