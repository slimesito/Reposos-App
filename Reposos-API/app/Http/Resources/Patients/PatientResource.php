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

            // Incluimos el objeto completo del ciudadano
            'ciudadano' => [
                'id' => $this->ciudadano->cedula, // Usando la cédula como ID
                'name' => $this->ciudadano->name, // Usando el accessor para el nombre completo
            ],

            // Incluimos las relaciones cargadas
            'lastHospital' => new HospitalResource($this->whenLoaded('lastHospital')),
            'reposos' => ReposoResource::collection($this->whenLoaded('reposos')),
        ];
    }
}
