<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reposo extends Model
{
    use HasFactory;

    protected $table = 'reposos';

    protected $fillable = [
        'ciudadano_id',
        'specialty_id',
        'pathology_id',
        'start_date',
        'end_date',
        'description',
        'created_by',
        'hospital_id'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    // Relación con Ciudadano (en otro esquema)
    public function ciudadano(): BelongsTo
    {
        return $this->belongsTo(Ciudadano::class);
    }

    // Relación con Specialty
    public function specialty(): BelongsTo
    {
        return $this->belongsTo(Specialty::class);
    }

    // Relación con Pathology
    public function pathology(): BelongsTo
    {
        return $this->belongsTo(Pathology::class);
    }

    // Relación con Usuario (creador)
    public function creador(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Relación con Hospital
    public function hospital(): BelongsTo
    {
        return $this->belongsTo(Hospital::class);
    }
}
