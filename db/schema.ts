// Intentionally empty by default.
// Add Drizzle tables here when the site actually needs a database.
// See examples/d1/db/schema.ts for an opt-in example.
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
export const trees = sqliteTable("trees", { id: text("id").primaryKey(), owner: text("owner").notNull(), title: text("title").notNull(), intro: text("intro").notNull(), questions: text("questions").notNull(), created: integer("created").notNull() });
export const attempts = sqliteTable("attempts", { id: text("id").primaryKey(), treeId: text("tree_id").notNull().references(()=>trees.id), name: text("name").notNull(), score: integer("score").notNull(), total: integer("total").notNull(), created: integer("created").notNull() });
