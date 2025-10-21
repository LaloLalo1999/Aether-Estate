import { getSupabaseClient } from './supabase';
import type { Client, Property, Transaction, Contract } from '@shared/types';
import { MOCK_CLIENTS, MOCK_PROPERTIES, MOCK_TRANSACTIONS, MOCK_CONTRACTS } from '@shared/mock-data';

export class ClientEntity {
  static readonly tableName = 'clients';
  static seedData = MOCK_CLIENTS;

  static async list(cursor?: string | null, limit: number = 20): Promise<{ items: Client[]; next: string | null }> {
    const supabase = getSupabaseClient();

    let query = supabase
      .from(this.tableName)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit + 1);

    if (cursor) {
      query = query.lt('created_at', cursor);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to list clients: ${error.message}`);
    }

    const hasMore = data.length > limit;
    const items = hasMore ? data.slice(0, limit) : data;
    const next = hasMore ? items[items.length - 1]?.created_at : null;

    return {
      items: items.map(row => ({
        id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        status: row.status as Client['status'],
        lastContacted: row.last_contacted,
      })),
      next,
    };
  }

  static async create(data: Omit<Client, 'id'>): Promise<Client> {
    const supabase = getSupabaseClient();

    const { data: inserted, error } = await supabase
      .from(this.tableName)
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        status: data.status,
        last_contacted: data.lastContacted,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create client: ${error.message}`);
    }

    return {
      id: inserted.id,
      name: inserted.name,
      email: inserted.email,
      phone: inserted.phone,
      status: inserted.status as Client['status'],
      lastContacted: inserted.last_contacted,
    };
  }

  static async get(id: string): Promise<Client | null> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to get client: ${error.message}`);
    }

    if (!data) return null;

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      status: data.status as Client['status'],
      lastContacted: data.last_contacted,
    };
  }

  static async update(id: string, updates: Partial<Omit<Client, 'id'>>): Promise<Client> {
    const supabase = getSupabaseClient();

    const updateData: Record<string, unknown> = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.email !== undefined) updateData.email = updates.email;
    if (updates.phone !== undefined) updateData.phone = updates.phone;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.lastContacted !== undefined) updateData.last_contacted = updates.lastContacted;

    const { data, error } = await supabase
      .from(this.tableName)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update client: ${error.message}`);
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      status: data.status as Client['status'],
      lastContacted: data.last_contacted,
    };
  }

  static async delete(id: string): Promise<boolean> {
    const supabase = getSupabaseClient();

    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete client: ${error.message}`);
    }

    return true;
  }

  static async ensureSeed(): Promise<void> {
    const supabase = getSupabaseClient();

    const { count } = await supabase
      .from(this.tableName)
      .select('*', { count: 'exact', head: true });

    if (count === 0 && this.seedData.length > 0) {
      const { error } = await supabase
        .from(this.tableName)
        .insert(this.seedData.map(c => ({
          id: c.id,
          name: c.name,
          email: c.email,
          phone: c.phone,
          status: c.status,
          last_contacted: c.lastContacted,
        })));

      if (error) {
        console.error('Failed to seed clients:', error.message);
      }
    }
  }
}

export class PropertyEntity {
  static readonly tableName = 'properties';
  static seedData = MOCK_PROPERTIES;

  static async list(cursor?: string | null, limit: number = 20): Promise<{ items: Property[]; next: string | null }> {
    const supabase = getSupabaseClient();

    let query = supabase
      .from(this.tableName)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit + 1);

    if (cursor) {
      query = query.lt('created_at', cursor);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to list properties: ${error.message}`);
    }

    const hasMore = data.length > limit;
    const items = hasMore ? data.slice(0, limit) : data;
    const next = hasMore ? items[items.length - 1]?.created_at : null;

    return {
      items: items.map(row => ({
        id: row.id,
        name: row.name,
        address: row.address,
        price: Number(row.price),
        status: row.status as Property['status'],
        imageUrl: row.image_url,
        bedrooms: row.bedrooms,
        bathrooms: row.bathrooms,
        sqft: row.sqft,
      })),
      next,
    };
  }

  static async create(data: Omit<Property, 'id'>): Promise<Property> {
    const supabase = getSupabaseClient();

    const { data: inserted, error } = await supabase
      .from(this.tableName)
      .insert({
        name: data.name,
        address: data.address,
        price: data.price,
        status: data.status,
        image_url: data.imageUrl,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        sqft: data.sqft,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create property: ${error.message}`);
    }

    return {
      id: inserted.id,
      name: inserted.name,
      address: inserted.address,
      price: Number(inserted.price),
      status: inserted.status as Property['status'],
      imageUrl: inserted.image_url,
      bedrooms: inserted.bedrooms,
      bathrooms: inserted.bathrooms,
      sqft: inserted.sqft,
    };
  }

  static async get(id: string): Promise<Property | null> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to get property: ${error.message}`);
    }

    if (!data) return null;

    return {
      id: data.id,
      name: data.name,
      address: data.address,
      price: Number(data.price),
      status: data.status as Property['status'],
      imageUrl: data.image_url,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      sqft: data.sqft,
    };
  }

  static async update(id: string, updates: Partial<Omit<Property, 'id'>>): Promise<Property> {
    const supabase = getSupabaseClient();

    const updateData: Record<string, unknown> = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.address !== undefined) updateData.address = updates.address;
    if (updates.price !== undefined) updateData.price = updates.price;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.imageUrl !== undefined) updateData.image_url = updates.imageUrl;
    if (updates.bedrooms !== undefined) updateData.bedrooms = updates.bedrooms;
    if (updates.bathrooms !== undefined) updateData.bathrooms = updates.bathrooms;
    if (updates.sqft !== undefined) updateData.sqft = updates.sqft;

    const { data, error } = await supabase
      .from(this.tableName)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update property: ${error.message}`);
    }

    return {
      id: data.id,
      name: data.name,
      address: data.address,
      price: Number(data.price),
      status: data.status as Property['status'],
      imageUrl: data.image_url,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      sqft: data.sqft,
    };
  }

  static async delete(id: string): Promise<boolean> {
    const supabase = getSupabaseClient();

    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete property: ${error.message}`);
    }

    return true;
  }

  static async ensureSeed(): Promise<void> {
    const supabase = getSupabaseClient();

    const { count } = await supabase
      .from(this.tableName)
      .select('*', { count: 'exact', head: true });

    if (count === 0 && this.seedData.length > 0) {
      const { error } = await supabase
        .from(this.tableName)
        .insert(this.seedData.map(p => ({
          id: p.id,
          name: p.name,
          address: p.address,
          price: p.price,
          status: p.status,
          image_url: p.imageUrl,
          bedrooms: p.bedrooms,
          bathrooms: p.bathrooms,
          sqft: p.sqft,
        })));

      if (error) {
        console.error('Failed to seed properties:', error.message);
      }
    }
  }
}

