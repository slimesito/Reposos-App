<?php

namespace App\Http\Controllers\API\Pathologies;

use App\Http\Controllers\Controller;
use App\Http\Requests\Pathologies\PathologyStoreRequest;
use App\Http\Requests\Pathologies\PathologyUpdateRequest;
use App\Http\Resources\Pathologies\PathologyResource;
use App\Models\Pathology;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PathologyController extends Controller
{
    public function __construct()
    {
        // Protege con Sanctum y, si quieres, con is_admin
        $this->middleware(['auth:sanctum' /*, 'is_admin'*/]);
    }

    /**
     * Lista patologías con paginación y filtros.
     */
    public function index(Request $request)
    {
        $query = Pathology::with('specialty');

        // Filtros permitidos
        if ($v = $request->query('name')) {
            $query->where('name', 'ILIKE', "%{$v}%");
        }
        if ($v = $request->query('specialty_id')) {
            $query->where('specialty_id', $v);
        }
        if (! is_null($v = $request->query('days'))) {
            $query->where('days', $v);
        }

        $perPage = (int)$request->query('per_page', 15);
        $pags = $query->paginate($perPage)->appends($request->query());

        return PathologyResource::collection($pags);
    }

    /**
     * Crea una nueva patología.
     */
    public function store(PathologyStoreRequest $request): JsonResponse
    {
        $pathology = Pathology::create($request->validated());

        return response()->json([
            'message'   => 'Patología creada.',
            'pathology' => new PathologyResource($pathology),
        ], 201);
    }

    /**
     * Actualiza una patología existente.
     */
    public function update(PathologyUpdateRequest $request, Pathology $pathology): JsonResponse
    {
        $pathology->update($request->validated());

        return response()->json([
            'message'   => 'Patología actualizada.',
            'pathology' => new PathologyResource($pathology),
        ]);
    }

    /**
     * Elimina una patología.
     */
    public function destroy(Pathology $pathology): JsonResponse
    {
        $pathology->delete();

        return response()->json([
            'message' => 'Patología eliminada.',
        ]);
    }
}
