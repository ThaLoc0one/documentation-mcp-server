<?php
/**
 * Modern PHP 8+ Features Demo
 * 
 * Demonstrates Enums, Traits, and Attributes
 */

namespace App\Models;

/**
 * User role enumeration
 * 
 * Defines all possible user roles in the system
 */
enum UserRole: string {
    /**
     * Administrator with full access
     */
    case ADMIN = 'admin';
    
    /**
     * Regular user with limited access
     */
    case USER = 'user';
    
    /**
     * Guest with read-only access
     */
    case GUEST = 'guest';
    
    /**
     * Get display label for role
     * 
     * @return string Human-readable label
     */
    public function label(): string {
        return match($this) {
            self::ADMIN => 'Administrator',
            self::USER => 'User',
            self::GUEST => 'Guest',
        };
    }
}

/**
 * Account status enumeration
 * 
 * Defines possible account states without backing values
 */
enum Status {
    /** Active account */
    case ACTIVE;
    /** Inactive/suspended account */
    case INACTIVE;
    /** Pending activation */
    case PENDING;
}

/**
 * Timestampable trait
 * 
 * Adds created_at and updated_at timestamps to models
 */
trait Timestampable {
    /**
     * Creation timestamp
     * @var \DateTime
     */
    private \DateTime $createdAt;
    
    /**
     * Last update timestamp
     * @var \DateTime
     */
    private \DateTime $updatedAt;
    
    /**
     * Set creation timestamp
     * 
     * @return void
     */
    public function setCreatedAt(): void {
        $this->createdAt = new \DateTime();
    }
    
    /**
     * Get creation timestamp
     * 
     * @return \DateTime
     */
    public function getCreatedAt(): \DateTime {
        return $this->createdAt;
    }
}

/**
 * Entity attribute
 * 
 * Marks classes as database entities with table mapping configuration
 */
#[\Attribute]
class Entity {
    /**
     * Constructor
     * 
     * @param string $table Database table name
     * @param bool $readOnly Whether entity is read-only (default: false)
     */
    public function __construct(
        /** @var string Database table name */
        public string $table,
        /** @var bool Whether entity is read-only */
        public bool $readOnly = false
    ) {}
}

/**
 * Route attribute
 * 
 * Defines HTTP routing for controller methods
 */
#[\Attribute(\Attribute::TARGET_METHOD)]
class Route {
    /**
     * Constructor
     * 
     * @param string $path URL path pattern
     * @param string $method HTTP method (GET, POST, PUT, DELETE, etc.)
     */
    public function __construct(
        /** @var string URL path pattern */
        public string $path,
        /** @var string HTTP method */
        public string $method = 'GET'
    ) {}
}

/**
 * Modern User entity with attributes
 * 
 * Demonstrates PHP 8+ features including attributes, enums, and promoted properties
 */
#[Entity(table: 'users')]
class ModernUser {
    use Timestampable;
    
    /**
     * User ID
     */
    private int $id;
    
    /**
     * User email address
     */
    private string $email;
    
    /**
     * User role
     */
    private UserRole $role;
    
    /**
     * Account status
     */
    private Status $status;
    
    /**
     * Constructor
     * 
     * @param int $id User ID
     * @param string $email Email address
     * @param UserRole $role User role
     */
    public function __construct(int $id, string $email, UserRole $role) {
        $this->id = $id;
        $this->email = $email;
        $this->role = $role;
        $this->status = Status::ACTIVE;
        $this->setCreatedAt();
    }
    
    /**
     * Get user as array
     * 
     * Converts user object to associative array representation for API responses
     * 
     * @return array User data with id, email, role, and status
     */
    #[Route(path: '/api/users/{id}', method: 'GET')]
    public function toArray(): array {
        return [
            'id' => $this->id,
            'email' => $this->email,
            'role' => $this->role->value,
            'status' => $this->status->name
        ];
    }
    
    /**
     * Check if user is admin
     * 
     * @return bool True if admin
     */
    public function isAdmin(): bool {
        return $this->role === UserRole::ADMIN;
    }
}
