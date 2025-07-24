<?php

namespace App\Http\Resources\Reposos;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Auth\UserResource;
use App\Http\Resources\Specialties\SpecialtyResource;
use App\Http\Resources\Pathologies\PathologyResource;
use App\Http\Resources\Hospitals\HospitalResource;

class ReposoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'ciudadano_id' => $this->ciudadano_id, // Mantenemos el ID como referencia
            'start_date'   => $this->start_date->format('Y-m-d'),
            'end_date'     => $this->end_date->format('Y-m-d'),
            'description'  => $this->description,
            'created_at'   => $this->created_at->format('Y-m-d H:i:s'),

            // --- FIX: Se define explícitamente el objeto 'ciudadano' ---
            // Esto asegura que siempre se incluyan la cédula y el nombre completo.
            'ciudadano'    => $this->whenLoaded('ciudadano', function () {
                return [
                    'id'     => $this->ciudadano->id,
                    'cedula' => $this->ciudadano->cedula,
                    'name'   => $this->ciudadano->name, // Usando el accessor de nombre completo
                ];
            }),

            // Relaciones cargadas condicionalmente
            'specialty'    => new SpecialtyResource($this->whenLoaded('specialty')),
            'pathology'    => new PathologyResource($this->whenLoaded('pathology')),
            'hospital'     => new HospitalResource($this->whenLoaded('hospital')),
            'creador'      => new UserResource($this->whenLoaded('creador')),
        ];
    }
}
