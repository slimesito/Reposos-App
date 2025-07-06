<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('ciudadano_id');  // Columna sin FK automática
            $table->foreignId('last_reposo_id')->nullable()->constrained('reposos')->onDelete('set null');
            $table->foreignId('last_hospital_id')->nullable()->constrained('hospitals')->onDelete('set null');
            $table->timestamps();
        });

        // Crear FK manualmente para ciudadano_id
        DB::statement('
            ALTER TABLE patients
            ADD CONSTRAINT patients_ciudadano_id_foreign
            FOREIGN KEY (ciudadano_id)
            REFERENCES ciudadano.ciudadanos(id)
            ON DELETE CASCADE
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Eliminar FK manualmente primero
        DB::statement('ALTER TABLE patients DROP CONSTRAINT IF EXISTS patients_ciudadano_id_foreign');

        Schema::dropIfExists('patients');
    }
};
