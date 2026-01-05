
import { User, Investment, Tour, Transaction, SupportRecord, UserRole, InvestmentAlert, AppNotification, UserInvestment, ActivityLog, KYCStatus } from '../types';
import { MOCK_INVESTMENTS, MOCK_TOURS, MOCK_USER_PORTFOLIO, MOCK_TRANSACTIONS, MOCK_USER, MOCK_ADMIN } from '../constants';

const DB_KEYS = {
  INVESTMENTS: 'dc_investments',
  TOURS: 'dc_tours',
  TRANSACTIONS: 'dc_transactions',
  PORTFOLIO: 'dc_portfolio',
  SUPPORT: 'dc_support',
  USERS: 'dc_users',
  ALERTS: 'dc_investment_alerts',
  NOTIFICATIONS: 'dc_notifications',
  CURRENT_USER: 'dc_session_user',
  LOGS: 'dc_audit_logs'
};

const SYNC_DELAY = 800;
const delay = (ms: number = SYNC_DELAY) => new Promise(resolve => setTimeout(resolve, ms));

const get = <T>(key: string, defaultValue: T): T => {
  try {
    const data = localStorage.getItem(key);
    if (!data) return defaultValue;
    return JSON.parse(data);
  } catch (e) {
    return defaultValue;
  }
};

const set = <T>(key: string, data: T) => {
  localStorage.setItem(key, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent('dc_database_updated', { detail: { key } }));
};

