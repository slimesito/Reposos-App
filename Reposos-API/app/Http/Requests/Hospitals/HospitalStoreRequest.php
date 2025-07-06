<?php

namespace App\Http\Requests\Hospitals;

use Illuminate\Foundation\Http\FormRequest;

class HospitalStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Ajusta según tu lógica: por ejemplo, solo admins
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'name'    => 'required|string|max:255|unique:hospitals,name',
            'city_id' => 'required|exists:cities,id',
        ];
    }
}
