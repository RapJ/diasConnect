
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export type KYCStatus = 'Unverified' | 'Pending' | 'Verified' | 'Rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  kycStatus: KYCStatus;
  onboardingCompleted?: boolean;
  preferences?: {
    interests: string[];
    currency: string;
    riskTolerance: 'Low' | 'Medium' | 'High';
  };
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
  ipAddress: string;
  severity: 'low' | 'medium' | 'high';
}

export interface Milestone {
  id: string;
  label: string;
  status: 'Completed' | 'In-Progress' | 'Pending';
  date?: string;
}

export interface Investment {
  id: string;
  title: string;
  location: string;
  country: string;
  description: string;
  fundingGoal: number;
  currentFunding: number;
  image: string;
  type: 'Agriculture' | 'Tech' | 'Real Estate' | 'Infrastructure';
  milestones?: Milestone[];
}

export interface UserInvestment extends Investment {
  amountInvested: number;
  dateInvested: string;
  status: 'Active' | 'Pending' | 'Completed';
  returnsEarned: number;
}

export interface Tour {
  id: string;
  title: string;
  location: string;
  date: string;
  seatsAvailable: number;
  image: string;
  type: 'Evangelism' | 'Tourism' | 'Business';
  coordinates: [number, number];
  milestones?: Milestone[];
}

export interface SupportRecord {
  id: string;
  type: 'Cash' | 'Kind';
  amount?: number;
  item?: string;
  supporterName: string;
  supporterNotes?: string;
  date: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  missionId: string;
}

export interface Transaction {
  id: string;
  type: 'Investment' | 'Donation' | 'Booking';
  amount: number;
  date: string;
  status: 'Completed' | 'Pending';
}

export interface InvestmentAlert {
  id: string;
  sector: string; 
  country: string; 
  minGoal: number;
  active: boolean;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'alert' | 'update';
  date: string;
  read: boolean;
  link?: string;
}
