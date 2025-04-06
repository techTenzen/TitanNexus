import { pgTable, text, serial, integer, boolean, timestamp, foreignKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull(), // Removed unique constraint to allow multiple accounts with same email
  password: text("password").notNull(),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Projects table
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  techStack: text("tech_stack").array(),
  coverImageUrl: text("cover_image_url"),
  upvotes: integer("upvotes").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Discussions table
export const discussions = pgTable("discussions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  tag: text("tag").notNull(),
  imageUrl: text("image_url"),
  upvotes: integer("upvotes").default(0),
  commentCount: integer("comment_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Comments table
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  discussionId: integer("discussion_id").notNull().references(() => discussions.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  discussions: many(discussions),
  comments: many(comments),
}));

export const projectsRelations = relations(projects, ({ one }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
}));

export const discussionsRelations = relations(discussions, ({ one, many }) => ({
  user: one(users, {
    fields: [discussions.userId],
    references: [users.id],
  }),
  comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  discussion: one(discussions, {
    fields: [comments.discussionId],
    references: [discussions.id],
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
}));

// Stats table
export const stats = pgTable("stats", {
  id: serial("id").primaryKey(),
  activeUsers: integer("active_users").default(0),
  projectsCreated: integer("projects_created").default(0),
  communityPosts: integer("community_posts").default(0),
  githubStars: integer("github_stars").default(0),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  bio: true,
  avatarUrl: true,
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  userId: true,
  title: true,
  description: true,
  techStack: true,
  coverImageUrl: true,
});

export const insertDiscussionSchema = createInsertSchema(discussions).pick({
  userId: true,
  title: true,
  description: true,
  tag: true,
  imageUrl: true,
});

export const insertCommentSchema = createInsertSchema(comments).pick({
  discussionId: true,
  userId: true,
  content: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type Discussion = typeof discussions.$inferSelect;
export type InsertDiscussion = z.infer<typeof insertDiscussionSchema>;

export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;

export type Stats = typeof stats.$inferSelect;
