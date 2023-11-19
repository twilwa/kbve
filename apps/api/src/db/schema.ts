import { Many, relations } from 'drizzle-orm';
import {
	mysqlTable,
	timestamp,
	varchar,
	serial,
	text,
	int,
	json,
	bigint,
	uniqueIndex
} from 'drizzle-orm/mysql-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const users = mysqlTable('users', {
	id: serial('id').primaryKey().notNull(),
	username: varchar('username', { length: 256 }).unique().notNull(),
	role: int('role').default(0).notNull(),
	reputation: int('reputation').default(0).notNull(),
	exp: int('exp').default(0).notNull(),
	created_at: timestamp('created_at', { mode: 'string', })
		.notNull()
		.defaultNow(),
}, (table) => {
	return {
	  username_idx: uniqueIndex("username_idx").on(table.username),
	};
  });

export const auth = mysqlTable('auth', {
	id: serial('id').primaryKey().notNull(),
	uuid:  bigint('uuid', { mode: 'number',  unsigned: true}).notNull(),
	email: varchar('email', { length: 256 }).unique().notNull(),
	hash: varchar('hash', { length: 256 }).notNull(),
	salt: varchar('salt', { length: 256 }).notNull(),
	password_reset_token: varchar('password_reset_token', { length: 256 }).notNull(),
	password_reset_expiry: timestamp('password_reset_expiry').notNull(),
	verification_token: varchar('verification_token', { length: 256 }).notNull(),
	verification_expiry: timestamp('verification_expiry').notNull(),
	status: int('status').default(0).notNull(),
	last_login_at: timestamp('last_login_at').notNull(),
	failed_login_attempts: int('failed_login_attempts').default(0).notNull(),
	lockout_until: timestamp('lockout_until').notNull(),
	two_factor_secret: varchar('two_factor_secret', { length: 256 }).notNull(),
	recovery_codes: text('recovery_codes').notNull(),
}, (table) => {
	return {
	  uuid_idx: uniqueIndex("uuid_idx").on(table.uuid),
	  email_idx: uniqueIndex("email_idx").on(table.email)
	};
  });

export const profile = mysqlTable('profile', {
	id: serial('id').primaryKey().notNull(),
	name: varchar('name', { length: 256 }).default('Anon').notNull(),
	bio: varchar('bio', { length: 64 }).default('').notNull(),
	unsplash: varchar('unsplash', { length: 64 }).default('').notNull(),
	github: varchar('github', { length: 64 }).default('').notNull(),
	instagram: varchar('instagram', { length: 64 }).default('').notNull(),
	discord: varchar('discord', { length: 64 }).default('').notNull(),
	uuid:  bigint('uuid', { mode: 'number', unsigned: true}).notNull(),
}, (table) => {
	return {
	  uuid_idx: uniqueIndex("uuid_idx").on(table.uuid)
	};
  });

export const appwrite = mysqlTable('appwrite', {
	id: serial('id').primaryKey().notNull(),
	uuid:  bigint('uuid', { mode: 'number', unsigned: true}).notNull(),
	appwrite_endpoint: varchar('appwrite_endpoint', { length: 256 }).notNull(),
	appwrite_projectid: varchar('appwrite_projectid', { length: 256 }).notNull(),
	appwrite_api_key: varchar('apppwrite_api_key', { length: 256 }).notNull(),
	version: varchar('version', { length: 64 }).notNull(),
	created_at: timestamp('created_at', { mode: 'string' })
		.notNull()
		.defaultNow(),
}, (table) => {
	return {
	  uuid_idx: uniqueIndex("uuid_idx").on(table.uuid),
	  appwrite_api_key_idx: uniqueIndex("appwrite_api_key_idx").on(table.appwrite_api_key)
	};
  });

export const apikey = mysqlTable('apikey', {
	id: serial('id').primaryKey().notNull(),
	uuid:  bigint('uuid', { mode: 'number', unsigned: true}).notNull(),
	permissions: varchar('permissions', { length: 256}).notNull(),
	keyhash: varchar('keyhash', { length: 256 }).notNull(),
	label: varchar('label', { length: 256 }).notNull(),
}, (table) => {
	return {
	  uuid_idx: uniqueIndex("uuid_idx").on(table.uuid),
	  keyhash_idx: uniqueIndex("keyhash_idx").on(table.keyhash)
	};
  });

export const n8n = mysqlTable('n8n', {
    id: serial('id').primaryKey().notNull(),
	uuid:  bigint('uuid', { mode: 'number', unsigned: true}).notNull(),
    webhook: varchar('webhook', { length: 256}).notNull(),
    permissions: varchar('permissions', { length: 256}).notNull(),
	keyhash: varchar('keyhash', { length: 256 }).notNull(),
	label: varchar('label', { length: 256 }).notNull(),

}, (table) => {
	return {
	  uuid_idx: uniqueIndex("uuid_idx").on(table.uuid)
	};
  });

/**
 * TODO: Player Saving / Loading via API.
 * TODO: Auth -> JWT.
 * TODO: Inventory Manager + Shop Integration.
 * TODO: Guild Manager.
 */



export const usersProfileRelations = relations(users, ({ one }) => ({
	profile: one(profile, {
		fields: [users.id],
		references: [profile.uuid],
	}),
}));

export const usersAuthRelations = relations(users, ({ one }) => ({
	auth: one(auth, {
		fields: [users.id],
		references: [auth.uuid],
	}),
}));

export const usersAPIKeyRelations = relations(users, ({ many }) => ({
	apikey: many(apikey),
}));

export const usersAppwriteRelations = relations(users, ({ many }) => ({
    appwrite: many(appwrite),
}))

export const usersN8NRelations = relations(users, ({many}) => ({
    n8n: many(n8n),
}))

export const n8nUsersRelations = relations(n8n, ({ one}) => ({
    user: one(users, {
        fields: [n8n.uuid],
        references: [users.id],
    }),
}))

export const appwriteRelations = relations(appwrite, ({ one }) => ({
	user: one(users, {
		fields: [appwrite.uuid],
		references: [users.id],
	}),
}));

export const apikeyUsersRelations = relations(apikey, ({ one }) => ({
	user: one(users, {
		fields: [apikey.uuid],
		references: [users.id],
	}),
}));

//TODO      ZOD

export const insertUserSchema = createInsertSchema(users);

// Schema for selecting a user - can be used to validate API responses

export const selectUserSchema = createSelectSchema(users);
