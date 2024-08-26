import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from "@vercel/postgres";
import {
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

// Use this object to send drizzle queries to your DB
export const db = drizzle(sql);

// Create a pgTable for users
export const UsersTable = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    password: text('password').notNull(), // In production, ensure this is properly hashed
    createdAt: timestamp('createdAt').defaultNow().notNull(),
  },
  (users) => {
    return {
      uniqueIdx: uniqueIndex('unique_idx_users').on(users.email),
    };
  }
);

// Create a pgTable for merchants
export const MerchantsTable = pgTable(
  'merchants',
  {
    id: serial('id').primaryKey(),
    businessName: text('businessName').notNull(),
    email: text('email').notNull(),
    password: text('password').notNull(), // In production, ensure this is properly hashed
    contactName: text('contactName').notNull(),
    businessType: text('businessType').notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
  },
  (merchants) => {
    return {
      uniqueIdx: uniqueIndex('unique_idx_merchants').on(merchants.email),
    };
  }
);

// Helper functions to interact with the database
export const getUserByEmail = async (email) => {
  const [user] = await db.select().from(UsersTable).where(sql`${UsersTable.email} = ${email}`);
  return user;
};

export const getMerchantByEmail = async (email) => {
  const [merchant] = await db.select().from(MerchantsTable).where(sql`${MerchantsTable.email} = ${email}`);
  return merchant;
};

export const createUser = async (userData) => {
  const [newUser] = await db.insert(UsersTable).values(userData).returning();
  return newUser;
};

export const createMerchant = async (merchantData) => {
  const [newMerchant] = await db.insert(MerchantsTable).values(merchantData).returning();
  return newMerchant;
};