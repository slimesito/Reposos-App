<?php

namespace App\Http\Controllers\API\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterUserRequest;
use App\Http\Requests\Auth\UpdateUserRequest;
use App\Http\Resources\Auth\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class UserManagementController extends Controller
{
    /**
     * Registrar un nuevo usuario (solo admin).
     * La contraseña se fija por defecto a '12345678'.
     * Se almacenan las imágenes en disco.
     */
    public function register(RegisterUserRequest $request): JsonResponse
    {
        // Validar los datos de entrada
        $data = $request->validated();

        $data['password'] = Hash::make('12345678');
        $data['is_admin'] = $data['is_admin'] ?? false;
        $data['is_active'] = $data['is_active'] ?? true;

        // 1) Manejo de subidas de imagen: si vienen, almacénalas y actualiza campo
        foreach (['profile_picture', 'signature_image', 'stamp_image'] as $field) {
            if ($request->hasFile($field)) {
                // Opcional: renombrar el archivo para evitar colisiones
                $filename = Str::random(20) . '.' . $request->file($field)->getClientOriginalExtension();
                $path = $request->file($field)
                                ->storeAs("users/{$field}", $filename, 'public');
                $data[$field] = $path;  // se guarda el path relativo
            }
        }

        // 2) Crear el usuario
        $user = User::create($data);

        // 3) Retornar respuesta con el usuario creado
        return response()->json([
            'message' => 'Usuario registrado exitosamente con contraseña por defecto.',
            'user'    => new UserResource($user),
        ], 201);
    }

    /**
     * Listar usuarios con paginación y filtros por cualquier columna.
     *
     * Recibe parámetros query string como:
     *  - id, name, email, specialty_id, hospital_id,
     *    is_admin, is_active, profile_picture, signature_image, stamp_image
     *  - per_page (opcional, default 15)
     *
     * Ejemplo: GET /api/users?name=Juan&is_active=1&per_page=10
     */
    public function index(Request $request)
    {
        $query = User::query();

        // Cargamos relaciones para poder mostrar nombre de specialty y hospital
        $query->with(['specialty', 'hospital']);

        // Columnas que permitimos filtrar
        $filterable = [
            'id', 'name', 'email', 'specialty_id', 'hospital_id',
            'is_admin', 'is_active',
            'profile_picture', 'signature_image', 'stamp_image',
        ];

        // Aplicamos WHERE por cada filtro presente en la petición
        foreach ($filterable as $field) {
            if (! is_null($value = $request->query($field))) {
                // Para booleanos e integers, cast automático; para strings usamos LIKE
                if (in_array($field, ['name', 'email', 'profile_picture', 'signature_image', 'stamp_image'])) {
                    $query->where($field, 'ILIKE', "%{$value}%");
                } else {
                    $query->where($field, $value);
                }
            }
        }

        // Paginación
        $perPage = (int) $request->query('per_page', 15);
        $users = $query->paginate($perPage)->appends($request->query());

        // Devolver colección de recursos con meta de paginación
        return UserResource::collection($users);
    }

    /**
     * Actualiza un usuario existente (solo admin).
     */
    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        $data = $request->validated();

        // 1) Manejo de subidas de imagen: si vienen, almacénalas y actualiza campo
        foreach (['profile_picture','signature_image','stamp_image'] as $field) {
            if ($request->hasFile($field)) {
                // Borra archivo anterior si existe
                if ($user->$field) {
                    Storage::disk('public')->delete($user->$field);
                }
                $filename = Str::random(20) . '.' . $request->file($field)->getClientOriginalExtension();
                $path = $request->file($field)
                                ->storeAs("users/{$field}", $filename, 'public');
                $data[$field] = $path;
            }
        }

        // 2) Aplica cambios
        $user->update($data);

        return response()->json([
            'message' => 'Usuario actualizado correctamente.',
            'user'    => new UserResource($user),
        ], 200);
    }

    /**
     * Eliminar un usuario y sus imágenes (solo admins)
     */
    public function destroy(User $user)
    {
        // Eliminar imágenes asociadas
        foreach (['profile_photo', 'signature_image', 'stamp_image'] as $field) {
            if ($user->$field) {
                Storage::disk('public')->delete($user->$field);
            }
        }

        $user->delete();

        return response()->json(['message' => 'Usuario eliminado exitosamente.']);
    }
}
