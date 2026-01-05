
import { Investment, Tour, User, UserRole, Transaction, SupportRecord, UserInvestment } from './types';

export const COLORS = {
  primary: '#2E7D32',
  accent: '#FFD700',
  background: '#F9FAFB',
};

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Kofi Mensah',
  email: 'kofi@example.com',
  role: UserRole.USER,
  avatar: 'https://picsum.photos/seed/kofi/200',
  // Added missing kycStatus
  kycStatus: 'Unverified',
  onboardingCompleted: false,
};

export const MOCK_ADMIN: User = {
  id: 'a1',
  name: 'Admin Sarah',
  email: 'admin@diasporaconnect.com',
  role: UserRole.ADMIN,
  avatar: 'https://picsum.photos/seed/admin/200',
  // Added missing kycStatus
  kycStatus: 'Verified',
  onboardingCompleted: true,
};

export const MOCK_INVESTMENTS: Investment[] = [
  {
    id: 'i1',
    title: 'Sustainable Cocoa Farm',
    location: 'Kumasi, Ghana',
    country: 'Ghana',
    description: 'Expanding high-yield organic cocoa production for global export.',
    fundingGoal: 500000,
    currentFunding: 325000,
    image: 'https://picsum.photos/seed/cocoa/600/400',
    type: 'Agriculture',
    milestones: [
      { id: 'm1', label: 'Land Acquisition', status: 'Completed', date: '2023-08-10' },
      { id: 'm2', label: 'Seedling Nursery', status: 'Completed', date: '2023-12-05' },
      { id: 'm3', label: 'Irrigation Setup', status: 'In-Progress' },
      { id: 'm4', label: 'First Harvest', status: 'Pending' }
    ]
  },
  {
    id: 'i2',
    title: 'Solar Power Grid',
    location: 'Nairobi, Kenya',
    country: 'Kenya',
    description: 'Off-grid solar solutions for growing rural communities.',
    fundingGoal: 1200000,
    currentFunding: 850000,
    image: 'https://picsum.photos/seed/solar/600/400',
    type: 'Infrastructure',
    milestones: [
      { id: 'm1', label: 'Grid Design', status: 'Completed' },
      { id: 'm2', label: 'Panel Installation', status: 'In-Progress' }
    ]
  },
  {
    id: 'i3',
    title: 'Tech Hub Accelerator',
    location: 'Lagos, Nigeria',
    country: 'Nigeria',
    description: 'Empowering the next generation of African SaaS startups.',
    fundingGoal: 2000000,
    currentFunding: 1100000,
    image: 'https://picsum.photos/seed/tech/600/400',
    type: 'Tech'
  },
  {
    id: 'i4',
    title: 'Lekki Coastal Estates',
    location: 'Lagos, Nigeria',
    country: 'Nigeria',
    description: 'Luxury affordable housing development with smart city integration.',
    fundingGoal: 5000000,
    currentFunding: 4100000,
    image: 'https://picsum.photos/seed/realestate/600/400',
    type: 'Real Estate'
  }
];

export const MOCK_USER_PORTFOLIO: UserInvestment[] = [
  {
    ...MOCK_INVESTMENTS[0],
    amountInvested: 10000,
    dateInvested: '2023-11-15',
    status: 'Active',
    returnsEarned: 450,
  }
];

export const MOCK_TOURS: Tour[] = [
  {
    id: 't1',
    title: 'Lagos Mission Trip',
    location: 'Lagos, Nigeria',
    date: '2024-08-15',
    seatsAvailable: 12,
    image: 'https://picsum.photos/seed/mission1/600/400',
    type: 'Evangelism',
    coordinates: [6.5244, 3.3792],
    milestones: [
      { id: 'mt1', label: 'Logistics Finalized', status: 'Completed', date: '2024-02-01' },
      { id: 'mt2', label: 'Volunteer Onboarding', status: 'In-Progress' },
      { id: 'mt3', label: 'Equipment Shipment', status: 'Pending' },
      { id: 'mt4', label: 'Mission Departure', status: 'Pending', date: '2024-08-15' }
    ]
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'tr1', type: 'Investment', amount: 5000, date: '2024-03-01', status: 'Completed' },
];

export const EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  GHS: 14.5,
  NGN: 1550,
  KES: 130
};
