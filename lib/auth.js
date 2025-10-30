import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Mock authentication service
 */
export const auth = {
  /**
   * Mock login function
   * @param {string} userId - User ID
   * @param {string} password - Password
   * @returns {Promise<{ok: boolean, token?: string, error?: string}>}
   */
  async login(userId, password) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Basic validation
    if (!userId || !password) {
      return {
        ok: false,
        error: 'User ID and password are required'
      };
    }
    
    // Mock successful login for any non-empty credentials
    if (userId.length > 0 && password.length > 0) {
      const mockToken = 'mock_jwt_token_' + Date.now();
      
      // Store token in AsyncStorage
      await AsyncStorage.setItem('authToken', mockToken);
      await AsyncStorage.setItem('userId', userId);
      
      // Initialize recent actions on first login
      await this.initializeRecentActions();
      
      return {
        ok: true,
        token: mockToken
      };
    }
    
    return {
      ok: false,
      error: 'Invalid credentials'
    };
  },
  
  /**
   * Check if user is authenticated
   * @returns {Promise<boolean>}
   */
  async isAuthenticated() {
    try {
      const token = await AsyncStorage.getItem('authToken');
      return !!token;
    } catch (error) {
      return false;
    }
  },
  
  /**
   * Logout user
   * @returns {Promise<void>}
   */
  async logout() {
    await AsyncStorage.multiRemove(['authToken', 'userId']);
  },
  
  /**
   * Get current user ID
   * @returns {Promise<string|null>}
   */
  async getCurrentUserId() {
    return await AsyncStorage.getItem('userId');
  },
  
  /**
   * Initialize recent actions with mock data
   * @returns {Promise<void>}
   */
  async initializeRecentActions() {
    const existingActions = await AsyncStorage.getItem('recentActions');
    
    if (!existingActions) {
      const mockActions = [
        {
          id: '1',
          title: 'Deposit Account Opened',
          subtitle: 'DPS Account - BDT 50,000',
          timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(), // 12 minutes ago
          route: '/deposit/statement'
        },
        {
          id: '2',
          title: 'Loan Application Submitted',
          subtitle: 'Personal Loan Application',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          route: '/loan/status'
        },
        {
          id: '3',
          title: 'Viewed Loan Repayment Schedule',
          subtitle: 'Home Loan Account',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
          route: '/loan/repayment'
        },
        {
          id: '4',
          title: 'EMI Calculator Used',
          subtitle: 'Car Loan Calculation',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
          route: '/emi'
        }
      ];
      
      await AsyncStorage.setItem('recentActions', JSON.stringify(mockActions));
    }
  },
  
  /**
   * Get recent actions
   * @param {number} limit - Number of actions to return
   * @returns {Promise<Array>}
   */
  async getRecentActions(limit = 5) {
    try {
      const actionsJson = await AsyncStorage.getItem('recentActions');
      if (actionsJson) {
        const actions = JSON.parse(actionsJson);
        return actions.slice(0, limit);
      }
      return [];
    } catch (error) {
      console.error('Error getting recent actions:', error);
      return [];
    }
  },
  
  /**
   * Add a new recent action
   * @param {Object} action - Action object
   * @returns {Promise<void>}
   */
  async addRecentAction(action) {
    try {
      const actionsJson = await AsyncStorage.getItem('recentActions');
      let actions = actionsJson ? JSON.parse(actionsJson) : [];
      
      // Add new action at the beginning
      actions.unshift({
        ...action,
        id: Date.now().toString(),
        timestamp: new Date().toISOString()
      });
      
      // Keep only last 20 actions
      actions = actions.slice(0, 20);
      
      await AsyncStorage.setItem('recentActions', JSON.stringify(actions));
    } catch (error) {
      console.error('Error adding recent action:', error);
    }
  }
};

export default auth;