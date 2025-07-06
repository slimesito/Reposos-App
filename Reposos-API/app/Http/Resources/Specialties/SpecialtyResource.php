<?php

namespace App\Http\Resources\Specialties;

use App\Http\Resources\Pathologies\PathologyResource;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Request;

class SpecialtyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'name'       => $this->name,
            'pathologies'=> PathologyResource::collection($this->whenLoaded('pathologies')),
            'users_count'=> $this->when($request->query('with_user_count'), $this->users()->count()),
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
        ];
    }
}
