<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Material extends Model
{
    protected $fillable = [ 'title', 'url', 'content', 'user_id', 'category_id', 'type', 'tags', 'file_url', 'is_published',
    ];
    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
            'tags' => 'array',
            'file_url' => 'array',
        ];
    }
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
