<?php

namespace App\Http\Controllers\API\Patients;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    public function show($id)
    {
        try {
            $patient = Patient::with(['reposos', 'ciudadano'])->findOrFail($id);

            return response()->json([
                'patient' => $patient,
                'history' => $patient->reposos,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Paciente no encontrado.',
                'error' => 'No se encontró ningún paciente con el ID ' . $id,
            ], 404);
        }
    }

    public function index()
    {
        $patients = Patient::with(['reposos', 'ciudadano'])->get();

        return response()->json([
            'patients' => $patients,
        ]);
    }

}
