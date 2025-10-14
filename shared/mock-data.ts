import type { Client, Property, Transaction, Contract } from './types';
export const MOCK_CLIENTS: Client[] = [
  { id: 'cli-1', name: 'John Doe', email: 'john.doe@example.com', phone: '123-456-7890', status: 'Active', lastContacted: '2023-10-26' },
  { id: 'cli-2', name: 'Jane Smith', email: 'jane.smith@example.com', phone: '098-765-4321', status: 'Lead', lastContacted: '2023-10-28' },
  { id: 'cli-3', name: 'Sam Wilson', email: 'sam.wilson@example.com', phone: '555-555-5555', status: 'Inactive', lastContacted: '2023-01-15' },
  { id: 'cli-4', name: 'Alice Johnson', email: 'alice.j@example.com', phone: '111-222-3333', status: 'Active', lastContacted: '2023-10-25' },
  { id: 'cli-5', name: 'Bob Brown', email: 'bob.b@example.com', phone: '444-555-6666', status: 'Lead', lastContacted: '2023-10-29' },
];
export const MOCK_PROPERTIES: Property[] = [
  { id: 'prop-1', name: 'Modern Downtown Loft', address: '123 Main St, Anytown', price: 750000, status: 'For Sale', imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=2000', bedrooms: 2, bathrooms: 2, sqft: 1200 },
  { id: 'prop-2', name: 'Suburban Family Home', address: '456 Oak Ave, Suburbia', price: 1200000, status: 'Sold', imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2000', bedrooms: 4, bathrooms: 3, sqft: 2500 },
  { id: 'prop-3', name: 'Cozy Beachside Cottage', address: '789 Ocean Blvd, Beachtown', price: 950000, status: 'Pending', imageUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2000', bedrooms: 3, bathrooms: 2, sqft: 1800 },
  { id: 'prop-4', name: 'Luxury Penthouse Suite', address: '101 Sky High Rd, Metropolis', price: 3500000, status: 'For Sale', imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000', bedrooms: 3, bathrooms: 4, sqft: 3200 },
];
export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'trn-1', date: '2023-10-25', description: 'Commission from 456 Oak Ave', category: 'Commission', amount: 36000, type: 'Income' },
  { id: 'trn-2', date: '2023-10-22', description: 'Zillow Premier Agent Ads', category: 'Marketing', amount: -1500, type: 'Expense' },
  { id: 'trn-3', date: '2023-10-20', description: 'Office Supplies', category: 'Expense', amount: -250, type: 'Expense' },
  { id: 'trn-4', date: '2023-10-18', description: 'Rental income Q3', category: 'Other', amount: 5000, type: 'Income' },
];
export const MOCK_CONTRACTS: Contract[] = [
  { id: 'con-1', propertyId: 'prop-2', clientId: 'cli-1', status: 'Signed', signingDate: '2023-09-15', expiryDate: '2023-10-30', amount: 1200000 },
  { id: 'con-2', propertyId: 'prop-3', clientId: 'cli-4', status: 'Sent', expiryDate: '2023-11-10', amount: 950000 },
  { id: 'con-3', propertyId: 'prop-1', clientId: 'cli-2', status: 'Draft', expiryDate: '2023-11-20', amount: 750000 },
  { id: 'con-4', propertyId: 'prop-4', clientId: 'cli-5', status: 'Draft', expiryDate: '2023-12-01', amount: 3500000 },
];