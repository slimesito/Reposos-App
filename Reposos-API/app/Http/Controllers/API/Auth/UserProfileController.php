<?php

namespace App\Http\Controllers\API\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\UpdateUserProfileRequest;
use App\Http\Resources\Auth\UserResource; // o crea un ProfileResource
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\JsonResponse;

class UserProfileController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    /**
     * Actualiza la contraseña y/o la foto de perfil del usuario autenticado.
     */
    public function update(UpdateUserProfileRequest $request): JsonResponse
    {
        $user = $request->user();
        $data = [];

        // 1) Si envían nueva contraseña
        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        // 2) Si envían nueva foto de perfil
        if ($request->hasFile('profile_picture')) {
            // Eliminar la anterior (si existe)
            if ($user->profile_picture) {
                Storage::disk('public')->delete($user->profile_picture);
            }
            // Guardar la nueva
            $filename = Str::random(20) . '.' . $request->file('profile_picture')->getClientOriginalExtension();
            $path = $request->file('profile_picture')
                            ->storeAs('users/profile_picture', $filename, 'public');
            $data['profile_picture'] = $path;
        }

        // 3) Si hay cambios, los aplicamos
        if (!empty($data)) {
            $user->update($data);
        }

        return response()->json([
            'message' => 'Perfil actualizado correctamente.',
            'user'    => new UserResource($user),
        ], 200);
    }
}
