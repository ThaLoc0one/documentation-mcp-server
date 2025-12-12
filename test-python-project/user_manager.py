"""
Example Python module for testing deep code analysis
"""

from typing import List, Optional, Dict
from dataclasses import dataclass


@dataclass
class User:
    """
    Represents a user in the system.
    
    Attributes:
        id: Unique user identifier
        name: User's full name
        email: User's email address
    """
    id: int
    name: str
    email: str
    active: bool = True
    
    def get_display_name(self) -> str:
        """
        Returns a formatted display name for the user.
        
        Returns:
            Formatted name string
        """
        return f"{self.name} <{self.email}>"
    
    @staticmethod
    def validate_email(email: str) -> bool:
        """
        Validates an email address.
        
        Args:
            email: Email address to validate
            
        Returns:
            True if valid, False otherwise
        """
        return "@" in email and "." in email


class UserManager:
    """
    Manages user operations in the application.
    
    This class provides methods for creating, updating, and retrieving users.
    """
    
    def __init__(self, database_url: str):
        """
        Initialize the UserManager.
        
        Args:
            database_url: URL of the database connection
        """
        self.database_url = database_url
        self.users: Dict[int, User] = {}
    
    def create_user(self, name: str, email: str) -> User:
        """
        Create a new user.
        
        Args:
            name: User's full name
            email: User's email address
            
        Returns:
            Created User object
            
        Raises:
            ValueError: If email is invalid
        """
        if not User.validate_email(email):
            raise ValueError("Invalid email address")
        
        user_id = len(self.users) + 1
        user = User(id=user_id, name=name, email=email)
        self.users[user_id] = user
        return user
    
    async def fetch_user(self, user_id: int) -> Optional[User]:
        """
        Fetch a user by ID asynchronously.
        
        Args:
            user_id: ID of the user to fetch
            
        Returns:
            User object if found, None otherwise
        """
        return self.users.get(user_id)
    
    def list_active_users(self) -> List[User]:
        """Get all active users"""
        return [user for user in self.users.values() if user.active]


def format_user_list(users: List[User]) -> str:
    """
    Format a list of users as a string.
    
    Args:
        users: List of User objects
        
    Returns:
        Formatted string representation
    """
    return "\n".join(user.get_display_name() for user in users)


async def send_notification(user: User, message: str) -> bool:
    """
    Send a notification to a user.
    
    Args:
        user: User to notify
        message: Notification message
        
    Returns:
        True if sent successfully
    """
    print(f"Sending to {user.email}: {message}")
    return True
