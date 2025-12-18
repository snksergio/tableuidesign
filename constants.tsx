
import { Column, User } from './types';

export const INITIAL_COLUMNS: Column[] = [
  { key: 'firstName', label: 'First Name', visible: true, sticky: 'left', width: '250px' },
  { key: 'lastName', label: 'Last Name', visible: true, width: '150px' },
  { key: 'email', label: 'Email Address', visible: true, width: '240px' },
  { key: 'role', label: 'Role', visible: true, width: '140px' },
  { key: 'status', label: 'Status', visible: true, width: '120px' },
  // 10 Additional Columns
  { key: 'phoneNumber', label: 'Phone', visible: true, width: '160px' },
  { key: 'companyName', label: 'Company', visible: true, width: '180px' },
  { key: 'city', label: 'City', visible: true, width: '140px' },
  { key: 'zipCode', label: 'Zip Code', visible: true, width: '100px' },
  { key: 'twitterHandle', label: 'Twitter', visible: true, width: '150px' },
  { key: 'githubUsername', label: 'GitHub', visible: true, width: '150px' },
  { key: 'timezone', label: 'Timezone', visible: true, width: '160px' },
  { key: 'lastLoginIp', label: 'Login IP', visible: true, width: '140px' },
  { key: 'projectBudget', label: 'Budget', visible: true, width: '140px' },
  { key: 'language', label: 'Language', visible: true, width: '120px' },
  // Existing extra columns
  { key: 'age', label: 'Age', visible: true, width: '80px' },
  { key: 'salary', label: 'Salary', visible: true, width: '120px' },
  { key: 'country', label: 'Country', visible: true, width: '150px' },
  { key: 'department', label: 'Department', visible: true, width: '150px' },
  { key: 'joinedDate', label: 'Joined Date', visible: true, width: '150px' },
  { key: 'actions', label: 'Actions', visible: true, sticky: 'right', width: '100px' },
];

const firstNames = ["Emily", "Michael", "Sophia", "James", "Emma", "Olivia", "Alexander", "Ava", "Ethan", "Isabella"];
const lastNames = ["Johnson", "Williams", "Brown", "Davis", "Miller", "Wilson", "Jones", "Taylor", "Martinez", "Anderson"];
const roles = ["Admin", "Moderator", "Editor", "User", "Manager", "Developer"];
const statuses: any[] = ["Active", "Warning", "Danger", "Inactive"];
const countries = ["USA", "Brazil", "Canada", "Germany", "UK", "France", "Japan", "Australia"];
const departments = ["Engineering", "Product", "Sales", "HR", "Marketing", "Legal"];
const companies = ["TechCorp", "Innovate Solutions", "DataFlow", "CloudNine", "GreenEnergy", "Nexus Labs"];
const languages = ["English", "Portuguese", "Spanish", "French", "German", "Japanese"];

export const MOCK_DATA: User[] = Array.from({ length: 100 }).map((_, i) => ({
  id: `user-${i}`,
  firstName: firstNames[i % 10],
  lastName: lastNames[i % 10],
  email: `${firstNames[i % 10].toLowerCase()}.${lastNames[i % 10].toLowerCase()}@company.com`,
  role: roles[i % 6],
  status: statuses[i % 4],
  age: 20 + (i % 30),
  salary: 45000 + (i * 500),
  country: countries[i % 8],
  department: departments[i % 6],
  joinedDate: "2023-01-15",
  lastActive: "2 hours ago",
  eyeColor: i % 2 === 0 ? "Green" : "Blue",
  project: "Alpha-1",
  location: "Remote",
  tags: ["Priority", "Remote"],
  // New mock values
  phoneNumber: `+55 (11) 9${Math.floor(Math.random() * 90000000 + 10000000)}`,
  city: ["São Paulo", "New York", "London", "Berlin", "Tokyo"][i % 5],
  zipCode: `${Math.floor(Math.random() * 90000 + 10000)}`,
  companyName: companies[i % 6],
  twitterHandle: `@${firstNames[i % 10].toLowerCase()}_${i}`,
  githubUsername: `${firstNames[i % 10].toLowerCase()}${i}`,
  timezone: ["UTC-3", "UTC+0", "UTC+1", "UTC-5", "UTC+9"][i % 5],
  lastLoginIp: `192.168.1.${i}`,
  projectBudget: 5000 + (i * 1200),
  language: languages[i % 6]
}));
