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
            'ciudadano_id' => $this->ciudadano_id,
            'start_date'   => $this->start_date->format('Y-m-d'),
            'end_date'     => $this->end_date->format('Y-m-d'),
            'description'  => $this->description,
            'created_at'   => $this->created_at->format('Y-m-d H:i:s'),

            // Relaciones cargadas condicionalmente
            'specialty'    => new SpecialtyResource($this->whenLoaded('specialty')),
            'pathology'    => new PathologyResource($this->whenLoaded('pathology')),
            'hospital'     => new HospitalResource($this->whenLoaded('hospital')),
            'creador'      => new UserResource($this->whenLoaded('creador')),

            // Si el modelo 'Ciudadano' no tiene un Resource, puedes devolverlo como un objeto simple.
            'ciudadano'    => $this->whenLoaded('ciudadano'),
        ];
    }
}
