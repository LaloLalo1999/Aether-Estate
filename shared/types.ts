export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  settings: Record<string, unknown>;
  subscriptionTier: 'free' | 'professional' | 'enterprise';
  subscriptionStatus: 'active' | 'cancelled' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  organizationId: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  phone?: string;
  role: 'super_admin' | 'admin' | 'manager' | 'agent' | 'viewer';
  isActive: boolean;
  settings: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  phone: string;
  status: 'Lead' | 'Active' | 'Inactive';
  lastContacted: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Property {
  id: string;
  organizationId: string;
  name: string;
  address: string;
  price: number;
  status: 'For Sale' | 'Sold' | 'Pending';
  imageUrl: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  organizationId: string;
  date: string;
  description: string;
  category: 'Commission' | 'Expense' | 'Marketing' | 'Other';
  amount: number;
  type: 'Income' | 'Expense';
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Contract {
  id: string;
  organizationId: string;
  propertyId: string;
  clientId: string;
  status: 'Draft' | 'Sent' | 'Signed' | 'Expired';
  signingDate?: string;
  expiryDate: string;
  amount: number;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientInteraction {
  id: string;
  organizationId: string;
  clientId: string;
  userId: string;
  interactionType: 'call' | 'email' | 'meeting' | 'note' | 'sms';
  subject: string;
  content: string;
  interactionDate: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  organizationId: string;
  conversationId: string;
  senderId: string;
  recipientType: 'client' | 'user';
  recipientId: string;
  messageType: 'email' | 'sms' | 'internal';
  subject?: string;
  content: string;
  status: 'draft' | 'sent' | 'delivered' | 'read' | 'failed';
  readAt?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface Appointment {
  id: string;
  organizationId: string;
  clientId: string;
  propertyId?: string;
  userId: string;
  title: string;
  description?: string;
  appointmentType: 'showing' | 'meeting' | 'call' | 'inspection' | 'closing';
  startTime: string;
  endTime: string;
  location?: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  calComEventId?: string;
  reminderSent: boolean;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  organizationId: string;
  entityType: 'client' | 'property' | 'contract' | 'transaction' | 'organization';
  entityId: string;
  uploadedBy: string;
  name: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  category: string;
  isSigned: boolean;
  signedAt?: string;
  docusignEnvelopeId?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}