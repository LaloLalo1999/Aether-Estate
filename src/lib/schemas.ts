import { z } from 'zod';
// Client Schema
export const clientSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
  status: z.enum(['Lead', 'Active', 'Inactive']),
});
export type ClientFormData = z.infer<typeof clientSchema>;
// Property Schema
export const propertySchema = z.object({
  name: z.string().min(5, { message: "Property name must be at least 5 characters." }),
  address: z.string().min(10, { message: "Address must be at least 10 characters." }),
  price: z.coerce.number().positive({ message: "Price must be a positive number." }),
  status: z.enum(['For Sale', 'Sold', 'Pending']),
  imageUrl: z.string().url({ message: "Please enter a valid image URL." }),
  bedrooms: z.coerce.number().int().min(0, { message: "Bedrooms cannot be negative." }),
  bathrooms: z.coerce.number().int().min(0, { message: "Bathrooms cannot be negative." }),
  sqft: z.coerce.number().int().positive({ message: "Square footage must be a positive number." }),
});
export type PropertyFormData = z.infer<typeof propertySchema>;
// Transaction Schema
export const transactionSchema = z.object({
  date: z.string().min(1, { message: "Date is required." }),
  description: z.string().min(3, { message: "Description must be at least 3 characters." }),
  category: z.enum(['Commission', 'Expense', 'Marketing', 'Other']),
  amount: z.coerce.number().refine(val => val !== 0, { message: "Amount cannot be zero." }),
  type: z.enum(['Income', 'Expense']),
});
export type TransactionFormData = z.infer<typeof transactionSchema>;
// Contract Schema
export const contractSchema = z.object({
  propertyId: z.string().min(1, { message: "Please select a property." }),
  clientId: z.string().min(1, { message: "Please select a client." }),
  status: z.enum(['Draft', 'Sent', 'Signed', 'Expired']),
  expiryDate: z.string().min(1, { message: "Expiry date is required." }),
  amount: z.coerce.number().positive({ message: "Amount must be a positive number." }),
  signingDate: z.string().optional(),
});
export type ContractFormData = z.infer<typeof contractSchema>;