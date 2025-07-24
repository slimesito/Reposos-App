<?php

namespace App\Http\Controllers\API\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\Reposo;
use App\Models\User;
use App\Models\Specialty;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    /**
     * Devuelve las estadísticas principales del dashboard.
     */
    public function getStats()
    {
        $stats = [
            'reposos_today' => Reposo::whereDate('created_at', Carbon::today())->count(),
            'total_patients' => Patient::count(),
            'active_doctors' => User::where('is_admin', false)->where('is_active', true)->count(),
            'active_reposos' => Reposo::where('end_date', '>=', Carbon::today())->count(),
        ];

        return response()->json($stats);
    }

    /**
     * Devuelve la cuenta de reposos de los últimos 6 meses.
     */
    public function getMonthlyReposos()
    {
        $data = Reposo::select(
                // Formatea la fecha para obtener el nombre corto del mes (ej. 'Jul')
                DB::raw("to_char(created_at, 'Mon') as month"),
                DB::raw('count(*) as count')
            )
            ->where('created_at', '>=', Carbon::now()->subMonths(6))
            ->groupBy('month')
            ->orderBy(DB::raw("min(created_at)")) // Ordena por la fecha real para mantener el orden cronológico
            ->get();

        return response()->json($data);
    }

    /**
     * Devuelve la distribución de reposos por especialidad (Top 5).
     */
    public function getSpecialtyDistribution()
    {
        // --- FIX: Se utiliza una consulta más directa y robusta con 'join' ---
        $data = Specialty::query()
            // Une la tabla de especialidades con la de reposos
            ->join('reposos', 'specialties.id', '=', 'reposos.specialty_id')
            // Selecciona el nombre de la especialidad y cuenta los reposos, nombrando el resultado 'value'
            ->select('specialties.name', DB::raw('count(reposos.id) as value'))
            // Agrupa los resultados por especialidad para que la cuenta sea correcta
            ->groupBy('specialties.id', 'specialties.name')
            // Ordena de mayor a menor según la cantidad de reposos
            ->orderBy('value', 'desc')
            // Limita a las 5 especialidades con más reposos
            ->limit(5)
            ->get();

        return response()->json($data);
    }

    /**
     * Devuelve los 5 reposos más recientes.
     */
    public function getRecentReposos()
    {
        $reposos = Reposo::with(['ciudadano', 'creador'])
            ->latest() // Es un atajo para orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($reposo) {
                return [
                    'id' => 'REP-' . str_pad($reposo->id, 3, '0', STR_PAD_LEFT),
                    'patient' => $reposo->ciudadano->name ?? 'N/A',
                    'date' => Carbon::parse($reposo->created_at)->format('Y-m-d'),
                    'days' => Carbon::parse($reposo->start_date)->diffInDays(Carbon::parse($reposo->end_date)) + 1,
                    'doctor' => $reposo->creador->name ?? 'N/A',
                ];
            });

        return response()->json($reposos);
    }
}
