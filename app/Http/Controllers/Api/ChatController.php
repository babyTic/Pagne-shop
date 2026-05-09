<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ChatController extends Controller
{
    // Prompt système — contexte PagneShop
    private string $systemPrompt = "Tu es l'assistant virtuel de PagneShop, une boutique en ligne de vente de pagnes africains (Wax, Kita, Bogolan, Bazin).

Tu réponds en français, de façon chaleureuse, concise et professionnelle.

Informations que tu connais sur la boutique :
- Livraison standard : 3 à 5 jours ouvrables
- Livraison express : 24 à 48h (supplément)
- Retours acceptés sous 7 jours si article non porté
- Paiement : Mobile Money (CinetPay) et carte bancaire (Stripe)
- Les pagnes sont 100% authentiques, sourcés directement auprès d'artisans
- Le wax est lavable à 30°C, le bogolan à la main uniquement
- Tu peux aider sur : délais de livraison, entretien des tissus, tailles, commandes, retours

Si on te demande quelque chose hors du contexte boutique, recentre poliment la conversation.
Réponds toujours en 2-3 phrases maximum sauf si on demande plus de détails.";

    public function send(Request $request)
    {
        $request->validate([
            'messages' => 'required|array|min:1',
        ]);

        $response = Http::withHeaders([
            'x-api-key'         => env('ANTHROPIC_API_KEY'),
            'anthropic-version' => '2023-06-01',
            'Content-Type'      => 'application/json',
        ])->post('https://api.anthropic.com/v1/messages', [
            'model'      => 'claude-haiku-4-5-20251001', // rapide et économique pour un chat
            'max_tokens' => 500,
            'system'     => $this->systemPrompt,
            'messages'   => $request->messages,
        ]);

        if ($response->failed()) {
            return response()->json(['error' => 'Erreur API'], 500);
        }

        return response()->json([
            'reply' => $response->json('content.0.text')
        ]);
    }
}