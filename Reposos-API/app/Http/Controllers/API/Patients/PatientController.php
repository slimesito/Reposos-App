<?php

namespace App\Http\Controllers\API\Patients;

use App\Http\Controllers\Controller;
use App\Http\Resources\Patients\PatientResource; // 1. Importa el Resource
use App\Models\Patient;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    public function index()
    {
        // 2. Carga las relaciones 'ciudadano' y 'lastHospital' junto con los pacientes.
        //    Usamos paginate() para un mejor rendimiento.
        $patients = Patient::with(['ciudadano', 'lastHospital', 'reposos'])->paginate(25);

        // 3. Usa el Resource para asegurar que la respuesta JSON tenga el formato correcto.
        return PatientResource::collection($patients);
    }

    public function show($id)
    {
        try {
            // Carga también las relaciones para la vista individual.
            $patient = Patient::with(['ciudadano', 'lastHospital', 'reposos'])->findOrFail($id);

            // Usa el Resource para una respuesta consistente.
            return new PatientResource($patient);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Paciente no encontrado.',
            ], 404);
        }
    }
}
