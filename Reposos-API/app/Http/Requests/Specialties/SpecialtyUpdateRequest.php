<?php

namespace App\Http\Requests\Specialties;

use Illuminate\Foundation\Http\FormRequest;

class SpecialtyUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check(); // o auth()->user()->is_admin
    }

    public function rules(): array
    {
        $id = $this->route('specialty')->id;

        return [
            'name' => "sometimes|string|max:255|unique:specialties,name,{$id}",
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre de la especialidad es obligatorio.',
            'name.string'   => 'El nombre de la especialidad debe ser una cadena de texto.',
            'name.max'      => 'El nombre de la especialidad no puede exceder los 255 caracteres.',
            'name.unique'   => 'Ya existe una especialidad con este nombre.',
        ];
    }
}
