<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IsAdmin
{
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();

        if (!$user || !$user->is_admin || !$user->is_active) {
            return response()->json(['message' => 'Acceso denegado: No eres un administrador activo'], 403);
        }

        return $next($request);
    }
}
