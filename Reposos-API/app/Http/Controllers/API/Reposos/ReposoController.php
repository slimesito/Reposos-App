<?php

namespace App\Http\Controllers\API\Reposos;

use App\Http\Controllers\Controller;
use App\Http\Requests\Reposos\ReposoStoreRequest;
use App\Http\Resources\Reposos\ReposoResource;
use App\Models\Reposo;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ReposoController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    /**
     * Registrar un nuevo reposo.
     */
    public function store(ReposoStoreRequest $request): JsonResponse
    {
        $data = $request->validated();
        $user = $request->user(); // Obtenemos el usuario autenticado

        // Verificamos que el usuario tenga un hospital asignado
        if (!$user->hospital_id) {
            return response()->json(['message' => 'El usuario no tiene un hospital asignado.'], 422);
        }

        $reposo = Reposo::create([
            ...$data,
            'created_by' => $user->id,
            // --- FIX: Se toma el hospital_id del usuario autenticado ---
            'hospital_id' => $user->hospital_id,
        ]);

        return response()->json([
            'message' => 'Reposo registrado exitosamente.',
            'reposo'  => new ReposoResource($reposo->load(['specialty', 'pathology', 'hospital', 'creador'])),
        ], 201);
    }

    /**
     * Mostrar el historial de reposos de un ciudadano.
     */
    public function show($ciudadanoId)
    {
        $reposos = Reposo::where('ciudadano_id', $ciudadanoId)
            // Se añade 'creador' para consistencia.
            ->with(['specialty', 'pathology', 'hospital', 'creador'])
            ->orderBy('start_date', 'desc')
            ->get();

        return ReposoResource::collection($reposos);
    }

    /**
     * Listar todos los reposos.
     */
    public function index()
    {
        $reposos = Reposo::with(['ciudadano', 'specialty', 'pathology', 'hospital', 'creador'])
            ->orderBy('start_date', 'desc')
            ->paginate(15); // Se recomienda paginar para no sobrecargar el frontend.

        return ReposoResource::collection($reposos);
    }
}
