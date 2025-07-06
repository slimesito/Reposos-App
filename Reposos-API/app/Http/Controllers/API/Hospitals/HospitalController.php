<?php

namespace App\Http\Controllers\API\Hospitals;

use App\Http\Controllers\Controller;
use App\Http\Requests\Hospitals\HospitalStoreRequest;
use App\Http\Requests\Hospitals\HospitalUpdateRequest;
use App\Http\Resources\Hospitals\HospitalResource;
use App\Models\Hospital;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class HospitalController extends Controller
{
    public function __construct()
    {
        // Protege con Sanctum y, si lo deseas, con is_admin:
        $this->middleware(['auth:sanctum' /*, 'is_admin'*/]);
    }

    /**
     * Lista hospitales (paginado + filtro por name o city_id).
     */
    public function index(Request $request)
    {
        $query = Hospital::with('city');

        if ($name = $request->query('name')) {
            $query->where('name', 'ILIKE', "%{$name}%");
        }
        if ($city = $request->query('city_id')) {
            $query->where('city_id', $city);
        }

        $perPage = (int)$request->query('per_page', 15);
        $hospitals = $query->paginate($perPage)->appends($request->query());

        return HospitalResource::collection($hospitals);
    }

    /**
     * Crea un nuevo hospital.
     */
    public function store(HospitalStoreRequest $request): JsonResponse
    {
        $hospital = Hospital::create($request->validated());

        return response()->json([
            'message'  => 'Hospital creado exitosamente.',
            'hospital' => new HospitalResource($hospital),
        ], 201);
    }

    /**
     * Actualiza un hospital existente.
     */
    public function update(HospitalUpdateRequest $request, Hospital $hospital): JsonResponse
    {
        $hospital->update($request->validated());

        return response()->json([
            'message'  => 'Hospital actualizado correctamente.',
            'hospital' => new HospitalResource($hospital),
        ]);
    }

    /**
     * Elimina un hospital.
     */
    public function destroy(Hospital $hospital): JsonResponse
    {
        $hospital->delete();

        return response()->json([
            'message' => 'Hospital eliminado correctamente.',
        ]);
    }
}
