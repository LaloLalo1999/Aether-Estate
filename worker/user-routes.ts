import { Hono } from "hono";
import { ClientEntity, PropertyEntity, TransactionEntity, ContractEntity } from "./entities";
import { z } from 'zod';

type ApiResponse<T = unknown> = { success: boolean; data?: T; error?: string };

const ok = <T>(c: any, data: T) => c.json({ success: true, data } as ApiResponse<T>);
const bad = (c: any, error: string) => c.json({ success: false, error } as ApiResponse, 400);
const notFound = (c: any, error = 'not found') => c.json({ success: false, error } as ApiResponse, 404);

const getPagination = (c: any) => {
  const cq = c.req.query('cursor');
  const lq = c.req.query('limit');
  const limit = lq ? Math.max(1, Math.min(100, Number(lq) | 0)) : 20;
  return { cursor: cq ?? null, limit };
};

const clientSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  status: z.enum(['Lead', 'Active', 'Inactive']),
});

const propertySchema = z.object({
  name: z.string().min(5),
  address: z.string().min(10),
  price: z.coerce.number().positive(),
  status: z.enum(['For Sale', 'Sold', 'Pending']),
  imageUrl: z.string().url(),
  bedrooms: z.coerce.number().int().min(0),
  bathrooms: z.coerce.number().int().min(0),
  sqft: z.coerce.number().int().positive(),
});

const transactionSchema = z.object({
  date: z.string().datetime(),
  description: z.string().min(3),
  category: z.enum(['Commission', 'Expense', 'Marketing', 'Other']),
  amount: z.coerce.number(),
  type: z.enum(['Income', 'Expense']),
});

const contractSchema = z.object({
  propertyId: z.string().min(1),
  clientId: z.string().min(1),
  status: z.enum(['Draft', 'Sent', 'Signed', 'Expired']),
  expiryDate: z.string().datetime(),
  amount: z.coerce.number().positive(),
  signingDate: z.string().datetime().optional(),
});

