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

            // Incluye el objeto del ciudadano si fue cargado
            'ciudadano' => $this->whenLoaded('ciudadano', function () {
                return [
                    'id' => $this->ciudadano->id,
                    // Esto usa el accessor 'name' de tu modelo Ciudadano para el nombre completo
                    'name' => $this->ciudadano->name,
                ];
            }),

            // Incluye el hospital y los reposos si fueron cargados
            'lastHospital' => new HospitalResource($this->whenLoaded('lastHospital')),
            'reposos' => ReposoResource::collection($this->whenLoaded('reposos')),
        ];
    }
}
