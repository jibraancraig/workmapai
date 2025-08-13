// API Service Module - Implementing real API integration as specified in replit.md
class ApiService {
  constructor() {
    this.baseUrl = "https://your-api-domain.vercel.app" // Update with your actual API domain
    this.retryAttempts = 3
    this.retryDelay = 1000
  }

  // Generic API request with authentication and retry logic
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`
    const authHeaders = window.authManager?.getAuthHeaders() || {}

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
        ...options.headers,
      },
      ...options,
    }

    let lastError

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await fetch(url, config)

        // Handle authentication errors
        if (response.status === 401) {
          window.authManager?.logout()
          throw new Error("Unauthorized - please login again")
        }

        // Handle other errors
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        return await response.json()
      } catch (error) {
        lastError = error

        // Don't retry on authentication errors
        if (error.message.includes("Unauthorized")) {
          throw error
        }

        // Retry logic
        if (attempt < this.retryAttempts) {
          await this.delay(this.retryDelay * attempt)
          continue
        }
      }
    }

    throw lastError
  }

  // Dashboard data API
  async getDashboardData() {
    return this.request("/api/dashboard")
  }

  // Refresh analytics API
  async refreshAnalytics() {
    return this.request("/api/analytics/refresh", { method: "POST" })
  }

  // Export report API
  async exportReport() {
    return this.request("/api/export/report")
  }

  // Quick wins API
  async completeQuickWin(quickWinId) {
    return this.request(`/api/quick-wins/${quickWinId}/complete`, {
      method: "POST",
    })
  }

  // Integrations API
  async getIntegrations() {
    return this.request("/api/integrations")
  }

  // Usage analytics API
  async getUsageAnalytics(timeframe = "last30days") {
    return this.request(`/api/analytics/usage?timeframe=${timeframe}`)
  }

  // Recent activity API
  async getRecentActivity() {
    return this.request("/api/activity/recent")
  }

  // Helper method for delays
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  // Error handler with user-friendly messages
  handleError(error) {
    console.error("API Error:", error)

    let userMessage = "An unexpected error occurred"

    if (error.message.includes("Unauthorized")) {
      userMessage = "Please login again to continue"
    } else if (error.message.includes("Network")) {
      userMessage = "Network error - please check your connection"
    } else if (error.message.includes("500")) {
      userMessage = "Server error - please try again later"
    }

    return userMessage
  }
}

// Export for global access
window.ApiService = ApiService
