<?php

namespace App\Http\Resources\Auth;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'name'             => $this->name,
            'email'            => $this->email,
            'specialty'        => $this->specialty?->name,
            'hospital'         => $this->hospital?->name,
            'is_admin'         => $this->is_admin,
            'is_active'        => $this->is_active,
            'profile_picture'  => $this->profile_picture ? Storage::url($this->profile_picture) : null,
            'signature_image'  => $this->signature_image ? Storage::url($this->signature_image) : null,
            'stamp_image'      => $this->stamp_image ? Storage::url($this->stamp_image) : null,
        ];
    }
}
// This resource transforms the User model into a JSON response, including related models like specialty and hospital.
