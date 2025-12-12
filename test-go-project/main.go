package main

import (
	"fmt"
	"time"
)

// User represents a user in the system
type User struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Active    bool      `json:"active"`
	CreatedAt time.Time `json:"created_at"`
}

// GetDisplayName returns a formatted display name for the user
func (u *User) GetDisplayName() string {
	return fmt.Sprintf("%s <%s>", u.Name, u.Email)
}

// Validate checks if the user data is valid
func (u *User) Validate() error {
	if u.Name == "" {
		return fmt.Errorf("name is required")
	}
	if u.Email == "" {
		return fmt.Errorf("email is required")
	}
	return nil
}

// UserRepository defines the interface for user data access
type UserRepository interface {
	// Create creates a new user
	Create(user *User) error
	
	// GetByID retrieves a user by their ID
	GetByID(id int) (*User, error)
	
	// List returns all users
	List() ([]*User, error)
	
	// Delete removes a user
	Delete(id int) error
}

// UserManager manages user operations
type UserManager struct {
	repository UserRepository
	cache      map[int]*User
}

// NewUserManager creates a new UserManager instance
func NewUserManager(repo UserRepository) *UserManager {
	return &UserManager{
		repository: repo,
		cache:      make(map[int]*User),
	}
}

// CreateUser creates a new user in the system
func (m *UserManager) CreateUser(name, email string) (*User, error) {
	user := &User{
		Name:      name,
		Email:     email,
		Active:    true,
		CreatedAt: time.Now(),
	}
	
	if err := user.Validate(); err != nil {
		return nil, fmt.Errorf("validation failed: %w", err)
	}
	
	if err := m.repository.Create(user); err != nil {
		return nil, fmt.Errorf("failed to create user: %w", err)
	}
	
	m.cache[user.ID] = user
	return user, nil
}

// GetUser retrieves a user by ID
func (m *UserManager) GetUser(id int) (*User, error) {
	// Check cache first
	if user, ok := m.cache[id]; ok {
		return user, nil
	}
	
	// Fetch from repository
	user, err := m.repository.GetByID(id)
	if err != nil {
		return nil, err
	}
	
	// Update cache
	m.cache[id] = user
	return user, nil
}

// ListActiveUsers returns all active users
func (m *UserManager) ListActiveUsers() ([]*User, error) {
	users, err := m.repository.List()
	if err != nil {
		return nil, err
	}
	
	activeUsers := make([]*User, 0)
	for _, user := range users {
		if user.Active {
			activeUsers = append(activeUsers, user)
		}
	}
	
	return activeUsers, nil
}

// FormatUserList formats a list of users as a string
func FormatUserList(users []*User) string {
	result := ""
	for i, user := range users {
		if i > 0 {
			result += "\n"
		}
		result += user.GetDisplayName()
	}
	return result
}

// SendNotification sends a notification to a user
func SendNotification(user *User, message string) error {
	fmt.Printf("Sending to %s: %s\n", user.Email, message)
	return nil
}

func main() {
	fmt.Println("User Manager Example")
}
