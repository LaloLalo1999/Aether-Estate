import { IndexedEntity } from "./core-utils";
import type { Client, Property, Transaction, Contract } from "@shared/types";
import { MOCK_CLIENTS, MOCK_PROPERTIES, MOCK_TRANSACTIONS, MOCK_CONTRACTS } from "@shared/mock-data";
// CLIENT ENTITY
export class ClientEntity extends IndexedEntity<Client> {
  static readonly entityName = "client";
  static readonly indexName = "clients";
  static readonly initialState: Client = { id: "", name: "", email: "", phone: "", status: "Lead", lastContacted: "" };
  static seedData = MOCK_CLIENTS;
}
// PROPERTY ENTITY
export class PropertyEntity extends IndexedEntity<Property> {
  static readonly entityName = "property";
  static readonly indexName = "properties";
  static readonly initialState: Property = { id: "", name: "", address: "", price: 0, status: "For Sale", imageUrl: "", bedrooms: 0, bathrooms: 0, sqft: 0 };
  static seedData = MOCK_PROPERTIES;
}
// TRANSACTION ENTITY
export class TransactionEntity extends IndexedEntity<Transaction> {
  static readonly entityName = "transaction";
  static readonly indexName = "transactions";
  static readonly initialState: Transaction = { id: "", date: "", description: "", category: "Other", amount: 0, type: "Expense" };
  static seedData = MOCK_TRANSACTIONS;
}
// CONTRACT ENTITY
export class ContractEntity extends IndexedEntity<Contract> {
  static readonly entityName = "contract";
  static readonly indexName = "contracts";
  static readonly initialState: Contract = { id: "", propertyId: "", clientId: "", status: "Draft", expiryDate: "", amount: 0 };
  static seedData = MOCK_CONTRACTS;
}