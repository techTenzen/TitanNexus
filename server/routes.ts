import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { users } from "@shared/schema";
import { setupAuth } from "./auth";
import { z } from "zod";
import { insertDiscussionSchema, insertProjectSchema, insertCommentSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Add a test route for debugging database connection
  app.get("/api/test-db", async (req, res) => {
    try {
      // Try to get a single user
      const testUsers = await db.select().from(users).limit(1);
      res.json({
        success: true,
        message: "Database connection successful",
        data: testUsers.length > 0 ? { count: testUsers.length } : { count: 0 }
      });
    } catch (error) {
      console.error("Database test error:", error);
      res.status(500).json({
        success: false,
        message: "Database connection failed",
        error: error.message
      });
    }
  });

  // User routes
  app.get("/api/user/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Don't send password to client
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user", error: error.message });
    }
  });

  // Return all users for community section
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      // Remove passwords from the response
      const usersWithoutPasswords = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      res.json(usersWithoutPasswords);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users", error: error.message });
    }
  });

  // Stats routes
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats", error: error.message });
    }
  });

  // Projects routes
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects", error: error.message });
    }
  });

  app.get("/api/projects/top", async (req, res) => {
    try {
      const limit = Number(req.query.limit || 3);
      const projects = await storage.getTopProjects(limit);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching top projects:", error);
      res.status(500).json({ message: "Failed to fetch top projects", error: error.message });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const project = await storage.getProject(id);

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Failed to fetch project", error: error.message });
    }
  });

  app.post("/api/projects", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const validatedData = insertProjectSchema.parse({
        ...req.body,
        userId: req.user.id
      });

      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Failed to create project", error: error.message });
    }
  });

  // Update upvote endpoints to work without authentication for now
  app.post("/api/projects/:id/upvote", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const project = await storage.upvoteProject(id);
      res.json(project);
    } catch (error) {
      console.error("Error upvoting project:", error);
      res.status(500).json({ message: "Failed to upvote project", error: error.message });
    }
  });

  // Discussions routes
  app.get("/api/discussions", async (req, res) => {
    try {
      const discussions = await storage.getAllDiscussions();
      res.json(discussions);
    } catch (error) {
      console.error("Error fetching discussions:", error);
      res.status(500).json({ message: "Failed to fetch discussions", error: error.message });
    }
  });

  app.get("/api/discussions/top", async (req, res) => {
    try {
      const limit = Number(req.query.limit || 3);
      const discussions = await storage.getTopDiscussions(limit);
      res.json(discussions);
    } catch (error) {
      console.error("Error fetching top discussions:", error);
      res.status(500).json({ message: "Failed to fetch top discussions", error: error.message });
    }
  });

  app.get("/api/discussions/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const discussion = await storage.getDiscussion(id);

      if (!discussion) {
        return res.status(404).json({ message: "Discussion not found" });
      }

      res.json(discussion);
    } catch (error) {
      console.error("Error fetching discussion:", error);
      res.status(500).json({ message: "Failed to fetch discussion", error: error.message });
    }
  });

  app.post("/api/discussions", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const validatedData = insertDiscussionSchema.parse({
        ...req.body,
        userId: req.user.id
      });

      const discussion = await storage.createDiscussion(validatedData);
      res.status(201).json(discussion);
    } catch (error) {
      console.error("Error creating discussion:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Failed to create discussion", error: error.message });
    }
  });

  // Update upvote endpoints to work without authentication for now
  app.post("/api/discussions/:id/upvote", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const discussion = await storage.upvoteDiscussion(id);
      res.json(discussion);
    } catch (error) {
      console.error("Error upvoting discussion:", error);
      res.status(500).json({ message: "Failed to upvote discussion", error: error.message });
    }
  });

  // Comments routes
  app.get("/api/discussions/:id/comments", async (req, res) => {
    try {
      const discussionId = Number(req.params.id);
      const comments = await storage.getCommentsByDiscussion(discussionId);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments", error: error.message });
    }
  });

  app.post("/api/discussions/:id/comments", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const discussionId = Number(req.params.id);

      const validatedData = insertCommentSchema.parse({
        ...req.body,
        userId: req.user.id,
        discussionId
      });

      const comment = await storage.createComment(validatedData);
      res.status(201).json(comment);
    } catch (error) {
      console.error("Error creating comment:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Failed to create comment", error: error.message });
    }
  });

  // Update discussion status (admin only)
  app.patch("/api/discussions/:id/status", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Admin privileges required" });
    }

    try {
      const id = Number(req.params.id);
      const { status } = req.body;

      // Validate status
      if (!status || !['active', 'done', 'rejected'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const updatedDiscussion = await storage.updateDiscussionStatus(id, status);
      res.json(updatedDiscussion);
    } catch (error) {
      console.error("Error updating discussion status:", error);
      res.status(500).json({ message: "Failed to update discussion status", error: error.message });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}