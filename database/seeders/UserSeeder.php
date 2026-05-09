<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::create([
            'name' => 'Admin',
            'email' => 'admin@pagne.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Client
        User::create([
            'name' => 'Client Test',
            'email' => 'client@pagne.com',
            'password' => Hash::make('password'),
            'role' => 'client',
        ]);
    }
}