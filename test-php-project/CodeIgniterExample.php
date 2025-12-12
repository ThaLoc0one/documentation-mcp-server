<?php
/**
 * CodeIgniter Example - User Controller
 * 
 * Demonstrates CodeIgniter 3/4 pattern detection
 */

namespace App\Controllers;

use CodeIgniter\Controller;

/**
 * User Controller
 * 
 * Handles user-related operations
 */
class UserController extends Controller
{
    /**
     * User model instance
     * @var \App\Models\UserModel
     */
    protected $userModel;
    
    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct();
        $this->userModel = new \App\Models\UserModel();
    }
    
    /**
     * Display user list
     * 
     * @return void
     */
    public function index()
    {
        $data['users'] = $this->userModel->findAll();
        return view('users/index', $data);
    }
    
    /**
     * Show user details
     * 
     * @param int $id User ID
     * @return void
     */
    public function show($id)
    {
        $data['user'] = $this->userModel->find($id);
        return view('users/show', $data);
    }
    
    /**
     * Create new user
     * 
     * @return void
     */
    public function create()
    {
        if ($this->request->getMethod() === 'post') {
            $this->userModel->save($this->request->getPost());
            return redirect()->to('/users');
        }
        
        return view('users/create');
    }
}

/**
 * User Model
 * 
 * Database model for users table
 */
class UserModel extends \CodeIgniter\Model
{
    /**
     * Table name
     * @var string
     */
    protected $table = 'users';
    
    /**
     * Primary key
     * @var string
     */
    protected $primaryKey = 'id';
    
    /**
     * Allowed fields
     * @var array
     */
    protected $allowedFields = ['name', 'email', 'password'];
    
    /**
     * Get active users
     * 
     * @return array
     */
    public function getActiveUsers()
    {
        return $this->where('status', 'active')->findAll();
    }
}

// CodeIgniter 3 Style (Legacy)

/**
 * Legacy User Controller (CI3)
 * 
 * CodeIgniter 3 style controller
 */
class Users extends CI_Controller
{
    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct();
        $this->load->model('user_model');
    }
    
    /**
     * List users
     */
    public function index()
    {
        $data['users'] = $this->user_model->get_all();
        $this->load->view('users/index', $data);
    }
}

/**
 * Legacy User Model (CI3)
 */
class User_model extends CI_Model
{
    /**
     * Get all users
     * 
     * @return array
     */
    public function get_all()
    {
        return $this->db->get('users')->result_array();
    }
}
