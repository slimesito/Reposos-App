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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('email', 254)->unique();
            $table->string('password', 255);
            $table->foreignId('specialty_id')->nullable()->constrained('specialties')->onDelete('set null');
            $table->foreignId('hospital_id')->nullable()->constrained('hospitals')->onDelete('set null');
            $table->boolean('is_admin')->default(false);
            $table->boolean('is_active')->default(true);
            $table->string('profile_picture')->nullable();
            $table->string('signature_image')->nullable();
            $table->string('stamp_image')->nullable();
            $table->rememberToken();
            $table->timestamps();

            $table->index('email');
            $table->index('is_active');
            $table->index(['hospital_id', 'specialty_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
