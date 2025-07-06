<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hospital extends Model
{
    use HasFactory;

    protected $table = 'hospitals';
    protected $fillable = ['name', 'city_id'];

    /**
     * Relación con la ciudad del hospital
     */
    public function city()
    {
        return $this->belongsTo(City::class);
    }

    /**
     * Relación con los usuarios del hospital
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }

    // Relación con reposos
    public function reposos()
    {
        return $this->hasMany(Reposo::class);
    }

    // Relación con pacientes (como último hospital)
    public function patientsLast()
    {
        return $this->hasMany(Patient::class, 'last_hospital_id');
    }
}
