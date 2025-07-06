<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Cualquier usuario autenticado puede.
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'password'         => 'sometimes|required|string|min:8|confirmed',
            'profile_picture'  => 'sometimes|nullable|image|max:2048',
            'profile_picture' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ];
    }
}
