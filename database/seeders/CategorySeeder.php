<?php

// database/seeders/CategorySeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        Category::insert([
            ['name' => 'Wax'],
            ['name' => 'Kita'],
            ['name' => 'Bogolan'],
            ['name' => 'Bazin'],
        ]);
    }
}