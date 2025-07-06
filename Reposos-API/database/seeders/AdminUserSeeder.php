<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Usuario Administrador',
                'password' => Hash::make('12345678'),
                'is_admin' => true,
                'is_active' => true,
            ]
        );
    }
}
