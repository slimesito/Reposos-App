<?php

namespace App\Http\Requests\Pathologies;

use Illuminate\Foundation\Http\FormRequest;

class PathologyStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check(); // o auth()->user()->is_admin si solo admins
    }

    public function rules(): array
    {
        return [
            'name'          => 'required|string|max:255|unique:pathologies,name',
            'specialty_id'  => 'required|exists:specialties,id',
            'days'          => 'required|integer|min:0',
        ];
    }
}
