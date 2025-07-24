<?php

namespace App\Http\Requests\Reposos;

use App\Models\Ciudadano;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;

class ReposoStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // La autorización ya se maneja con el middleware 'auth:sanctum' en las rutas.
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'ciudadano_id' => ['required', 'string', 'max:255'],
            'specialty_id' => ['required', 'exists:specialties,id'],
            'pathology_id' => ['required', 'exists:pathologies,id'],
            'start_date'   => ['required', 'date'],
            'end_date'     => ['required', 'date', 'after_or_equal:start_date'],
            'description'  => ['nullable', 'string'],
        ];
    }

    /**
     * After validation hook to add custom validation logic.
     */
    protected function passedValidation()
    {
        // Validación manual contra otra conexión después de que las reglas básicas pasen.
        if (!Ciudadano::on('pgsql_ciudadano')->where('id', $this->ciudadano_id)->exists()) {
            throw ValidationException::withMessages([
                'ciudadano_id' => ['El ciudadano con la cédula proporcionada no existe.']
            ]);
        }
    }
}
