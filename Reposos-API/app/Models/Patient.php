<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Patient extends Model
{
    use HasFactory;

    protected $table = 'patients';

    protected $fillable = [
        'ciudadano_id',
        'last_reposo_id',
        'last_hospital_id'
    ];

    // Relación con Ciudadano (en otro esquema)
    public function ciudadano(): BelongsTo
    {
        return $this->belongsTo(Ciudadano::class);
    }

    // Relación con último reposo
    public function lastReposo(): BelongsTo
    {
        return $this->belongsTo(Reposo::class, 'last_reposo_id');
    }

    // Relación con último hospital
    public function lastHospital(): BelongsTo
    {
        return $this->belongsTo(Hospital::class, 'last_hospital_id');
    }

    public function reposos(): HasMany
    {
        return $this->hasMany(Reposo::class, 'ciudadano_id', 'ciudadano_id');
    }
}
