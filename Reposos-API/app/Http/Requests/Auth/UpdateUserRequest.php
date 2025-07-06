<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\User;

class UpdateUserRequest extends FormRequest
{
    public function authorize()
    {
        // Sólo un usuario autenticado, admin y activo puede proceder
        $user = $this->user();
        return $user && $user->is_admin && $user->is_active;
    }

    public function rules(): array
    {
        // Obtiene el ID del usuario que se va a actualizar
        $userId = $this->route('user')->id;

        return [
            'name'            => 'sometimes|required|string|max:255',
            'email'           => "sometimes|required|email|unique:users,email,{$userId}",
            'specialty_id'    => 'sometimes|nullable|exists:specialties,id',
            'hospital_id'     => 'sometimes|nullable|exists:hospitals,id',
            'is_admin'        => 'sometimes|boolean',
            'is_active'       => 'sometimes|boolean',
            'profile_picture' => 'sometimes|nullable|image|max:2048',
            'signature_image' => 'sometimes|nullable|image|max:2048',
            'stamp_image'     => 'sometimes|nullable|image|max:2048',
        ];
    }
}