export class TransactionEntity {
  static readonly tableName = 'transactions';
  static seedData = MOCK_TRANSACTIONS;

  static async list(cursor?: string | null, limit: number = 20): Promise<{ items: Transaction[]; next: string | null }> {
    const supabase = getSupabaseClient();

    let query = supabase
      .from(this.tableName)
      .select('*')
      .order('date', { ascending: false })
      .limit(limit + 1);

    if (cursor) {
      query = query.lt('date', cursor);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to list transactions: ${error.message}`);
    }

    const hasMore = data.length > limit;
    const items = hasMore ? data.slice(0, limit) : data;
    const next = hasMore ? items[items.length - 1]?.date : null;

    return {
      items: items.map(row => ({
        id: row.id,
        date: row.date,
        description: row.description,
        category: row.category as Transaction['category'],
        amount: Number(row.amount),
        type: row.type as Transaction['type'],
      })),
      next,
    };
  }

  static async create(data: Omit<Transaction, 'id'>): Promise<Transaction> {
    const supabase = getSupabaseClient();

    const { data: inserted, error } = await supabase
      .from(this.tableName)
      .insert({
        date: data.date,
        description: data.description,
        category: data.category,
        amount: data.amount,
        type: data.type,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create transaction: ${error.message}`);
    }

    return {
      id: inserted.id,
      date: inserted.date,
      description: inserted.description,
      category: inserted.category as Transaction['category'],
      amount: Number(inserted.amount),
      type: inserted.type as Transaction['type'],
    };
  }

  static async get(id: string): Promise<Transaction | null> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to get transaction: ${error.message}`);
    }

    if (!data) return null;

    return {
      id: data.id,
      date: data.date,
      description: data.description,
      category: data.category as Transaction['category'],
      amount: Number(data.amount),
      type: data.type as Transaction['type'],
    };
  }

  static async update(id: string, updates: Partial<Omit<Transaction, 'id'>>): Promise<Transaction> {
    const supabase = getSupabaseClient();

    const updateData: Record<string, unknown> = {};
    if (updates.date !== undefined) updateData.date = updates.date;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.amount !== undefined) updateData.amount = updates.amount;
    if (updates.type !== undefined) updateData.type = updates.type;

    const { data, error } = await supabase
      .from(this.tableName)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update transaction: ${error.message}`);
    }

    return {
      id: data.id,
      date: data.date,
      description: data.description,
      category: data.category as Transaction['category'],
      amount: Number(data.amount),
      type: data.type as Transaction['type'],
    };
  }

  static async delete(id: string): Promise<boolean> {
    const supabase = getSupabaseClient();

    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete transaction: ${error.message}`);
    }

    return true;
  }

  static async ensureSeed(): Promise<void> {
    const supabase = getSupabaseClient();

    const { count } = await supabase
      .from(this.tableName)
      .select('*', { count: 'exact', head: true });

    if (count === 0 && this.seedData.length > 0) {
      const { error } = await supabase
        .from(this.tableName)
        .insert(this.seedData.map(t => ({
          id: t.id,
          date: t.date,
          description: t.description,
          category: t.category,
          amount: t.amount,
          type: t.type,
        })));

      if (error) {
        console.error('Failed to seed transactions:', error.message);
      }
    }
  }
}

export class ContractEntity {
  static readonly tableName = 'contracts';
  static seedData = MOCK_CONTRACTS;

  static async list(cursor?: string | null, limit: number = 20): Promise<{ items: Contract[]; next: string | null }> {
    const supabase = getSupabaseClient();

    let query = supabase
      .from(this.tableName)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit + 1);

    if (cursor) {
      query = query.lt('created_at', cursor);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to list contracts: ${error.message}`);
    }

    const hasMore = data.length > limit;
    const items = hasMore ? data.slice(0, limit) : data;
    const next = hasMore ? items[items.length - 1]?.created_at : null;

    return {
      items: items.map(row => ({
        id: row.id,
        propertyId: row.property_id,
        clientId: row.client_id,
        status: row.status as Contract['status'],
        signingDate: row.signing_date || undefined,
        expiryDate: row.expiry_date,
        amount: Number(row.amount),
      })),
      next,
    };
  }

  static async create(data: Omit<Contract, 'id'>): Promise<Contract> {
    const supabase = getSupabaseClient();

    const { data: inserted, error } = await supabase
      .from(this.tableName)
      .insert({
        property_id: data.propertyId,
        client_id: data.clientId,
        status: data.status,
        signing_date: data.signingDate || null,
        expiry_date: data.expiryDate,
        amount: data.amount,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create contract: ${error.message}`);
    }

    return {
      id: inserted.id,
      propertyId: inserted.property_id,
      clientId: inserted.client_id,
      status: inserted.status as Contract['status'],
      signingDate: inserted.signing_date || undefined,
      expiryDate: inserted.expiry_date,
      amount: Number(inserted.amount),
    };
  }

  static async get(id: string): Promise<Contract | null> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to get contract: ${error.message}`);
    }

    if (!data) return null;

    return {
      id: data.id,
      propertyId: data.property_id,
      clientId: data.client_id,
      status: data.status as Contract['status'],
      signingDate: data.signing_date || undefined,
      expiryDate: data.expiry_date,
      amount: Number(data.amount),
    };
  }

  static async update(id: string, updates: Partial<Omit<Contract, 'id'>>): Promise<Contract> {
    const supabase = getSupabaseClient();

    const updateData: Record<string, unknown> = {};
    if (updates.propertyId !== undefined) updateData.property_id = updates.propertyId;
    if (updates.clientId !== undefined) updateData.client_id = updates.clientId;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.signingDate !== undefined) updateData.signing_date = updates.signingDate || null;
    if (updates.expiryDate !== undefined) updateData.expiry_date = updates.expiryDate;
    if (updates.amount !== undefined) updateData.amount = updates.amount;

    const { data, error } = await supabase
      .from(this.tableName)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update contract: ${error.message}`);
    }

    return {
      id: data.id,
      propertyId: data.property_id,
      clientId: data.client_id,
      status: data.status as Contract['status'],
      signingDate: data.signing_date || undefined,
      expiryDate: data.expiry_date,
      amount: Number(data.amount),
    };
  }

  static async delete(id: string): Promise<boolean> {
    const supabase = getSupabaseClient();

    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete contract: ${error.message}`);
    }

    return true;
  }

  static async ensureSeed(): Promise<void> {
    const supabase = getSupabaseClient();

    const { count } = await supabase
      .from(this.tableName)
      .select('*', { count: 'exact', head: true });

    if (count === 0 && this.seedData.length > 0) {
      const { error } = await supabase
        .from(this.tableName)
        .insert(this.seedData.map(c => ({
          id: c.id,
          property_id: c.propertyId,
          client_id: c.clientId,
          status: c.status,
          signing_date: c.signingDate || null,
          expiry_date: c.expiryDate,
          amount: c.amount,
        })));

      if (error) {
        console.error('Failed to seed contracts:', error.message);
      }
    }
  }
}
