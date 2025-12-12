<?php
/**
 * Laravel Routes Example
 * 
 * Demonstrates Laravel route attribute detection
 */

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

/**
 * API Product Controller
 * 
 * Handles product API endpoints with attribute routing
 */
#[Route('/api/products')]
class ApiProductController extends Controller
{
    /**
     * List all products
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    #[Get('/')]
    public function index()
    {
        return response()->json(['products' => []]);
    }
    
    /**
     * Get single product
     * 
     * @param int $id Product ID
     * @return \Illuminate\Http\JsonResponse
     */
    #[Get('/{id}')]
    public function show(int $id)
    {
        return response()->json(['product' => ['id' => $id]]);
    }
    
    /**
     * Create new product
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    #[Post('/')]
    public function store(Request $request)
    {
        return response()->json(['created' => true], 201);
    }
    
    /**
     * Update product
     * 
     * @param Request $request
     * @param int $id Product ID
     * @return \Illuminate\Http\JsonResponse
     */
    #[Put('/{id}')]
    #[Patch('/{id}')]
    public function update(Request $request, int $id)
    {
        return response()->json(['updated' => true]);
    }
    
    /**
     * Delete product
     * 
     * @param int $id Product ID
     * @return \Illuminate\Http\JsonResponse
     */
    #[Delete('/{id}')]
    public function destroy(int $id)
    {
        return response()->json(['deleted' => true]);
    }
}

/**
 * Web Product Controller
 * 
 * Traditional web controller without attributes (convention-based)
 */
class WebProductController extends \Illuminate\Routing\Controller
{
    /**
     * Display product list
     */
    public function index()
    {
        return view('products.index');
    }
    
    /**
     * Show product details
     */
    public function show(int $id)
    {
        return view('products.show', compact('id'));
    }
    
    /**
     * Show create form
     */
    public function create()
    {
        return view('products.create');
    }
    
    /**
     * Store new product
     */
    public function store()
    {
        // Store logic
        return redirect('/products');
    }
    
    /**
     * Show edit form
     */
    public function edit(int $id)
    {
        return view('products.edit', compact('id'));
    }
    
    /**
     * Update product
     */
    public function update(int $id)
    {
        // Update logic
        return redirect('/products/' . $id);
    }
    
    /**
     * Delete product
     */
    public function destroy(int $id)
    {
        // Delete logic
        return redirect('/products');
    }
}
