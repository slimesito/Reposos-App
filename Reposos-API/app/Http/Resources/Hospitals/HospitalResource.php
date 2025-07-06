<?php

namespace App\Http\Resources\Hospitals;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Request;

class HospitalResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'      => $this->id,
            'name'    => $this->name,
            'city'    => [
                'id'   => $this->city->id,
                'name' => $this->city->name,
            ],
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
        ];
    }
}
