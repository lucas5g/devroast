import { sql } from "drizzle-orm";
import {
	boolean,
	decimal,
	index,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

export const roastModeEnum = pgEnum("roast_mode_enum", ["normal", "spicy"]);

export const users = pgTable("users", {
	id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
	username: varchar("username", { length: 50 }).notNull().unique(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	passwordHash: varchar("password_hash", { length: 255 }).notNull(),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

export const codeSubmissions = pgTable("code_submissions", {
	id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
	userId: uuid("user_id")
		.references(() => users.id, { onDelete: "cascade" }),
	code: text("code").notNull(),
	language: varchar("language", { length: 20 }).notNull(),
	isAnonymous: boolean("is_anonymous").default(true),
	createdAt: timestamp("created_at").defaultNow(),
});

export const roasts = pgTable(
	"roasts",
	{
		id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
		submissionId: uuid("submission_id")
			.references(() => codeSubmissions.id, { onDelete: "cascade" })
			.notNull(),
		code: text("code").notNull(),
		language: varchar("language", { length: 20 }).notNull(),
		roastMode: roastModeEnum("roast_mode").default("normal"),
		score: decimal("score", { precision: 3, scale: 1 }).notNull(),
		verdict: varchar("verdict", { length: 50 }).notNull(),
		roastText: text("roast_text").notNull(),
		createdAt: timestamp("created_at").defaultNow(),
	},
	(table) => ({
		scoreIdx: index("roasts_score_idx").on(table.score),
	}),
);

export const roastIssues = pgTable("roast_issues", {
	id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
	roastId: uuid("roast_id")
		.references(() => roasts.id, { onDelete: "cascade" })
		.notNull(),
	type: varchar("type", { length: 20 }).notNull(),
	title: text("title").notNull(),
	description: text("description").notNull(),
});

export const roastFixes = pgTable("roast_fixes", {
	id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
	roastId: uuid("roast_id")
		.references(() => roasts.id, { onDelete: "cascade" })
		.notNull(),
	diff: text("diff").notNull(),
});

export const leaderboardEntries = pgTable(
	"leaderboard_entries",
	{
		id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
		submissionId: uuid("submission_id")
			.references(() => codeSubmissions.id, { onDelete: "cascade" })
			.notNull(),
		rank: integer("rank").notNull(),
		score: decimal("score", { precision: 3, scale: 1 }).notNull(),
		language: varchar("language", { length: 20 }).notNull(),
		codePreview: varchar("code_preview", { length: 100 }).notNull(),
		createdAt: timestamp("created_at").defaultNow(),
	},
	(table) => ({
		scoreIdx: index("leaderboard_score_idx").on(table.score),
	}),
);
