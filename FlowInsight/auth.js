// Authentication Module - Implementing Replit OAuth as specified in replit.md
class AuthManager {
  constructor() {
    this.isAuthenticated = false;
    this.user = null;
    this.sessionToken = null;
    this.baseUrl = 'https://your-api-domain.vercel.app'; // Update with your actual API domain
  }

  // Initialize authentication state
  async init() {
    try {
      // Check for existing session
      const token = localStorage.getItem('sessionToken');
      if (token) {
        await this.validateSession(token);
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      this.logout();
    }
  }

  // Replit OAuth login flow
  async login() {
    try {
      // Redirect to Replit OAuth
      const authUrl = `${this.baseUrl}/api/auth/replit`;
      window.location.href = authUrl;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  // Handle OAuth callback
  async handleCallback(code) {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/callback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });

      if (!response.ok) throw new Error('Authentication failed');

      const data = await response.json();
      this.setSession(data.token, data.user);
      return data.user;
    } catch (error) {
      console.error('OAuth callback failed:', error);
      throw error;
    }
  }

  // Validate existing session
  async validateSession(token) {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/validate`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Invalid session');

      const user = await response.json();
      this.setSession(token, user);
      return user;
    } catch (error) {
      console.error('Session validation failed:', error);
      throw error;
    }
  }

  // Set user session
  setSession(token, user) {
    this.sessionToken = token;
    this.user = user;
    this.isAuthenticated = true;
    localStorage.setItem('sessionToken', token);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  // Logout user
  logout() {
    this.sessionToken = null;
    this.user = null;
    this.isAuthenticated = false;
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('userData');
    
    // Redirect to login
    window.location.href = '/login';
  }

  // Get authenticated headers for API calls
  getAuthHeaders() {
    if (!this.sessionToken) return {};
    return { 'Authorization': `Bearer ${this.sessionToken}` };
  }

  // Check if user is authenticated
  checkAuth() {
    return this.isAuthenticated && !!this.sessionToken;
  }
}

// Export for global access
window.AuthManager = AuthManager; 