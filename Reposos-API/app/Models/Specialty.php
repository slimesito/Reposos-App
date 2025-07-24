<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Specialty extends Model
{
    use HasFactory;

    protected $table = 'specialties';
    protected $fillable = ['name'];

    /**
     * Relación con las patologías de la especialidad
     */
    public function pathologies()
    {
        return $this->hasMany(Pathology::class);
    }

    /**
     * Relación con los usuarios de la especialidad
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }

    /**
     * --- FIX: Se añade la relación que faltaba ---
     * Una especialidad puede tener muchos reposos.
     */
    public function reposos()
    {
        return $this->hasMany(Reposo::class);
    }
}