export function userRoutes(app: Hono) {
  const clientApi = new Hono();

  clientApi.get('/', async (c) => {
    try {
      await ClientEntity.ensureSeed();
      const { cursor, limit } = getPagination(c);
      const page = await ClientEntity.list(cursor, limit);
      return ok(c, page);
    } catch (error) {
      console.error('Client list error:', error);
      return bad(c, error instanceof Error ? error.message : 'Failed to list clients');
    }
  });

  clientApi.post('/', async (c) => {
    try {
      const body = await c.req.json();
      const parsed = clientSchema.safeParse(body);
      if (!parsed.success) return bad(c, parsed.error.toString());

      const client = await ClientEntity.create({
        ...parsed.data,
        lastContacted: new Date().toISOString(),
      });
      return ok(c, client);
    } catch (error) {
      console.error('Client create error:', error);
      return bad(c, error instanceof Error ? error.message : 'Failed to create client');
    }
  });

  clientApi.get('/:id', async (c) => {
    try {
      const { id } = c.req.param();
      const client = await ClientEntity.get(id);
      if (!client) return notFound(c);
      return ok(c, client);
    } catch (error) {
      console.error('Client get error:', error);
      return bad(c, error instanceof Error ? error.message : 'Failed to get client');
    }
  });

  clientApi.put('/:id', async (c) => {
    try {
      const { id } = c.req.param();
      const body = await c.req.json();
      const parsed = clientSchema.partial().safeParse(body);
      if (!parsed.success) return bad(c, parsed.error.toString());

      const client = await ClientEntity.update(id, parsed.data);
      return ok(c, client);
    } catch (error) {
      console.error('Client update error:', error);
      return bad(c, error instanceof Error ? error.message : 'Failed to update client');
    }
  });

  clientApi.delete('/:id', async (c) => {
    try {
      const { id } = c.req.param();
      const deleted = await ClientEntity.delete(id);
      return ok(c, { id, deleted });
    } catch (error) {
      console.error('Client delete error:', error);
      return bad(c, error instanceof Error ? error.message : 'Failed to delete client');
    }
  });

  app.route('/api/clients', clientApi);

  const propertyApi = new Hono();

  propertyApi.get('/', async (c) => {
    try {
      await PropertyEntity.ensureSeed();
      const { cursor, limit } = getPagination(c);
      const page = await PropertyEntity.list(cursor, limit);
      return ok(c, page);
    } catch (error) {
      console.error('Property list error:', error);
      return bad(c, error instanceof Error ? error.message : 'Failed to list properties');
    }
  });

  propertyApi.post('/', async (c) => {
    try {
      const body = await c.req.json();
      const parsed = propertySchema.safeParse(body);
      if (!parsed.success) return bad(c, parsed.error.toString());

      const property = await PropertyEntity.create(parsed.data);
      return ok(c, property);
    } catch (error) {
      console.error('Property create error:', error);
      return bad(c, error instanceof Error ? error.message : 'Failed to create property');
    }
  });

  propertyApi.get('/:id', async (c) => {
    try {
      const { id } = c.req.param();
      const property = await PropertyEntity.get(id);
      if (!property) return notFound(c);
      return ok(c, property);
    } catch (error) {
      console.error('Property get error:', error);
      return bad(c, error instanceof Error ? error.message : 'Failed to get property');
    }
  });

  propertyApi.put('/:id', async (c) => {
    try {
      const { id } = c.req.param();
      const body = await c.req.json();
      const parsed = propertySchema.partial().safeParse(body);
      if (!parsed.success) return bad(c, parsed.error.toString());

      const property = await PropertyEntity.update(id, parsed.data);
      return ok(c, property);
    } catch (error) {
      console.error('Property update error:', error);
      return bad(c, error instanceof Error ? error.message : 'Failed to update property');
    }
  });

  propertyApi.delete('/:id', async (c) => {
    try {
      const { id } = c.req.param();
      const deleted = await PropertyEntity.delete(id);
      return ok(c, { id, deleted });
    } catch (error) {
      console.error('Property delete error:', error);
      return bad(c, error instanceof Error ? error.message : 'Failed to delete property');
    }
  });

  app.route('/api/properties', propertyApi);

  const transactionApi = new Hono();

  transactionApi.get('/', async (c) => {
    try {
      await TransactionEntity.ensureSeed();
      const { cursor, limit } = getPagination(c);
      const page = await TransactionEntity.list(cursor, limit);
      return ok(c, page);
    } catch (error) {
      console.error('Transaction list error:', error);
      return bad(c, error instanceof Error ? error.message : 'Failed to list transactions');
    }
  });

  transactionApi.post('/', async (c) => {
    try {
      const body = await c.req.json();
      const parsed = transactionSchema.safeParse(body);
      if (!parsed.success) return bad(c, parsed.error.toString());

      const transaction = await TransactionEntity.create(parsed.data);
      return ok(c, transaction);
    } catch (error) {
      console.error('Transaction create error:', error);
      return bad(c, error instanceof Error ? error.message : 'Failed to create transaction');
    }
  });

  transactionApi.put('/:id', async (c) => {
    try {
      const { id } = c.req.param();
      const body = await c.req.json();
      const parsed = transactionSchema.partial().safeParse(body);
      if (!parsed.success) return bad(c, parsed.error.toString());

      const transaction = await TransactionEntity.update(id, parsed.data);
      return ok(c, transaction);
    } catch (error) {
      console.error('Transaction update error:', error);
      return bad(c, error instanceof Error ? error.message : 'Failed to update transaction');
    }
  });

  transactionApi.delete('/:id', async (c) => {
    try {
      const { id } = c.req.param();
      const deleted = await TransactionEntity.delete(id);
      return ok(c, { id, deleted });
    } catch (error) {
      console.error('Transaction delete error:', error);
      return bad(c, error instanceof Error ? error.message : 'Failed to delete transaction');
    }
  });

  app.route('/api/transactions', transactionApi);

  const contractApi = new Hono();

  contractApi.get('/', async (c) => {
    try {
      await ContractEntity.ensureSeed();
      const { cursor, limit } = getPagination(c);
      const page = await ContractEntity.list(cursor, limit);
      return ok(c, page);
    } catch (error) {
      console.error('Contract list error:', error);
      return bad(c, error instanceof Error ? error.message : 'Failed to list contracts');
    }
  });

  contractApi.post('/', async (c) => {
    try {
      const body = await c.req.json();
      const parsed = contractSchema.safeParse(body);
      if (!parsed.success) return bad(c, parsed.error.toString());

      const contract = await ContractEntity.create(parsed.data);
      return ok(c, contract);
    } catch (error) {
      console.error('Contract create error:', error);
      return bad(c, error instanceof Error ? error.message : 'Failed to create contract');
    }
  });

  contractApi.put('/:id', async (c) => {
    try {
      const { id } = c.req.param();
      const body = await c.req.json();
      const parsed = contractSchema.partial().safeParse(body);
      if (!parsed.success) return bad(c, parsed.error.toString());

      const contract = await ContractEntity.update(id, parsed.data);
      return ok(c, contract);
    } catch (error) {
      console.error('Contract update error:', error);
      return bad(c, error instanceof Error ? error.message : 'Failed to update contract');
    }
  });

  contractApi.delete('/:id', async (c) => {
    try {
      const { id } = c.req.param();
      const deleted = await ContractEntity.delete(id);
      return ok(c, { id, deleted });
    } catch (error) {
      console.error('Contract delete error:', error);
      return bad(c, error instanceof Error ? error.message : 'Failed to delete contract');
    }
  });

  app.route('/api/contracts', contractApi);
}
