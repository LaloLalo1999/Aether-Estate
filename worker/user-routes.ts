import { Hono } from "hono";
import type { Env } from './core-utils';
import { ClientEntity, PropertyEntity, TransactionEntity, ContractEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
import { z } from 'zod';
const getPagination = (c: any) => {
  const cq = c.req.query('cursor');
  const lq = c.req.query('limit');
  const limit = lq ? Math.max(1, Math.min(100, Number(lq) | 0)) : 20;
  return { cursor: cq ?? null, limit };
};
// Schemas for validation
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
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // --- CLIENTS API ---
  const clientApi = new Hono<{ Bindings: Env }>();
  clientApi.get('/', async (c) => {
    await ClientEntity.ensureSeed(c.env);
    const { cursor, limit } = getPagination(c);
    const page = await ClientEntity.list(c.env, cursor, limit);
    return ok(c, page);
  });
  clientApi.post('/', async (c) => {
    const body = await c.req.json();
    const parsed = clientSchema.safeParse(body);
    if (!parsed.success) return bad(c, parsed.error.toString());
    const client = await ClientEntity.create(c.env, {
      id: crypto.randomUUID(),
      ...parsed.data,
      lastContacted: new Date().toISOString(),
    });
    return ok(c, client);
  });
  clientApi.get('/:id', async (c) => {
    const { id } = c.req.param();
    const client = new ClientEntity(c.env, id);
    if (!(await client.exists())) return notFound(c);
    return ok(c, await client.getState());
  });
  clientApi.put('/:id', async (c) => {
    const { id } = c.req.param();
    const body = await c.req.json();
    const parsed = clientSchema.partial().safeParse(body);
    if (!parsed.success) return bad(c, parsed.error.toString());
    const client = new ClientEntity(c.env, id);
    if (!(await client.exists())) return notFound(c);
    await client.patch(parsed.data);
    return ok(c, await client.getState());
  });
  clientApi.delete('/:id', async (c) => {
    const { id } = c.req.param();
    const deleted = await ClientEntity.delete(c.env, id);
    return ok(c, { id, deleted });
  });
  app.route('/api/clients', clientApi);
  // --- PROPERTIES API ---
  const propertyApi = new Hono<{ Bindings: Env }>();
  propertyApi.get('/', async (c) => {
    await PropertyEntity.ensureSeed(c.env);
    const { cursor, limit } = getPagination(c);
    const page = await PropertyEntity.list(c.env, cursor, limit);
    return ok(c, page);
  });
  propertyApi.post('/', async (c) => {
    const body = await c.req.json();
    const parsed = propertySchema.safeParse(body);
    if (!parsed.success) return bad(c, parsed.error.toString());
    const property = await PropertyEntity.create(c.env, { id: crypto.randomUUID(), ...parsed.data });
    return ok(c, property);
  });
  propertyApi.get('/:id', async (c) => {
    const { id } = c.req.param();
    const property = new PropertyEntity(c.env, id);
    if (!(await property.exists())) return notFound(c);
    return ok(c, await property.getState());
  });
  propertyApi.put('/:id', async (c) => {
    const { id } = c.req.param();
    const body = await c.req.json();
    const parsed = propertySchema.partial().safeParse(body);
    if (!parsed.success) return bad(c, parsed.error.toString());
    const property = new PropertyEntity(c.env, id);
    if (!(await property.exists())) return notFound(c);
    await property.patch(parsed.data);
    return ok(c, await property.getState());
  });
  propertyApi.delete('/:id', async (c) => {
    const { id } = c.req.param();
    const deleted = await PropertyEntity.delete(c.env, id);
    return ok(c, { id, deleted });
  });
  app.route('/api/properties', propertyApi);
  // --- TRANSACTIONS API ---
  const transactionApi = new Hono<{ Bindings: Env }>();
  transactionApi.get('/', async (c) => {
    await TransactionEntity.ensureSeed(c.env);
    const { cursor, limit } = getPagination(c);
    const page = await TransactionEntity.list(c.env, cursor, limit);
    return ok(c, page);
  });
  transactionApi.post('/', async (c) => {
    const body = await c.req.json();
    const parsed = transactionSchema.safeParse(body);
    if (!parsed.success) return bad(c, parsed.error.toString());
    const transaction = await TransactionEntity.create(c.env, { id: crypto.randomUUID(), ...parsed.data });
    return ok(c, transaction);
  });
  transactionApi.put('/:id', async (c) => {
    const { id } = c.req.param();
    const body = await c.req.json();
    const parsed = transactionSchema.partial().safeParse(body);
    if (!parsed.success) return bad(c, parsed.error.toString());
    const transaction = new TransactionEntity(c.env, id);
    if (!(await transaction.exists())) return notFound(c);
    await transaction.patch(parsed.data);
    return ok(c, await transaction.getState());
  });
  transactionApi.delete('/:id', async (c) => {
    const { id } = c.req.param();
    const deleted = await TransactionEntity.delete(c.env, id);
    return ok(c, { id, deleted });
  });
  app.route('/api/transactions', transactionApi);
  // --- CONTRACTS API ---
  const contractApi = new Hono<{ Bindings: Env }>();
  contractApi.get('/', async (c) => {
    await ContractEntity.ensureSeed(c.env);
    const { cursor, limit } = getPagination(c);
    const page = await ContractEntity.list(c.env, cursor, limit);
    return ok(c, page);
  });
  contractApi.post('/', async (c) => {
    const body = await c.req.json();
    const parsed = contractSchema.safeParse(body);
    if (!parsed.success) return bad(c, parsed.error.toString());
    const contract = await ContractEntity.create(c.env, { id: crypto.randomUUID(), ...parsed.data });
    return ok(c, contract);
  });
  contractApi.put('/:id', async (c) => {
    const { id } = c.req.param();
    const body = await c.req.json();
    const parsed = contractSchema.partial().safeParse(body);
    if (!parsed.success) return bad(c, parsed.error.toString());
    const contract = new ContractEntity(c.env, id);
    if (!(await contract.exists())) return notFound(c);
    await contract.patch(parsed.data);
    return ok(c, await contract.getState());
  });
  contractApi.delete('/:id', async (c) => {
    const { id } = c.req.param();
    const deleted = await ContractEntity.delete(c.env, id);
    return ok(c, { id, deleted });
  });
  app.route('/api/contracts', contractApi);
}