<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reposos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ciudadano_id')->constrained('ciudadano.ciudadanos')->onDelete('cascade');
            $table->foreignId('specialty_id')->constrained('specialties')->onDelete('cascade');
            $table->foreignId('pathology_id')->constrained('pathologies')->onDelete('cascade');
            $table->date('start_date')->default(now());
            $table->date('end_date');
            $table->string('description')->nullable();
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->foreignId('hospital_id')->constrained('hospitals')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reposos');
    }
};
