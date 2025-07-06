<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RegisterUserRequest extends FormRequest
{
    public function authorize()
    {
        // Sólo un usuario autenticado, admin y activo puede proceder
        $user = $this->user();
        return $user && $user->is_admin && $user->is_active;
    }

    public function rules(): array
    {
        return [
            'name'            => 'required|string|max:255',
            'email'           => 'required|email|unique:users,email',
            'specialty_id'    => 'nullable|exists:specialties,id',
            'hospital_id'     => 'nullable|exists:hospitals,id',
            'is_admin'        => 'boolean',
            'is_active'       => 'boolean',
            'profile_picture'   => 'nullable|image|max:2048',    // jpeg,png,gif,bmp,svg,webp
            'signature_image' => 'nullable|image|max:2048',   // jpeg,png,gif,bmp,svg,webp
            'stamp_image'     => 'nullable|image|max:2048',   // jpeg,png,gif,bmp,svg,webp
        ];
    }

    public function messages()
    {
        return [
            'authorize' => 'No tienes permisos para registrar usuarios.',
        ];
    }
}
