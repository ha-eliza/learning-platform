<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
    Schema::create('materials', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->text('content')->nullable();

        $table->string('url')->unique();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->foreignId('category_id')->constrained()->onDelete('cascade');

        $table->boolean('is_published')->default(false);
        $table->enum('type', ['manual', 'practic']);
        $table->json('tags')->nullable();
        $table->json('file_url')->nullable();
        $table->timestamps();
    });
    }
    public function down(): void
    {
        Schema::dropIfExists('materials');
    }
};
