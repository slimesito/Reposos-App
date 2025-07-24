<?php

namespace App\Http\Resources\Ciudadanos;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CiudadanoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'     => $this->id,
            'cedula' => $this->cedula,
            // Esto usa el accessor 'name' de tu modelo Ciudadano para el nombre completo
            'name'   => $this->name,
        ];
    }
}
