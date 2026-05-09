<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        Product::insert([
            [
                'name' => 'Wax Fleur Rouge',
                'description' => 'Pagne wax avec motifs floraux rouges',
                'price' => 7500,
                'stock' => 20,
                'category_id' => 1
            ],
            [
                'name' => 'Kita Royal',
                'description' => 'Tissu traditionnel noble',
                'price' => 15000,
                'stock' => 10,
                'category_id' => 2
            ],
            [
                'name' => 'Bogolan Authentique',
                'description' => 'Tissu malien artisanal',
                'price' => 12000,
                'stock' => 15,
                'category_id' => 3
            ],
        ]);
    }
}