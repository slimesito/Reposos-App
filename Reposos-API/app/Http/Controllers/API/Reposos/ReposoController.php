<?php

namespace App\Http\Controllers\API\Reposos;

use App\Http\Controllers\Controller;
use App\Models\Ciudadano;
use App\Models\Reposo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class ReposoController extends Controller
{
    /**
     * Registrar un nuevo reposo.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'ciudadano_id' => ['required'],
            'specialty_id' => ['required', 'exists:specialties,id'],
            'pathology_id' => ['required', 'exists:pathologies,id'],
            'start_date'   => ['required', 'date'],
            'end_date'     => ['required', 'date', 'after_or_equal:start_date'],
            'description'  => ['nullable', 'string'],
            'hospital_id'  => ['required', 'exists:hospitals,id'],
        ]);

        // Validación manual contra otra conexión
        if (!Ciudadano::on('pgsql_ciudadano')->where('id', $data['ciudadano_id'])->exists()) {
            throw ValidationException::withMessages([
                'ciudadano_id' => ['El ciudadano no existe.']
            ]);
        }

        $reposo = Reposo::create([
            ...$data,
            'created_by' => auth()->id()
        ]);

        return response()->json([
            'message' => 'Reposo registrado exitosamente.',
            'reposo'  => $reposo
        ], 201);
    }

    /**
     * Mostrar el historial de reposos de un ciudadano.
     */
    public function show($ciudadanoId)
    {
        $reposos = Reposo::where('ciudadano_id', $ciudadanoId)
            ->with(['specialty', 'pathology', 'hospital'])
            ->get();

        return response()->json([
            'reposos' => $reposos
        ]);
    }

    /**
     * Listar todos los reposos.
     */
    public function index()
    {
        $reposos = Reposo::with(['ciudadano', 'specialty', 'pathology', 'hospital'])
            ->orderBy('start_date', 'desc')
            ->get();

        return response()->json([
            'reposos' => $reposos
        ]);
    }
}
