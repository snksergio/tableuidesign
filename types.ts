
export type UserStatus = 'Active' | 'Warning' | 'Danger' | 'Inactive';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  age: number;
  eyeColor: string;
  status: UserStatus;
  country: string;
  salary: number;
  joinedDate: string;
  department: string;
  lastActive: string;
  project: string;
  location: string;
  tags: string[];
  // New fields for scrolling demo
  phoneNumber: string;
  city: string;
  zipCode: string;
  companyName: string;
  twitterHandle: string;
  githubUsername: string;
  timezone: string;
  lastLoginIp: string;
  projectBudget: number;
  language: string;
}

export type Density = 'compact' | 'standard' | 'relaxed';

export interface Column {
  key: keyof User | 'actions';
  label: string;
  visible: boolean;
  width?: string;
  sticky?: 'left' | 'right';
}

export interface Filter {
  field: string;
  value: string;
  label: string;
}
