<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    // Initialise un paiement CinetPay
    public function initiate(Request $request)
    {
        $request->validate([
            'order_id' => 'required|integer|exists:orders,id',
        ]);

        $order = Order::findOrFail($request->order_id);

        // Vérifie que la commande appartient à l'utilisateur connecté
        if ($order->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        // Référence unique pour ce paiement
        $transactionId = 'PAY-' . strtoupper(Str::random(10)) . '-' . $order->id;

        // Appel API CinetPay
        $response = Http::post(env('CINETPAY_BASE_URL') . '/payment', [
            'apikey'                => env('CINETPAY_API_KEY'),
            'site_id'               => env('CINETPAY_SITE_ID'),
            'transaction_id'        => $transactionId,
            'amount'                => (int) $order->total_price,
            'currency'              => 'XOF',              // FCFA
            'description'           => 'Commande PagneShop #' . $order->id,
            'return_url'            => env('FRONTEND_URL') . '/orders?payment=success',
            'cancel_url'            => env('FRONTEND_URL') . '/orders?payment=cancelled',
            'notify_url'            => env('APP_URL') . '/api/payment/notify',
            'customer_name'         => $request->user()->name,
            'customer_email'        => $request->user()->email,
            'customer_phone_number' => $request->user()->phone ?? '',
            'channels'              => 'ALL',              // Mobile Money + Carte
            'lang'                  => 'fr',
        ]);

        if ($response->failed() || $response->json('code') !== '201') {
            return response()->json([
                'message' => 'Erreur initialisation paiement.',
                'details' => $response->json()
            ], 500);
        }

        // Sauvegarde la référence de transaction
        $order->update([
            'transaction_id' => $transactionId,
            'status'         => 'en attente paiement',
        ]);

        return response()->json([
            'payment_url' => $response->json('data.payment_url'),
            'transaction_id' => $transactionId,
        ]);
    }

    // Webhook — CinetPay notifie quand le paiement est confirmé
    public function notify(Request $request)
    {
        $transactionId = $request->input('cpm_trans_id');

        // Vérifie le statut auprès de CinetPay
        $response = Http::post(env('CINETPAY_BASE_URL') . '/payment/check', [
            'apikey'         => env('CINETPAY_API_KEY'),
            'site_id'        => env('CINETPAY_SITE_ID'),
            'transaction_id' => $transactionId,
        ]);

        $data = $response->json();

        if ($data['data']['status'] === 'ACCEPTED') {
            // Paiement accepté → met à jour la commande
            Order::where('transaction_id', $transactionId)
                ->update(['status' => 'confirmée']);
        }

        return response()->json(['message' => 'OK']);
    }

    // Vérifie le statut d'un paiement (appelé par le frontend)
    public function check(Request $request)
    {
        $request->validate([
            'transaction_id' => 'required|string',
        ]);

        $response = Http::post(env('CINETPAY_BASE_URL') . '/payment/check', [
            'apikey'         => env('CINETPAY_API_KEY'),
            'site_id'        => env('CINETPAY_SITE_ID'),
            'transaction_id' => $request->transaction_id,
        ]);

        $status = $response->json('data.status');

        return response()->json([
            'status'  => $status,
            'paid'    => $status === 'ACCEPTED',
            'message' => match($status) {
                'ACCEPTED'  => '✅ Paiement confirmé !',
                'REFUSED'   => '❌ Paiement refusé.',
                'CANCELLED' => '↩️ Paiement annulé.',
                default     => '⏳ En attente de confirmation...',
            }
        ]);
    }
}