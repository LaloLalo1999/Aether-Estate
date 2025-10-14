export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'Lead' | 'Active' | 'Inactive';
  lastContacted: string;
}
export interface Property {
  id: string;
  name: string;
  address: string;
  price: number;
  status: 'For Sale' | 'Sold' | 'Pending';
  imageUrl: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
}
export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: 'Commission' | 'Expense' | 'Marketing' | 'Other';
  amount: number;
  type: 'Income' | 'Expense';
}
export interface Contract {
  id: string;
  propertyId: string;
  clientId: string;
  status: 'Draft' | 'Sent' | 'Signed' | 'Expired';
  signingDate?: string;
  expiryDate: string;
  amount: number;
}