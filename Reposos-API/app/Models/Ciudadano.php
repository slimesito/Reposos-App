<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ciudadano extends Model
{
    protected $connection = 'pgsql_ciudadano';
    protected $table = 'ciudadanos';
    protected $primaryKey = 'id';

    // Relación con pacientes
    public function patient()
    {
        return $this->hasOne(Patient::class);
    }

    // Relación con reposos
    public function reposos()
    {
        return $this->hasMany(Reposo::class);
    }
}
