<?php

namespace App\Http\Controllers\Api;

use App\Models\Order;
use App\Models\Product;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        // 1. Vérification
        $request->validate([
            'products' => 'required|array'
        ]);

        $total = 0;

        // 2. Créer la commande
        $order = Order::create([
            'user_id' => $request->user()->id,
            'total_price' => 0,
            'status' => 'en attente'
        ]);

        // 3. Ajouter les produits
        foreach ($request->products as $item) {

            $product = Product::findOrFail($item['id']);

            $price = $product->price * $item['quantity'];

            $total += $price;

            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'quantity' => $item['quantity'],
                'price' => $product->price
            ]);
        }

        // 4. Mettre à jour total
        $order->update([
            'total_price' => $total
        ]);

        return response()->json([
            'message' => 'Commande créée',
            'order' => $order
        ]);
    }
//Voir ses commandes -client-

    public function indexUser(Request $request)
    {
    $orders = Order::with('items.product')
        ->where('user_id', $request->user()->id)
        ->get();

    return response()->json($orders);
    }

//Voir toute les commandes -admin-

    public function indexAdmin(Request $request)
{
    if ($request->user()->role !== 'admin') {
        abort(403, 'Unauthorized');
    }

    $orders = Order::with('items.product', 'user')->get();

    return response()->json($orders);
}

//Changer statut

public function updateStatus(Request $request, $id)
{
    if ($request->user()->role !== 'admin') {
        abort(403, 'Unauthorized');
    }

    $order = Order::findOrFail($id);

    $request->validate([
        'status' => 'required|string'
    ]);

    $order->update([
        'status' => $request->status
    ]);

    return response()->json([
        'message' => 'Statut mis à jour',
        'order' => $order
    ]);
}

}