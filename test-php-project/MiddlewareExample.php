<?php
/**
 * Middleware Examples - Laravel, Symfony, CodeIgniter 4
 * 
 * Demonstrates middleware/filter detection across frameworks
 */

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

/**
 * Admin Controller with Class-Level Middleware
 * 
 * All routes in this controller require authentication
 */
#[Middleware('auth')]
#[Middleware('admin')]
class AdminController extends Controller
{
    /**
     * Admin dashboard
     * 
     * @return \Illuminate\View\View
     */
    public function index()
    {
        return view('admin.dashboard');
    }
    
    /**
     * User management with additional throttling
     * 
     * @return \Illuminate\View\View
     */
    #[Middleware('throttle:60,1')]
    public function users()
    {
        return view('admin.users');
    }
    
    /**
     * Dangerous action with extra confirmation
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    #[Middleware('verified')]
    #[Middleware('signed')]
    public function deleteAll()
    {
        return response()->json(['status' => 'deleted']);
    }
}

/**
 * API Controller with Symfony Security
 * 
 * Uses Symfony's IsGranted attribute
 */
#[IsGranted('ROLE_API_USER')]
class ApiSecureController extends \Symfony\Bundle\FrameworkBundle\Controller\AbstractController
{
    /**
     * Public API endpoint
     * 
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function info()
    {
        return $this->json(['version' => '1.0']);
    }
    
    /**
     * Admin-only API endpoint
     * 
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    #[IsGranted('ROLE_ADMIN')]
    public function adminStats()
    {
        return $this->json(['users' => 100, 'posts' => 500]);
    }
}

/**
 * CodeIgniter 4 Controller with Filters
 * 
 * Uses CI4's Filter attribute
 */
#[Filter('auth')]
class CISecureController extends \CodeIgniter\Controller
{
    /**
     * Dashboard
     * 
     * @return string
     */
    public function index()
    {
        return view('dashboard');
    }
    
    /**
     * Settings with CSRF protection
     * 
     * @return string
     */
    #[Filter('csrf')]
    public function settings()
    {
        return view('settings');
    }
}

/**
 * Legacy CodeIgniter 3 Controller
 * 
 * Uses docblock annotations for middleware
 * 
 * @middleware auth
 */
class CI3_Legacy_Controller extends CI_Controller
{
    /**
     * Dashboard
     * 
     * @middleware session
     */
    public function index()
    {
        $this->load->view('dashboard');
    }
    
    /**
     * Admin panel
     * 
     * @middleware auth, admin, verified
     * @filter ip_whitelist
     */
    public function admin()
    {
        $this->load->view('admin');
    }
}

/**
 * Mixed Middleware Controller
 * 
 * Combines attributes and docblocks
 */
#[Middleware('auth')]
class MixedController extends Controller
{
    /**
     * Profile page
     * 
     * Simple authenticated route
     */
    public function profile()
    {
        return view('profile');
    }
    
    /**
     * Edit profile with rate limiting
     * 
     * @middleware throttle:10,1
     */
    #[Middleware('verified')]
    public function edit()
    {
        return view('profile.edit');
    }
    
    /**
     * Billing section
     * 
     * Multiple middleware from both sources
     * 
     * @middleware subscription
     */
    #[Middleware('stripe')]
    #[Middleware('billing')]
    public function billing()
    {
        return view('billing');
    }
}
