<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;

class StripeController extends Controller
{
    public function __construct()
    {
        // Initialise Stripe avec la clé secrète
        Stripe::setApiKey(env('STRIPE_SECRET'));
    }

    // Crée un PaymentIntent Stripe
    public function createIntent(Request $request)
    {
        $request->validate([
            'order_id' => 'required|integer|exists:orders,id',
        ]);

        $order = Order::findOrFail($request->order_id);

        // Vérifie que la commande appartient à l'utilisateur
        if ($order->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        // Stripe travaille en centimes — on convertit
        $amount = (int) ($order->total_price * 100);

        $intent = PaymentIntent::create([
            'amount'   => $amount,
            'currency' => 'xof', // FCFA
            'metadata' => [
                'order_id' => $order->id,
                'user_id'  => $request->user()->id,
            ],
        ]);

        // Sauvegarde le payment_intent_id
        $order->update([
            'transaction_id' => $intent->id,
            'status'         => 'en attente paiement',
        ]);

        return response()->json([
            'client_secret' => $intent->client_secret,
            'order_id'      => $order->id,
        ]);
    }

    // Confirme le paiement après validation Stripe
    public function confirm(Request $request)
    {
        $request->validate([
            'payment_intent_id' => 'required|string',
        ]);

        Stripe::setApiKey(env('STRIPE_SECRET'));
        $intent = PaymentIntent::retrieve($request->payment_intent_id);

        if ($intent->status === 'succeeded') {
            $order = Order::where('transaction_id', $intent->id)->first();
            if ($order) {
                $order->update(['status' => 'confirmée']);
            }
            return response()->json(['paid' => true, 'message' => '✅ Paiement confirmé !']);
        }

        return response()->json(['paid' => false, 'message' => '❌ Paiement non confirmé.']);
    }
}