export const dbService = {
  initialize: () => {
    if (!localStorage.getItem(DB_KEYS.USERS)) {
      const users = [
        { ...MOCK_USER, kycStatus: 'Unverified' as KYCStatus },
        { ...MOCK_ADMIN, kycStatus: 'Verified' as KYCStatus }
      ];
      set(DB_KEYS.USERS, users);
    }
    if (!localStorage.getItem(DB_KEYS.INVESTMENTS)) set(DB_KEYS.INVESTMENTS, MOCK_INVESTMENTS);
    if (!localStorage.getItem(DB_KEYS.TOURS)) set(DB_KEYS.TOURS, MOCK_TOURS);
    if (!localStorage.getItem(DB_KEYS.LOGS)) set(DB_KEYS.LOGS, []);
  },

  // Audit Logging (Security Feature)
  logActivity: async (action: string, severity: 'low' | 'medium' | 'high' = 'low') => {
    const user = dbService.getCurrentUser();
    const logs = get<ActivityLog[]>(DB_KEYS.LOGS, []);
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      userId: user?.id || 'anonymous',
      userName: user?.name || 'Anonymous Guest',
      action,
      timestamp: new Date().toISOString(),
      ipAddress: '192.168.1.1', // Mock IP
      severity
    };
    set(DB_KEYS.LOGS, [newLog, ...logs].slice(0, 500)); // Keep last 500 logs
  },

  getAuditLogs: async (): Promise<ActivityLog[]> => get<ActivityLog[]>(DB_KEYS.LOGS, []),

  getCurrentUser: (): User | null => get<User | null>(DB_KEYS.CURRENT_USER, null),
  
  signIn: async (email: string): Promise<User> => {
    await delay(1200);
    const users = get<User[]>(DB_KEYS.USERS, []);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      await dbService.logActivity(`Failed login attempt: ${email}`, 'medium');
      throw new Error("Credentials not found in the global registry.");
    }
    
    set(DB_KEYS.CURRENT_USER, user);
    await dbService.logActivity(`User session authorized: ${user.name}`, 'low');
    return user;
  },

  signUp: async (userData: any): Promise<User> => {
    await delay(2000);
    const users = get<User[]>(DB_KEYS.USERS, []);
    
    if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      throw new Error("Identity already established.");
    }

    const newUser: User = {
      id: `u-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: UserRole.USER,
      kycStatus: 'Unverified',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=2E7D32&color=fff&bold=true`,
      onboardingCompleted: true,
      preferences: userData.preferences
    };

    set(DB_KEYS.USERS, [...users, newUser]);
    set(DB_KEYS.CURRENT_USER, newUser);
    await dbService.logActivity(`New identity registered: ${newUser.name}`, 'high');
    return newUser;
  },

  signOut: () => {
    const user = dbService.getCurrentUser();
    dbService.logActivity(`Session terminated: ${user?.name}`, 'low');
    localStorage.removeItem(DB_KEYS.CURRENT_USER);
    // Secure scrubbing of session-specific keys
    localStorage.removeItem(DB_KEYS.ALERTS); 
    window.dispatchEvent(new CustomEvent('dc_database_updated', { detail: { key: DB_KEYS.CURRENT_USER } }));
  },

  updateKYC: async (id: string, status: KYCStatus) => {
    const users = get<User[]>(DB_KEYS.USERS, []);
    const updated = users.map(u => u.id === id ? { ...u, kycStatus: status } : u);
    set(DB_KEYS.USERS, updated);
    
    const currentUser = dbService.getCurrentUser();
    if (currentUser?.id === id) {
      set(DB_KEYS.CURRENT_USER, { ...currentUser, kycStatus: status });
    }
    await dbService.logActivity(`KYC Status updated for ${id}: ${status}`, 'medium');
  },

  getUsers: async () => get<User[]>(DB_KEYS.USERS, []),
  
  getSupportRecords: async () => get<SupportRecord[]>(DB_KEYS.SUPPORT, []),

  // Added missing addSupportRecord method
  addSupportRecord: async (record: any) => {
    const list = get<SupportRecord[]>(DB_KEYS.SUPPORT, []);
    const newRecord = { 
      ...record, 
      id: `sup-${Date.now()}`, 
      date: new Date().toISOString(), 
      status: 'Pending' 
    };
    set(DB_KEYS.SUPPORT, [newRecord, ...list]);
    await dbService.logActivity(`Support record created: ${newRecord.id}`, 'low');
  },

  updateSupportStatus: async (id: string, status: 'Verified' | 'Rejected') => {
    const list = get<SupportRecord[]>(DB_KEYS.SUPPORT, []);
    const updated = list.map(r => r.id === id ? { ...r, status } : r);
    set(DB_KEYS.SUPPORT, updated);
    await dbService.logActivity(`Support record ${id} audit: ${status}`, 'medium');
    return updated;
  },

  getInvestments: async () => get<Investment[]>(DB_KEYS.INVESTMENTS, []),

  // Added missing updateInvestment method
  updateInvestment: async (id: string, data: Partial<Investment>) => {
    const list = get<Investment[]>(DB_KEYS.INVESTMENTS, []);
    const updated = list.map(i => i.id === id ? { ...i, ...data } : i);
    set(DB_KEYS.INVESTMENTS, updated);
  },

  // Added missing updateUserProfile method
  updateUserProfile: async (id: string, data: Partial<User>) => {
    const users = get<User[]>(DB_KEYS.USERS, []);
    const updated = users.map(u => u.id === id ? { ...u, ...data } : u);
    set(DB_KEYS.USERS, updated);
    
    const currentUser = dbService.getCurrentUser();
    if (currentUser?.id === id) {
      set(DB_KEYS.CURRENT_USER, { ...currentUser, ...data });
    }
    await dbService.logActivity(`Profile updated for ${id}`, 'low');
  },

  getTours: async () => get<Tour[]>(DB_KEYS.TOURS, []),
  getPortfolio: async () => get<UserInvestment[]>(DB_KEYS.PORTFOLIO, []),
  addToPortfolio: async (inv: UserInvestment) => {
    const list = get<UserInvestment[]>(DB_KEYS.PORTFOLIO, []);
    set(DB_KEYS.PORTFOLIO, [inv, ...list]);
    await dbService.logActivity(`Capital committed to asset: ${inv.title}`, 'high');
  },

  getTransactions: async () => get<Transaction[]>(DB_KEYS.TRANSACTIONS, []),
  addTransaction: async (tx: Transaction) => {
    const list = get<Transaction[]>(DB_KEYS.TRANSACTIONS, []);
    set(DB_KEYS.TRANSACTIONS, [tx, ...list]);
  },

  // Added missing getAlerts method
  getAlerts: (): InvestmentAlert[] => get<InvestmentAlert[]>(DB_KEYS.ALERTS, []),
  
  // Added missing saveAlert method
  saveAlert: (alert: InvestmentAlert): InvestmentAlert[] => {
    const alerts = get<InvestmentAlert[]>(DB_KEYS.ALERTS, []);
    const updated = [alert, ...alerts];
    set(DB_KEYS.ALERTS, updated);
    return updated;
  },

  // Added missing deleteAlert method
  deleteAlert: (id: string): InvestmentAlert[] => {
    const alerts = get<InvestmentAlert[]>(DB_KEYS.ALERTS, []);
    const updated = alerts.filter(a => a.id !== id);
    set(DB_KEYS.ALERTS, updated);
    return updated;
  },

  getNotifications: async () => get<AppNotification[]>(DB_KEYS.NOTIFICATIONS, []),
  addNotification: async (notif: any) => {
    const list = get<AppNotification[]>(DB_KEYS.NOTIFICATIONS, []);
    const newNotif = { ...notif, id: `notif-${Date.now()}`, date: new Date().toISOString(), read: false };
    set(DB_KEYS.NOTIFICATIONS, [newNotif, ...list]);
  },
  markAsRead: async (id: string) => {
    const list = get<AppNotification[]>(DB_KEYS.NOTIFICATIONS, []);
    set(DB_KEYS.NOTIFICATIONS, list.map(n => n.id === id ? { ...n, read: true } : n));
  },
  markAllAsRead: async () => {
    const list = get<AppNotification[]>(DB_KEYS.NOTIFICATIONS, []);
    set(DB_KEYS.NOTIFICATIONS, list.map(n => ({ ...n, read: true })));
  },
  clearNotifications: async () => set(DB_KEYS.NOTIFICATIONS, [])
};

dbService.initialize();
