/**
 * User Authentication Service
 * TypeScript frontend component
 */

export interface User {
  id: number;
  email: string;
  name: string;
}

/**
 * Authentication service for managing user sessions
 */
export class AuthService {
  private apiUrl: string;

  /**
   * Creates a new AuthService instance
   * @param apiUrl - The API base URL
   */
  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  /**
   * Logs in a user with email and password
   * @param email - User email address
   * @param password - User password
   * @returns Promise with user data or null
   */
  async login(email: string, password: string): Promise<User | null> {
    try {
      const response = await fetch(`${this.apiUrl}/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      return await response.json();
    } catch (error) {
      console.error('Login failed:', error);
      return null;
    }
  }

  /**
   * Logs out the current user
   */
  async logout(): Promise<void> {
    await fetch(`${this.apiUrl}/auth/logout`, { method: 'POST' });
  }
}
