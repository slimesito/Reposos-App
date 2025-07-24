<?php

namespace App\Http\Controllers\API\Reposos;

use App\Http\Controllers\Controller;
use App\Http\Requests\Reposos\ReposoStoreRequest;
use App\Http\Resources\Reposos\ReposoResource;
use App\Models\Reposo;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

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
     * - Si el usuario es admin, ve todos los reposos del ciudadano.
     * - Si no es admin, solo ve los reposos que él mismo creó para ese ciudadano.
     */
    public function show($ciudadanoId)
    {
        $user = Auth::user();
        $query = Reposo::where('ciudadano_id', $ciudadanoId)
            ->with(['specialty', 'pathology', 'hospital', 'creador']);

        // --- FIX: Se añade la condición de seguridad ---
        if (!$user->is_admin) {
            $query->where('created_by', $user->id);
        }

        $reposos = $query->orderBy('start_date', 'desc')->get();

        return ReposoResource::collection($reposos);
    }

    /**
     * Listar reposos.
     * - Si el usuario es admin, lista todos los reposos del sistema.
     * - Si no es admin, lista únicamente los reposos creados por él.
     */
    public function index()
    {
        $user = Auth::user(); // 2. Obtenemos el usuario autenticado
        $query = Reposo::with(['ciudadano', 'specialty', 'pathology', 'hospital', 'creador']);

        // --- FIX: Se añade la condición de seguridad ---
        // 3. Si el usuario NO es administrador, filtramos por su ID.
        if (!$user->is_admin) {
            $query->where('created_by', $user->id);
        }

        $reposos = $query->orderBy('start_date', 'desc')
            ->paginate(15);

        return ReposoResource::collection($reposos);
    }
}
