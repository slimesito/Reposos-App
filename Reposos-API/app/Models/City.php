<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    use HasFactory;

    protected $table = 'cities';
    protected $fillable = ['name'];

    /**
     * Relación con los hospitales de la ciudad
     */
    public function hospitals()
    {
        return $this->hasMany(Hospital::class);
    }
}
