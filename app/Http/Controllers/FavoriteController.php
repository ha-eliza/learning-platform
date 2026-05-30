<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class FavoriteController extends Controller
{
    /**
     * Добавление / Удаление материала из избранного
     */
    public function toggle(int $materialId)
    {
        $userId = Auth::id();

        // Ищем, сохранял ли уже пользователь этот материал
        $exists = DB::table('favorites')
            ->where('user_id', $userId)
            ->where('material_id', $materialId)
            ->first();

        if ($exists) {
            // Если уже сохранено — удаляем
            DB::table('favorites')->where('id', $exists->id)->delete();
            $isFavorite = false;
        } else {
            // Если нет — добавляем в избранное
            DB::table('favorites')->insert([
                'user_id' => $userId,
                'material_id' => $materialId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $isFavorite = true;
        }

        return redirect()->back()->with('success', $isFavorite ? 'Добавлено в сохраненное' : 'Удалено из сохраненного');
    }
}
