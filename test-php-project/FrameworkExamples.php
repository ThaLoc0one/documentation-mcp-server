<?php
/**
 * Laravel Example - Multi-Framework Detection Test
 * 
 * Demonstrates framework detection for Laravel, Symfony, and generic MVC
 */

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Product;

/**
 * Product Controller (Laravel)
 * 
 * Handles product CRUD operations
 */
class ProductController extends \Illuminate\Routing\Controller
{
    /**
     * Display product listing
     * 
     * @return \Illuminate\View\View
     */
    public function index()
    {
        $products = Product::all();
        return view('products.index', compact('products'));
    }
    
    /**
     * Store new product
     * 
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'price' => 'required|numeric',
        ]);
        
        Product::create($validated);
        return redirect()->route('products.index');
    }
}

/**
 * Product Model (Laravel Eloquent)
 */
class Product extends \Illuminate\Database\Eloquent\Model
{
    /**
     * Fillable attributes
     * @var array
     */
    protected $fillable = ['name', 'price', 'description'];
    
    /**
     * Get expensive products
     * 
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function scopeExpensive($query)
    {
        return $query->where('price', '>', 100);
    }
}

// Symfony Example

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;

/**
 * Home Controller (Symfony)
 */
class HomeController extends AbstractController
{
    /**
     * Homepage action
     * 
     * @return Response
     */
    public function index(): Response
    {
        return $this->render('home/index.html.twig');
    }
}

// Generic MVC (no framework)

namespace App\Controllers;

/**
 * API Controller (Generic MVC)
 * 
 * Detected by naming convention
 */
class ApiController
{
    /**
     * Handle API request
     * 
     * @return array
     */
    public function handleRequest(): array
    {
        return ['status' => 'success'];
    }
}

/**
 * Data Model (Generic MVC)
 * 
 * Detected by naming convention
 */
class DataModel
{
    /**
     * Fetch data
     * 
     * @return array
     */
    public function fetchData(): array
    {
        return [];
    }
}
