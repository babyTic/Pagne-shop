<?php
namespace App\Http\Controllers\Api;

use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * LISTE PRODUITS (avec pagination)
     */
    public function index(Request $request)
    {
        $query = Product::with('category');

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        return ProductResource::collection($query->paginate(10));
    }

    /**
     * DETAIL PRODUIT
     */
    public function show($id)
    {
        $product = Product::with('category')->findOrFail($id);
        return new ProductResource($product);
    }

    /**
     * CREATE (ADMIN) — avec image optionnelle
     */
    public function store(Request $request)
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0',
            'stock'       => 'required|integer|min:0',
            'category_id' => 'required|integer|exists:categories,id',
            'image'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        // Stocke l'image si présente
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')
                ->store('products', 'public');
        }

        $product = Product::create($validated);

        return new ProductResource($product->load('category'));
    }

    /**
     * UPDATE — avec remplacement d'image optionnel
     */
    public function update(Request $request, $id)
    {
        $this->authorizeAdmin($request);

        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name'        => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'sometimes|numeric|min:0',
            'stock'       => 'sometimes|integer|min:0',
            'category_id' => 'sometimes|integer|exists:categories,id',
            'image'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        // Remplace l'ancienne image si une nouvelle est envoyée
        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image); // supprime l'ancienne
            }
            $validated['image'] = $request->file('image')
                ->store('products', 'public');
        }

        $product->update($validated);

        return new ProductResource($product->load('category'));
    }

    /**
     * DELETE — supprime aussi l'image associée
     */
    public function destroy(Request $request, $id)
    {
        $this->authorizeAdmin($request);

        $product = Product::findOrFail($id);

        // Supprime l'image du stockage si elle existe
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return response()->json(['message' => 'Produit supprimé.']);
    }

    /**
     * CHECK ADMIN
     */
    private function authorizeAdmin($request)
    {
        if ($request->user()->role !== 'admin') {
            abort(403, 'Unauthorized');
        }
    }
}