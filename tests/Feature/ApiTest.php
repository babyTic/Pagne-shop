<?php
namespace Tests\Feature;

use Tests\TestCase;

class ApiTest extends TestCase
{
    // Test que l'API répond correctement
    public function test_api_products_returns_200(): void
    {
        $response = $this->getJson('/api/products');
        $response->assertStatus(200);
    }

    public function test_login_requires_credentials(): void
    {
        $response = $this->postJson('/api/login', []);
        $response->assertStatus(422);
    }
}