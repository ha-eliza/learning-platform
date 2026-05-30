<?php

use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\LibraryController;
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SubmissionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/', [LibraryController::class, 'index'])->name('home');
    Route::get('/dashboard', [ProfileController::class, 'index'])->name('dashboard');

    Route::get('/create', [MaterialController::class, 'create'])->name('materials.create');
    Route::post('/materials', [MaterialController::class, 'store'])->name('materials.store');
    Route::get('/materials/{id}/edit', [MaterialController::class, 'edit'])->name('materials.edit');
    Route::put('/materials/{id}', [MaterialController::class, 'update'])->name('materials.update');
    Route::delete('/materials/{id}', [MaterialController::class, 'destroy'])->name('materials.destroy');
    Route::get('/materials/{url_slug}', [MaterialController::class, 'show'])
        ->where('url_slug', '[a-z0-9\-]+')
        ->name('materials.show');
    Route::post('/materials/{id}/favorite', [FavoriteController::class, 'toggle'])
        ->name('materials.favorite');
    Route::get('/materials/{material}/download-files', [MaterialController::class, 'downloadFiles'])->name('materials.download-files');

    Route::post('/submissions', [SubmissionController::class, 'store'])
        ->name('submissions.store');
    Route::put('/submissions/{submission}', [SubmissionController::class, 'update'])
    ->name('submissions.update');
    Route::post('/submissions/grade', [SubmissionController::class, 'grade'])
        ->name('submissions.grade');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');

    Route::get('/manuals', [MaterialController::class, 'getTeacherManuals'])->name('materials.manuals');
    Route::get('/practicums', [MaterialController::class, 'getTeacherPracticums'])->name('materials.practicums');
});

require __DIR__ . '/auth.php';
