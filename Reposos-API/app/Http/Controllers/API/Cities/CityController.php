<?php

namespace App\Http\Controllers\API\Cities;

use App\Http\Controllers\Controller;
use App\Http\Resources\Cities\CityResource;
use App\Models\City;
use Illuminate\Http\Request;

class CityController extends Controller
{
    public function __construct()
    {
        // Protegemos la ruta para que solo usuarios autenticados puedan acceder
        $this->middleware('auth:sanctum');
    }

    /**
     * Muestra una lista de todas las ciudades.
     * No se pagina para poder usarse fácilmente en menús desplegables.
     */
    public function index()
    {
        $cities = City::orderBy('name')->get();
        return CityResource::collection($cities);
    }
}
