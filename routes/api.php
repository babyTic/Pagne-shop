<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\StripeController;
use App\Http\Controllers\Api\PaymentController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Webhook public — CinetPay appelle cette route directement
Route::post('/payment/notify', [PaymentController::class, 'notify']);

// routes protégées
    Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::get('/products', [ProductController::class, 'index']); 
          
     // liste produits
    Route::get('/products/{id}', [ProductController::class, 'show']);    
    // détail produit
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
    Route::post('/orders', [OrderController::class, 'store']);
    // client
    Route::get('/my-orders', [OrderController::class, 'indexUser']);

    // admin
    Route::get('/orders', [OrderController::class, 'indexAdmin']);
    Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);
    //Stripe carte bancaire
      Route::post('/stripe/intent',  [StripeController::class, 'createIntent']);
    Route::post('/stripe/confirm', [StripeController::class, 'confirm']);   
    //Cinetpay mobilemoney (orange,Moov,...)
     Route::post('/payment/initiate', [PaymentController::class, 'initiate']); //
    Route::post('/payment/check',    [PaymentController::class, 'check']);    // 
});