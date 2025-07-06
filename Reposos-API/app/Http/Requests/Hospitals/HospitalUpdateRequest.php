<?php

namespace App\Http\Requests\Hospitals;

use Illuminate\Foundation\Http\FormRequest;

class HospitalUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Ajusta según tu lógica: por ejemplo, solo admins
        return auth()->check();
    }

    public function rules(): array
    {
        // Obtenemos el ID de la ruta para excluir de la regla unique
        $hospitalId = $this->route('hospital')->id;

        return [
            'name'    => "required|string|max:255|unique:hospitals,name,{$hospitalId}",
            'city_id' => 'required|exists:cities,id',
        ];
    }
}
