<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'specialty_id',
        'hospital_id',
        'is_admin',
        'is_active',
        'profile_picture',
        'signature_image',
        'stamp_image',
    ];

    protected $casts = [
        'is_admin'  => 'boolean',
        'is_active' => 'boolean',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Relación con la especialidad del usuario
     */
    public function specialty()
    {
        return $this->belongsTo(Specialty::class);
    }

    /**
     * Relación con el hospital del usuario
     */
    public function hospital()
    {
        return $this->belongsTo(Hospital::class);
    }
}
