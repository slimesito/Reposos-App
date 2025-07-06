<?php

namespace App\Http\Requests\Pathologies;

use Illuminate\Foundation\Http\FormRequest;

class PathologyUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check(); // o auth()->user()->is_admin
    }

    public function rules(): array
    {
        $id = $this->route('pathology')->id;

        return [
            'name'          => "sometimes|required|string|max:255|unique:pathologies,name,{$id}",
            'specialty_id'  => 'sometimes|required|exists:specialties,id',
            'days'          => 'sometimes|required|integer|min:0',
        ];
    }
}
