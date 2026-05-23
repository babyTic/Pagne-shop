<?php
namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    public function test_the_application_is_running(): void
    {
        $response = $this->getJson('/api/products');
        $response->assertStatus(200);
    }
}