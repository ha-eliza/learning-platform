<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('submissions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('material_id')->with('type', 'practic')->foreignId('material_id')->constrained()->onDelete('cascade');

            $table->string('file_url')->nullable();
            $table->enum('status', ['pending', 'verified', 'rejected'])->default('pending');

            $table->string('teacher_comment')->nullable();
            $table->tinyInteger('grade')->nullable();
            $table->string('comment')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('submissions');
    }
};
