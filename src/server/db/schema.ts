// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  bigint,
  index,
  integer,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => name);

export const tasks = createTable(
  "tasks",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    totalHours: bigint("total_hours", {mode: 'number'}).notNull().default(0),
    description: varchar("description", {length: 256}).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  })
);


export const logs = createTable(
  "logs",
  {
    id: serial("id").primaryKey(),
    taskID: integer("task_id").references(() => tasks.id).notNull(),

    startTime: timestamp("start_time")
      .notNull().default(sql`CURRENT_TIMESTAMP`),
    endTime: timestamp("end_time"),
  },
)

export type DbSelectTasks = typeof tasks.$inferSelect;


export type DbLogs = typeof logs.$inferSelect;