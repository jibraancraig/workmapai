// Initialize Lucide icons
lucide.createIcons();

// Global state management
const state = {
  dashboardData: null,
  isLoading: false,
  user: {
    firstName: 'User',
    email: 'user@example.com',
    profileImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150'
  }
};

// Mock data for demonstration (in production, this would come from API calls)
const mockData = {
  efficiencyMetric: {
    efficiencyScore: 85,
    timeSaved: 12,
    activeTools: 3
  },
  integrations: [
    {
      id: '1',
      platform: 'slack',
      isActive: true,
      lastSyncAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      status: 'active'
    },
    {
      id: '2',
      platform: 'gmail',
      isActive: true,
      lastSyncAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      status: 'active'
    },
    {
      id: '3',
      platform: 'google_drive',
      isActive: true,
      lastSyncAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      status: 'active'
    },
    {
      id: '4',
      platform: 'notion',
      isActive: false,
      lastSyncAt: null,
      status: 'inactive'
    },
    {
      id: '5',
      platform: 'asana',
      isActive: false,
      lastSyncAt: null,
      status: 'inactive'
    }
  ],
  quickWins: [
    {
      id: '1',
      title: 'Automate email categorization',
      description: 'Set up rules to automatically sort incoming emails into folders',
      category: 'automation',
      impact: 'high',
      effort: 'medium',
      estimatedTimeSaved: '2h/week'
    },
    {
      id: '2',
      title: 'Consolidate project management tools',
      description: 'Reduce tool switching by using one platform for all projects',
      category: 'optimization',
      impact: 'medium',
      effort: 'high',
      estimatedTimeSaved: '1h/week'
    },
    {
      id: '3',
      title: 'Clean up unused integrations',
      description: 'Remove inactive connections to improve system performance',
      category: 'cleanup',
      impact: 'low',
      effort: 'low',
      estimatedTimeSaved: '30min/week'
    },
    {
      id: '4',
      title: 'Set up automated reporting',
      description: 'Create weekly productivity reports without manual work',
      category: 'automation',
      impact: 'medium',
      effort: 'medium',
      estimatedTimeSaved: '1.5h/week'
    }
  ],
  usageAnalytics: [
    {
      userId: '1',
      platform: 'slack',
      usagePercentage: 85,
      status: 'optimal'
    },
    {
      userId: '1',
      platform: 'gmail',
      usagePercentage: 72,
      status: 'needs_attention'
    },
    {
      userId: '1',
      platform: 'google_drive',
      usagePercentage: 45,
      status: 'underutilized'
    },
    {
      userId: '1',
      platform: 'notion',
      usagePercentage: 0,
      status: 'underutilized'
    },
    {
      userId: '1',
      platform: 'asana',
      usagePercentage: 0,
      status: 'underutilized'
    }
  ],
  recentActivity: [
    {
      id: '1',
      description: 'Efficiency score updated to 85%',
      createdAt: new Date(Date.now() - 30 * 60 * 1000)
    },
    {
      id: '2',
      description: 'New quick win identified: Automate email categorization',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: '3',
      description: 'Gmail integration synced successfully',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
    },
    {
      id: '4',
      description: 'Weekly productivity report generated',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  ]
};

// Platform configuration
const PLATFORM_CONFIG = {
  slack: { icon: "💬", name: "Slack", color: "platform-slack" },
  gmail: { icon: "📧", name: "Gmail", color: "platform-gmail" },
  google_drive: { icon: "📁", name: "Google Drive", color: "platform-google_drive" },
  notion: { icon: "📝", name: "Notion", color: "platform-notion" },
  asana: { icon: "✅", name: "Asana", color: "platform-asana" }
};

// Toast notification system
class ToastManager {
  constructor() {
    this.container = document.getElementById('toastContainer');
  }

  show({ title, description, variant = 'info', duration = 5000 }) {
    const toast = document.createElement('div');
    toast.className = `toast ${variant}`;
    
    const icon = this.getIcon(variant);
    
    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-description">${description}</div>
      </div>
      <button class="toast-close" onclick="this.parentElement.remove()">
        <i data-lucide="x"></i>
      </button>
    `;
    
    this.container.appendChild(toast);
    
    // Re-initialize icons for the new toast
    lucide.createIcons();
    
    // Auto-remove after duration
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, duration);
  }

  getIcon(variant) {
    switch (variant) {
      case 'success':
        return '<i data-lucide="check-circle"></i>';
      case 'error':
        return '<i data-lucide="alert-circle"></i>';
      case 'info':
      default:
        return '<i data-lucide="info"></i>';
    }
  }
}

// Initialize toast manager
const toast = new ToastManager();

// Dashboard data management
class DashboardManager {
  constructor() {
    this.data = null;
    this.isLoading = false;
  }

  async loadDashboardData() {
    this.setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production, this would be an actual API call
      this.data = mockData;
      this.renderDashboard();
      
      toast.show({
        title: 'Success',
        description: 'Dashboard data loaded successfully',
        variant: 'success'
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.show({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'error'
      });
    } finally {
      this.setLoading(false);
    }
  }

  async refreshData() {
    this.setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update some data to show refresh effect
      this.data.efficiencyMetric.efficiencyScore = Math.floor(Math.random() * 20) + 80;
      this.data.efficiencyMetric.timeSaved = Math.floor(Math.random() * 10) + 8;
      
      this.renderDashboard();
      
      toast.show({
        title: 'Success',
        description: 'Analytics refreshed successfully',
        variant: 'success'
      });
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.show({
        title: 'Error',
        description: 'Failed to refresh analytics',
        variant: 'error'
      });
    } finally {
      this.setLoading(false);
    }
  }

  async exportReport() {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create and download the report
      const reportData = {
        timestamp: new Date().toISOString(),
        user: state.user,
        metrics: this.data.efficiencyMetric,
        integrations: this.data.integrations,
        quickWins: this.data.quickWins,
        usageAnalytics: this.data.usageAnalytics
      };
      
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `workflow-audit-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.show({
        title: 'Success',
        description: 'Report exported successfully',
        variant: 'success'
      });
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.show({
        title: 'Error',
        description: 'Failed to export report',
        variant: 'error'
      });
    }
  }

  setLoading(loading) {
    this.isLoading = loading;
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    if (loading) {
      loadingOverlay.style.display = 'flex';
    } else {
      loadingOverlay.style.display = 'none';
    }
  }

  renderDashboard() {
    if (!this.data) return;
    
    this.renderMetrics();
    this.renderWorkflowMap();
    this.renderQuickWins();
    this.renderIntegrations();
    this.renderUsageAnalytics();
    this.renderRecentActivity();
  }

  renderMetrics() {
    const { efficiencyMetric, integrations, quickWins } = this.data;
    
    // Update efficiency score
    const efficiencyScore = document.getElementById('efficiencyScore');
    const efficiencyProgress = document.getElementById('efficiencyProgress');
    
    if (efficiencyScore) {
      efficiencyScore.textContent = efficiencyMetric.efficiencyScore;
      efficiencyScore.className = `score-value ${this.getScoreColorClass(efficiencyMetric.efficiencyScore)}`;
    }
    
    if (efficiencyProgress) {
      efficiencyProgress.style.width = `${Math.min(efficiencyMetric.efficiencyScore, 100)}%`;
      efficiencyProgress.className = `progress-fill ${this.getProgressColorClass(efficiencyMetric.efficiencyScore)}`;
    }
    
    // Update active tools
    const activeTools = document.getElementById('activeTools');
    if (activeTools) {
      const activeCount = integrations.filter(i => i.isActive).length;
      activeTools.textContent = `${activeCount}/${integrations.length}`;
    }
    
    // Update time saved
    const timeSaved = document.getElementById('timeSaved');
    if (timeSaved) {
      timeSaved.textContent = `${efficiencyMetric.timeSaved}h`;
    }
    
    // Update quick wins count
    const quickWinsCount = document.getElementById('quickWinsCount');
    if (quickWinsCount) {
      quickWinsCount.textContent = quickWins.length;
    }
  }

  renderWorkflowMap() {
    const workflowMap = document.getElementById('workflowMap');
    if (!workflowMap) return;
    
    const activeIntegrations = this.data.integrations.filter(i => i.isActive);
    
    if (activeIntegrations.length === 0) {
      workflowMap.innerHTML = `
        <div class="empty-state">
          <p>No active integrations</p>
          <p class="empty-state-subtitle">Connect your tools to see your workflow map</p>
        </div>
      `;
      return;
    }
    
    let workflowHTML = `
      <div class="text-center space-y-4">
        <div class="flex items-center justify-center space-x-4 flex-wrap">
    `;
    
    activeIntegrations.forEach((integration, index) => {
      const platformConfig = PLATFORM_CONFIG[integration.platform];
      if (!platformConfig) return;
      
      workflowHTML += `
        <div class="flex items-center">
          <div class="flex flex-col items-center">
            <div class="w-12 h-12 rounded-full flex items-center justify-center mb-2 ${platformConfig.color}">
              <span class="text-lg">${platformConfig.icon}</span>
            </div>
            <span class="text-xs text-gray-600 capitalize">
              ${integration.platform.replace('_', ' ')}
            </span>
          </div>
          ${index < activeIntegrations.length - 1 ? '<i data-lucide="arrow-right" class="w-4 h-4 text-gray-400 mx-2"></i>' : ''}
        </div>
      `;
    });
    
    workflowHTML += `
        </div>
        <p class="text-sm text-gray-500">
          Interactive workflow visualization showing your connected tools
        </p>
      </div>
    `;
    
    workflowMap.innerHTML = workflowHTML;
    lucide.createIcons();
  }

  renderQuickWins() {
    const quickWinsList = document.getElementById('quickWinsList');
    const quickWinsSubtitle = document.getElementById('quickWinsSubtitle');
    
    if (!quickWinsList) return;
    
    if (this.data.quickWins.length === 0) {
      quickWinsList.innerHTML = `
        <div class="empty-state">
          <p>No quick wins available</p>
          <p class="empty-state-subtitle">We'll analyze your workflow and suggest improvements soon</p>
        </div>
      `;
      return;
    }
    
    if (quickWinsSubtitle) {
      quickWinsSubtitle.textContent = `${this.data.quickWins.length} recommendations`;
    }
    
    let quickWinsHTML = '';
    
    this.data.quickWins.forEach(win => {
      const impactClass = this.getImpactClass(win.impact);
      const icon = this.getQuickWinIcon(win.category);
      const iconColorClass = this.getIconColorClass(win.impact);
      const actionText = this.getActionText(win.category);
      
      quickWinsHTML += `
        <div class="quick-win-item ${impactClass}">
          <div class="quick-win-icon ${impactClass}">
            ${icon}
          </div>
          <div class="quick-win-content">
            <h4 class="quick-win-title">${win.title}</h4>
            <p class="quick-win-description">${win.description}</p>
            <div class="quick-win-meta">
              <span>Impact: <span class="badge">${win.impact}</span></span>
              <span>Effort: <span class="badge">${win.effort}</span></span>
              ${win.estimatedTimeSaved ? `<span>Est. time saved: ${win.estimatedTimeSaved}</span>` : ''}
            </div>
          </div>
          <button class="quick-win-action ${iconColorClass}" onclick="dashboardManager.completeQuickWin('${win.id}')">
            ${actionText}
          </button>
        </div>
      `;
    });
    
    quickWinsList.innerHTML = quickWinsHTML;
  }

  renderIntegrations() {
    const integrationsList = document.getElementById('integrationsList');
    if (!integrationsList) return;
    
    if (this.data.integrations.length === 0) {
      integrationsList.innerHTML = `
        <div class="empty-state">
          <p class="mb-2">No integrations connected</p>
          <button class="btn btn-outline btn-sm">
            <i data-lucide="external-link" class="w-4 h-4 mr-2"></i>
            Add Integration
          </button>
        </div>
      `;
      lucide.createIcons();
      return;
    }
    
    let integrationsHTML = '';
    
    this.data.integrations.forEach(integration => {
      const config = PLATFORM_CONFIG[integration.platform];
      if (!config) return;
      
      const statusBadge = this.getIntegrationStatusBadge(integration);
      const lastSyncText = this.getLastSyncText(integration);
      
      integrationsHTML += `
        <div class="integration-item">
          <div class="integration-info">
            <div class="integration-icon ${config.color}">
              <span>${config.icon}</span>
            </div>
            <div>
              <div class="integration-name">${config.name}</div>
              <div class="integration-last-sync">Last sync: ${lastSyncText}</div>
            </div>
          </div>
          ${statusBadge}
        </div>
      `;
    });
    
    integrationsList.innerHTML = integrationsHTML;
  }

  renderUsageAnalytics() {
    const analyticsTable = document.getElementById('analyticsTable');
    if (!analyticsTable) return;
    
    if (this.data.usageAnalytics.length === 0) {
      analyticsTable.innerHTML = `
        <div class="empty-state">
          <p>No usage data available</p>
          <p class="empty-state-subtitle">Connect integrations to see usage analytics</p>
        </div>
      `;
      return;
    }
    
    let tableHTML = `
      <table class="min-w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tool
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Usage
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
    `;
    
    this.data.usageAnalytics.forEach(analytic => {
      const config = PLATFORM_CONFIG[analytic.platform];
      if (!config) return;
      
      const statusBadge = this.getAnalyticsStatusBadge(analytic.status);
      const progressColor = this.getAnalyticsProgressColor(analytic.status);
      
      tableHTML += `
        <tr>
          <td class="px-4 py-3 whitespace-nowrap">
            <div class="analytics-tool">
              <div class="analytics-tool-icon ${config.color}">
                <span class="text-xs">${config.icon}</span>
              </div>
              <span class="analytics-tool-name">${config.name}</span>
            </div>
          </td>
          <td class="px-4 py-3 whitespace-nowrap">
            <div class="analytics-usage">
              <div class="analytics-usage-value">${analytic.usagePercentage || 0}%</div>
              <div class="analytics-usage-bar">
                <div class="analytics-usage-fill ${progressColor}" style="width: ${Math.min(analytic.usagePercentage || 0, 100)}%"></div>
              </div>
            </div>
          </td>
          <td class="px-4 py-3 whitespace-nowrap">
            ${statusBadge}
          </td>
        </tr>
      `;
    });
    
    tableHTML += `
        </tbody>
      </table>
    `;
    
    analyticsTable.innerHTML = tableHTML;
  }

  renderRecentActivity() {
    const activityList = document.getElementById('activityList');
    if (!activityList) return;
    
    if (this.data.recentActivity.length === 0) {
      activityList.innerHTML = '<p class="text-gray-500 text-center py-4">No recent activity</p>';
      return;
    }
    
    let activityHTML = '';
    
    this.data.recentActivity.forEach(activity => {
      activityHTML += `
        <div class="activity-item">
          <div class="activity-icon">
            <i data-lucide="bar-chart-3"></i>
          </div>
          <div class="activity-content">
            <p class="activity-description">${activity.description}</p>
            <p class="activity-time">${new Date(activity.createdAt).toLocaleString()}</p>
          </div>
        </div>
      `;
    });
    
    activityList.innerHTML = activityHTML;
    lucide.createIcons();
  }

  // Helper methods
  getScoreColorClass(score) {
    if (score >= 80) return "text-success-green";
    if (score >= 60) return "text-warning-amber";
    return "text-danger-red";
  }

  getProgressColorClass(score) {
    if (score >= 80) return "bg-success-green";
    if (score >= 60) return "bg-warning-amber";
    return "bg-danger-red";
  }

  getImpactClass(impact) {
    switch (impact) {
      case 'high': return 'high-impact';
      case 'medium': return 'medium-impact';
      case 'low': return 'low-impact';
      default: return 'low-impact';
    }
  }

  getQuickWinIcon(category) {
    switch (category) {
      case 'optimization': return '<i data-lucide="alert-triangle"></i>';
      case 'cleanup': return '<i data-lucide="copy"></i>';
      case 'automation': return '<i data-lucide="repeat"></i>';
      default: return '<i data-lucide="bell"></i>';
    }
  }

  getIconColorClass(impact) {
    switch (impact) {
      case 'high': return 'text-danger-red';
      case 'medium': return 'text-warning-amber';
      case 'low': return 'text-primary-blue';
      default: return 'text-gray-500';
    }
  }

  getActionText(category) {
    switch (category) {
      case 'optimization': return 'Optimize';
      case 'cleanup': return 'Clean up';
      case 'automation': return 'Automate';
      default: return 'Act';
    }
  }

  getIntegrationStatusBadge(integration) {
    if (!integration.isActive) {
      return '<span class="integration-status-badge inactive">Inactive</span>';
    }
    
    const lastSync = integration.lastSyncAt ? new Date(integration.lastSyncAt) : null;
    const now = new Date();
    const hoursSinceSync = lastSync ? (now.getTime() - lastSync.getTime()) / (1000 * 60 * 60) : null;
    
    if (!lastSync || hoursSinceSync === null || hoursSinceSync > 24) {
      return '<span class="integration-status-badge syncing">Syncing</span>';
    }
    
    return '<span class="integration-status-badge active">Active</span>';
  }

  getLastSyncText(integration) {
    if (!integration.lastSyncAt) return "Never synced";
    
    const lastSync = new Date(integration.lastSyncAt);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - lastSync.getTime()) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes} min ago`;
    } else if (diffMinutes < 1440) {
      return `${Math.floor(diffMinutes / 60)} hr ago`;
    } else {
      return lastSync.toLocaleDateString();
    }
  }

  getAnalyticsStatusBadge(status) {
    switch (status) {
      case 'optimal':
        return '<span class="analytics-status-badge optimal">Optimal</span>';
      case 'needs_attention':
        return '<span class="analytics-status-badge needs-attention">Needs attention</span>';
      case 'underutilized':
        return '<span class="analytics-status-badge underutilized">Underutilized</span>';
      case 'moderate':
        return '<span class="analytics-status-badge moderate">Moderate</span>';
      default:
        return `<span class="analytics-status-badge">${status}</span>`;
    }
  }

  getAnalyticsProgressColor(status) {
    switch (status) {
      case 'optimal': return 'bg-success-green';
      case 'needs_attention': return 'bg-warning-amber';
      case 'underutilized': return 'bg-danger-red';
      case 'moderate': return 'bg-blue-500';
      default: return 'bg-gray-400';
    }
  }

  // Action methods
  async completeQuickWin(quickWinId) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove the quick win from the list
      this.data.quickWins = this.data.quickWins.filter(win => win.id !== quickWinId);
      
      // Re-render the quick wins section
      this.renderQuickWins();
      
      // Update the count
      const quickWinsCount = document.getElementById('quickWinsCount');
      if (quickWinsCount) {
        quickWinsCount.textContent = this.data.quickWins.length;
      }
      
      toast.show({
        title: 'Success',
        description: 'Quick win marked as completed',
        variant: 'success'
      });
    } catch (error) {
      console.error('Error completing quick win:', error);
      toast.show({
        title: 'Error',
        description: 'Failed to complete quick win',
        variant: 'error'
      });
    }
  }
}

// Initialize dashboard manager
const dashboardManager = new DashboardManager();

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the dashboard
  dashboardManager.loadDashboardData();
  
  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      dashboardManager.exportReport();
    });
  }
  
  // Refresh button
  const refreshBtn = document.getElementById('refreshBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      dashboardManager.refreshData();
    });
  }
  
  // Time select change
  const timeSelect = document.getElementById('timeSelect');
  if (timeSelect) {
    timeSelect.addEventListener('change', (e) => {
      // In production, this would trigger a new API call with different time range
      console.log('Time range changed to:', e.target.value);
    });
  }
  
  // Navigation links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Remove active class from all links
      navLinks.forEach(l => l.classList.remove('active'));
      
      // Add active class to clicked link
      link.classList.add('active');
      
      // In production, this would handle navigation
      console.log('Navigation to:', link.textContent);
    });
  });
  
  // Manage integrations button
  const manageBtn = document.querySelector('.manage-btn');
  if (manageBtn) {
    manageBtn.addEventListener('click', () => {
      // In production, this would navigate to integrations page
      console.log('Navigate to integrations management');
    });
  }
  
  // Logout button
  const logoutBtn = document.querySelector('.logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      // In production, this would handle logout
      console.log('User logout');
      toast.show({
        title: 'Logout',
        description: 'You have been logged out successfully',
        variant: 'info'
      });
    });
  }
});

// Utility function to format time
function formatTimeAgo(date) {
  const now = new Date();
  const diffMs = now - new Date(date);
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMins < 60) {
    return `${diffMins} min ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hr ago`;
  } else {
    return `${diffDays} days ago`;
  }
}

// Export for global access
window.dashboardManager = dashboardManager;
window.toast = toast; 