<?php

namespace App\Http\Controllers\API\Specialties;

use App\Http\Controllers\Controller;
use App\Http\Requests\Specialties\SpecialtyStoreRequest;
use App\Http\Requests\Specialties\SpecialtyUpdateRequest;
use App\Http\Resources\Specialties\SpecialtyResource;
use App\Models\Specialty;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SpecialtyController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth:sanctum' /*, 'is_admin'*/]);
    }

    /**
     * Lista specialties con filtros y paginación.
     */
    public function index(Request $request)
    {
        $query = Specialty::query();

        if ($name = $request->query('name')) {
            $query->where('name', 'ILIKE', "%{$name}%");
        }
        if ($request->boolean('with_pathologies')) {
            $query->with('pathologies');
        }

        $query->orderBy('id');

        $perPage = $request->query('per_page', 15);
        $paginated = $query->paginate($perPage)->appends($request->query());

        return SpecialtyResource::collection($paginated);
    }

    /**
     * Crea una nueva specialty.
     */
    public function store(SpecialtyStoreRequest $request): JsonResponse
    {
        $specialty = Specialty::create($request->validated());

        return response()->json([
            'message'   => 'Especialidad creada correctamente.',
            'specialty'=> new SpecialtyResource($specialty),
        ], 201);
    }

    /**
     * Actualiza una specialty existente.
     */
    public function update(SpecialtyUpdateRequest $request, Specialty $specialty): JsonResponse
    {
        $specialty->update($request->validated());

        return response()->json([
            'message'   => 'Especialidad actualizada correctamente.',
            'specialty'=> new SpecialtyResource($specialty),
        ]);
    }

    /**
     * Elimina una specialty.
     */
    public function destroy(Specialty $specialty): JsonResponse
    {
        $specialty->delete();

        return response()->json([
            'message' => 'Especialidad eliminada correctamente.',
        ]);
    }
}
