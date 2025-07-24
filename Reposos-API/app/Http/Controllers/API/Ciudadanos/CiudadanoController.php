<?php

namespace App\Http\Controllers\API\Ciudadanos;

use App\Http\Controllers\Controller;
use App\Models\Ciudadano;
use Illuminate\Http\Request;

class CiudadanoController extends Controller
{
    public function __construct()
    {
        // Protegemos la ruta para que solo usuarios autenticados puedan buscar
        $this->middleware('auth:sanctum');
    }

    /**
     * Busca un ciudadano por su cédula y devuelve su ID y nombre.
     */
    public function findByCedula($cedula)
    {
        $ciudadano = Ciudadano::on('pgsql_ciudadano')->where('cedula', $cedula)->first();

        if (!$ciudadano) {
            return response()->json(['message' => 'Ciudadano no encontrado con la cédula proporcionada.'], 404);
        }

        // Devolvemos los datos necesarios para el frontend
        return response()->json([
            'id'   => $ciudadano->id,
            'cedula' => $ciudadano->cedula,
            'name' => $ciudadano->name, // Usando el accessor de nombre completo
        ]);
    }
}
