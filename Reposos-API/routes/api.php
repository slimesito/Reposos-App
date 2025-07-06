<?php

use App\Http\Controllers\API\Auth\AuthController;
use App\Http\Controllers\API\Auth\UserManagementController;
use App\Http\Controllers\API\Auth\UserProfileController;
use App\Http\Controllers\API\Pathologies\PathologyController;
use App\Http\Controllers\API\Hospitals\HospitalController;
use App\Http\Controllers\API\Patients\PatientController;
use App\Http\Controllers\API\Reposos\ReposoController;
use App\Http\Controllers\API\Specialties\SpecialtyController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // User profile routes
    Route::put('/user/profile', [UserProfileController::class, 'update']);

    // Reposos routes
    Route::post('/reposos', [ReposoController::class, 'store']);

    // Patient routes
    Route::get('/patients',         [PatientController::class, 'index']);
    Route::get('/patients/{id}',    [PatientController::class, 'show']);
});

Route::middleware(['auth:sanctum', 'is_admin'])->group(function () {

    // User management routes
    Route::get      ('/users',          [UserManagementController::class, 'index']);
    Route::post     ('/register',       [UserManagementController::class, 'register']);
    Route::put      ('/users/{user}',   [UserManagementController::class, 'update']);
    Route::delete   ('/users/{user}',   [UserManagementController::class, 'destroy']);

    // Hospital management routes
    Route::get      ('/hospitals',              [HospitalController::class, 'index']);
    Route::post     ('/hospitals',              [HospitalController::class, 'store']);
    Route::put      ('/hospitals/{hospital}',   [HospitalController::class, 'update']);
    Route::delete   ('/hospitals/{hospital}',   [HospitalController::class, 'destroy']);

    // Pathology management routes
    Route::get    ('/pathologies',              [PathologyController::class, 'index']);
    Route::post   ('/pathologies',              [PathologyController::class, 'store']);
    Route::put    ('/pathologies/{pathology}',  [PathologyController::class, 'update']);
    Route::delete ('/pathologies/{pathology}',  [PathologyController::class, 'destroy']);

    // Specialty management routes
    Route::get    ('/specialties',              [SpecialtyController::class, 'index']);
    Route::post   ('/specialties',              [SpecialtyController::class, 'store']);
    Route::put    ('/specialties/{specialty}',  [SpecialtyController::class, 'update']);
    Route::delete ('/specialties/{specialty}',  [SpecialtyController::class, 'destroy']);
});
