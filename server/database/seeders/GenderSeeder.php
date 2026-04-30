<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Gender;

class GenderSeeder extends Seeder
{
    public function run(): void
    {
        $genders = [
            ['gender' => 'Male'],
            ['gender' => 'Female'],
            ['gender' => 'Other'],
            ['gender' => 'Prefer not to say'],
        ];

        foreach ($genders as $data) {
            Gender::create($data);
        }
    }
}

