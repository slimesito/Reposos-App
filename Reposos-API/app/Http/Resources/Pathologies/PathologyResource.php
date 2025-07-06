<?php

namespace App\Http\Resources\Pathologies;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Request;

class PathologyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'name'          => $this->name,
            'specialty'     => [
                'id'   => $this->specialty->id,
                'name' => $this->specialty->name,
            ],
            'days'          => $this->days,
            'created_at'    => $this->created_at->toDateTimeString(),
            'updated_at'    => $this->updated_at->toDateTimeString(),
        ];
    }
}
