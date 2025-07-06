<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pathology extends Model
{
    use HasFactory;

    protected $table = 'pathologies';
    protected $fillable = [
        'name',
        'specialty_id',
        'days'
    ];

    /**
     * Relación con la especialidad de la patología
     */
    public function specialty()
    {
        return $this->belongsTo(Specialty::class);
    }

    /**
     * Accesor para días: asegura valor positivo
     */
    public function getDaysAttribute($value)
    {
        return max(0, $value); // Nunca negativo
    }

    /**
     * Mutador para días: asegura valor entero
     */
    public function setDaysAttribute($value)
    {
        $this->attributes['days'] = abs((int)$value); // Convierte a entero positivo
    }
}
