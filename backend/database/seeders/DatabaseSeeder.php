<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;



class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        \App\Models\User::factory()->create([
            'name' => 'Admin',
            'email' => 'Admin@bonsai-marrakech.com',
            'password' => bcrypt('Admin@bonsai11'),
            'role' => 'admin',
            'remember_token' => Str::random(10)

        ]);

//         Admin : Admin@bonsai-marrakech.com
// Password : Admin@bonsai11


// Restaurant@bonsai-marrakech.com
// Password : Bonsai@22restaurant

        \App\Models\User::factory()->create([
            'name' => 'User',
            'email' => 'Restaurant@bonsai-marrakech.com',
            'password' => bcrypt('Bonsai@22restaurant'),
            'role' => 'user',
            'remember_token' => Str::random(10)

        ]);





    }
}
