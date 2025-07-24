<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Ciudadano extends Model
{
    /**
     * La conexión de base de datos que debe ser usada por el modelo.
     *
     * @var string
     */
    protected $connection = 'pgsql_ciudadano';

    /**
     * La tabla asociada con el modelo.
     *
     * @var string
     */
    protected $table = 'ciudadanos';

    /**
     * FIX 1: Clave Primaria.
     * Aunque la tabla tiene un 'id' numérico, la 'cedula' es el identificador
     * único y natural que se usa en las relaciones con otras tablas.
     * Debemos decirle a Eloquent que use 'cedula' como la clave principal.
     */
    protected $primaryKey = 'id';

    /**
     * FIX 2: Tipo de Clave Primaria.
     * Como la 'cedula' es un texto (string), debemos especificarlo.
     */
    protected $keyType = 'string';

    /**
     * FIX 3: Desactivar Auto-incremento.
     * La 'cedula' no es un número que se auto-incrementa.
     */
    public $incrementing = false;

    /**
     * FIX 4: Nombres de las columnas de Timestamps.
     * Tu tabla usa 'fecha_creacion' y 'fecha_actualizacion' en lugar de los
     * nombres por defecto de Laravel ('created_at' y 'updated_at').
     */
    const CREATED_AT = 'fecha_creacion';
    const UPDATED_AT = 'fecha_actualizacion';

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     * Esto es útil para que Laravel maneje las fechas como objetos Carbon.
     *
     * @var array
     */
    protected $casts = [
        'fecha_nacimiento' => 'date',
        'fecha_fallecimiento' => 'date',
        'fecha_creacion' => 'datetime',
        'fecha_actualizacion' => 'datetime',
    ];

    /**
     * Los atributos que no son asignables masivamente.
     * Como este modelo es de solo lectura desde esta aplicación,
     * protegemos todos los campos por seguridad.
     *
     * @var array
     */
    protected $guarded = ['*'];

    /**
     * MEJORA: Accessor para el nombre completo.
     * Esto nos permite obtener el nombre y apellido juntos de forma sencilla
     * en cualquier parte de la aplicación, por ejemplo: $ciudadano->name
     */
    protected function name(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->nombres . ' ' . $this->apellidos,
        );
    }

    /**
     * Relación con el modelo Patient.
     *
     * FIX 5: Se especifican las claves foránea y local para asegurar
     * que la relación funcione correctamente con 'cedula'.
     */
    public function patient()
    {
        // El paciente tiene una columna 'ciudadano_id' que corresponde a nuestra 'cedula' local.
        return $this->hasOne(Patient::class, 'ciudadano_id', 'cedula');
    }

    /**
     * Relación con el modelo Reposo.
     */
    public function reposos()
    {
        // El reposo tiene una columna 'ciudadano_id' que corresponde a nuestra 'cedula' local.
        return $this->hasMany(Reposo::class, 'ciudadano_id', 'cedula');
    }
}
