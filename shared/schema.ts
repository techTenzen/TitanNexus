import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  techStack: text("tech_stack").array(),
  coverImageUrl: text("cover_image_url"),
  upvotes: integer("upvotes").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const discussions = pgTable("discussions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  tag: text("tag").notNull(),
  imageUrl: text("image_url"),
  upvotes: integer("upvotes").default(0),
  commentCount: integer("comment_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  discussionId: integer("discussion_id").notNull(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

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
