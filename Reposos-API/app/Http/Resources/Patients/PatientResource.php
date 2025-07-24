<?php

namespace App\Http\Resources\Patients;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Hospitals\HospitalResource;
use App\Http\Resources\Reposos\ReposoResource;

class PatientResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'ciudadano_id' => $this->ciudadano_id,

            // --- FIX: Asegúrate de que este bloque se vea así ---
            'ciudadano' => $this->whenLoaded('ciudadano', function () {
                return [
                    'id'     => $this->ciudadano->id,
                    'cedula' => $this->ciudadano->cedula, // <-- AÑADE ESTA LÍNEA
                    'name'   => $this->ciudadano->name,
                ];
            }),

            'lastHospital' => new HospitalResource($this->whenLoaded('lastHospital')),
            'reposos' => ReposoResource::collection($this->whenLoaded('reposos')),
        ];
    }
}
