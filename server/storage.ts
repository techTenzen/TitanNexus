import {
  users, type User, type InsertUser,
  projects, type Project, type InsertProject,
  discussions, type Discussion, type InsertDiscussion,
  comments, type Comment, type InsertComment,
  stats, type Stats
} from "@shared/schema";
import session from "express-session";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import createMemoryStore from "memorystore";
import { hashPassword } from "./password-utils";
import 'dotenv/config'; // Add import for dotenv
import type { User, UpdateProfile } from "@shared/schema";

const MemoryStore = createMemoryStore(session);

// Storage interface
export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;

  // Projects
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  getAllProjects(): Promise<Project[]>;
  getTopProjects(limit: number): Promise<Project[]>;
  upvoteProject(id: number): Promise<Project>;

  // Discussions
  getDiscussion(id: number): Promise<Discussion | undefined>;
  createDiscussion(discussion: InsertDiscussion): Promise<Discussion>;
  getAllDiscussions(): Promise<Discussion[]>;
  getTopDiscussions(limit: number): Promise<Discussion[]>;
  upvoteDiscussion(id: number): Promise<Discussion>;
  updateDiscussionStatus(id: number, status: string): Promise<Discussion>;

  // Comments
  createComment(comment: InsertComment): Promise<Comment>;
  getCommentsByDiscussion(discussionId: number): Promise<Comment[]>;

  // Stats
  getStats(): Promise<Stats>;
  incrementStat(field: keyof Omit<Stats, 'id'>): Promise<Stats>;

  // Session store
  sessionStore: any; // Using any to fix type issues with session store
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private discussions: Map<number, Discussion>;
  private comments: Map<number, Comment>;
  private stats: Stats;
  public sessionStore: any; // Using any to fix type issues with session store

  private userId: number;
  private projectId: number;
  private discussionId: number;
  private commentId: number;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.discussions = new Map();
    this.comments = new Map();

    this.userId = 1;
    this.projectId = 1;
    this.discussionId = 1;
    this.commentId = 1;

    this.stats = {
      id: 1,
      activeUsers: 0,
      projectsCreated: 0,
      communityPosts: 0,
      githubStars: 7823
    };

    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  }

  // Keep all the MemStorage methods as they are
  // ...

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
        (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
        (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const now = new Date();
    const user: User = {
      ...insertUser,
      id,
      createdAt: now,
      profession: insertUser.profession || null,
      bio: insertUser.bio || null,
      avatarUrl: insertUser.avatarUrl || null,
      isAdmin: insertUser.isAdmin || false
    };
    this.users.set(id, user);

    // Increment active users count
    this.stats.activeUsers += 1;

    return user;
  }
// Add this method to your DatabaseStorage class in storage.ts
  async updateUser(id: number, userData: Partial<UpdateProfile>): Promise<User | undefined> {
    try {
      const [updatedUser] = await db
          .update(users)
          .set(userData)
          .where(eq(users.id, id))
          .returning();

      return updatedUser;
    } catch (error) {
      console.error("Database error updating user:", error);
      throw error;
    }
  }
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Projects
  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.projectId++;
    const now = new Date();
    const project: Project = {
      ...insertProject,
      id,
      upvotes: 0,
      createdAt: now,
      techStack: insertProject.techStack || null,
      coverImageUrl: insertProject.coverImageUrl || null
    };
    this.projects.set(id, project);

    // Increment project count
    this.stats.projectsCreated += 1;

    return project;
  }

  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getTopProjects(limit: number): Promise<Project[]> {
    return Array.from(this.projects.values())
        .sort((a, b) => b.upvotes - a.upvotes)
        .slice(0, limit);
  }

  async upvoteProject(id: number): Promise<Project> {
    const project = this.projects.get(id);
    if (!project) {
      throw new Error("Project not found");
    }

    project.upvotes += 1;
    this.projects.set(id, project);
    return project;
  }

  // Discussions
  async getDiscussion(id: number): Promise<Discussion | undefined> {
    return this.discussions.get(id);
  }

  async createDiscussion(insertDiscussion: InsertDiscussion): Promise<Discussion> {
    const id = this.discussionId++;
    const now = new Date();
    const discussion: Discussion = {
      ...insertDiscussion,
      id,
      upvotes: 0,
      commentCount: 0,
      createdAt: now,
      imageUrl: insertDiscussion.imageUrl || null,
      status: insertDiscussion.status || 'active'
    };
    this.discussions.set(id, discussion);

    // Increment post count
    this.stats.communityPosts += 1;

    return discussion;
  }

  async getAllDiscussions(): Promise<Discussion[]> {
    return Array.from(this.discussions.values());
  }

  async getTopDiscussions(limit: number): Promise<Discussion[]> {
    return Array.from(this.discussions.values())
        .sort((a, b) => b.upvotes - a.upvotes)
        .slice(0, limit);
  }

  async upvoteDiscussion(id: number): Promise<Discussion> {
    const discussion = this.discussions.get(id);
    if (!discussion) {
      throw new Error("Discussion not found");
    }

    discussion.upvotes += 1;
    this.discussions.set(id, discussion);
    return discussion;
  }

  async updateDiscussionStatus(id: number, status: string): Promise<Discussion> {
    const discussion = this.discussions.get(id);
    if (!discussion) {
      throw new Error("Discussion not found");
    }

    discussion.status = status;
    this.discussions.set(id, discussion);
    return discussion;
  }

  // Comments
  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = this.commentId++;
    const now = new Date();
    const comment: Comment = {
      ...insertComment,
      id,
      createdAt: now
    };
    this.comments.set(id, comment);

    // Increment comment count on the discussion
    const discussion = this.discussions.get(insertComment.discussionId);
    if (discussion) {
      discussion.commentCount += 1;
      this.discussions.set(discussion.id, discussion);
    }

    return comment;
  }

  async getCommentsByDiscussion(discussionId: number): Promise<Comment[]> {
    return Array.from(this.comments.values())
        .filter(comment => comment.discussionId === discussionId);
  }

  // Stats
  async getStats(): Promise<Stats> {
    return this.stats;
  }

  async incrementStat(field: keyof Omit<Stats, 'id'>): Promise<Stats> {
    this.stats[field] += 1;
    return this.stats;
  }
}

export class DatabaseStorage implements IStorage {
  public sessionStore: any; // Using any to fix type issues with session store

  constructor() {
    // Use memory store instead of PostgreSQL store for sessions
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      console.error("Error getting user:", error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.username, username));
      return user;
    } catch (error) {
      console.error("Error getting user by username:", error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.email, email));
      return user;
    } catch (error) {
      console.error("Error getting user by email:", error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const [user] = await db.insert(users).values(insertUser).returning();

      // Increment active users count
      await this.incrementStat('activeUsers');

      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      return await db.select().from(users);
    } catch (error) {
      console.error("Error getting all users:", error);
      return [];
    }
  }

  // Projects
  async getProject(id: number): Promise<Project | undefined> {
    try {
      const [project] = await db.select().from(projects).where(eq(projects.id, id));
      return project;
    } catch (error) {
      console.error("Error getting project:", error);
      return undefined;
    }
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    try {
      const [project] = await db.insert(projects).values(insertProject).returning();

      // Increment project count
      await this.incrementStat('projectsCreated');

      return project;
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  }

  async getAllProjects(): Promise<Project[]> {
    try {
      return await db.select().from(projects);
    } catch (error) {
      console.error("Error getting all projects:", error);
      return [];
    }
  }

  async getTopProjects(limit: number): Promise<Project[]> {
    try {
      return await db.select().from(projects).orderBy(desc(projects.upvotes)).limit(limit);
    } catch (error) {
      console.error("Error getting top projects:", error);
      return [];
    }
  }

  async upvoteProject(id: number): Promise<Project> {
    try {
      const [project] = await db.select().from(projects).where(eq(projects.id, id));

      if (!project) {
        throw new Error("Project not found");
      }

      const currentUpvotes = project.upvotes ?? 0;

      const [updatedProject] = await db
          .update(projects)
          .set({ upvotes: currentUpvotes + 1 })
          .where(eq(projects.id, id))
          .returning();

      return updatedProject;
    } catch (error) {
      console.error("Error upvoting project:", error);
      throw error;
    }
  }

  // Add these methods to your DatabaseStorage class in storage.ts

// Discussions
  async getDiscussion(id: number): Promise<Discussion | undefined> {
    try {
      const [discussion] = await db.select().from(discussions).where(eq(discussions.id, id));
      return discussion;
    } catch (error) {
      console.error("Error getting discussion:", error);
      return undefined;
    }
  }

  async createDiscussion(insertDiscussion: InsertDiscussion): Promise<Discussion> {
    try {
      const [discussion] = await db.insert(discussions).values(insertDiscussion).returning();

      // Increment post count
      await this.incrementStat('communityPosts');

      return discussion;
    } catch (error) {
      console.error("Error creating discussion:", error);
      throw error;
    }
  }

  async getAllDiscussions(): Promise<Discussion[]> {
    try {
      return await db.select().from(discussions);
    } catch (error) {
      console.error("Error getting all discussions:", error);
      return [];
    }
  }

  async getTopDiscussions(limit: number): Promise<Discussion[]> {
    try {
      return await db.select().from(discussions).orderBy(desc(discussions.upvotes)).limit(limit);
    } catch (error) {
      console.error("Error getting top discussions:", error);
      return [];
    }
  }

  async upvoteDiscussion(id: number): Promise<Discussion> {
    try {
      const [discussion] = await db.select().from(discussions).where(eq(discussions.id, id));

      if (!discussion) {
        throw new Error("Discussion not found");
      }

      const currentUpvotes = discussion.upvotes ?? 0;

      const [updatedDiscussion] = await db
          .update(discussions)
          .set({ upvotes: currentUpvotes + 1 })
          .where(eq(discussions.id, id))
          .returning();

      return updatedDiscussion;
    } catch (error) {
      console.error("Error upvoting discussion:", error);
      throw error;
    }
  }

  async updateDiscussionStatus(id: number, status: string): Promise<Discussion> {
    try {
      const [discussion] = await db.select().from(discussions).where(eq(discussions.id, id));

      if (!discussion) {
        throw new Error("Discussion not found");
      }

      const [updatedDiscussion] = await db
          .update(discussions)
          .set({ status })
          .where(eq(discussions.id, id))
          .returning();

      return updatedDiscussion;
    } catch (error) {
      console.error("Error updating discussion status:", error);
      throw error;
    }
  }

// Comments
  async createComment(insertComment: InsertComment): Promise<Comment> {
    try {
      const [comment] = await db.insert(comments).values(insertComment).returning();

      // Increment comment count on the discussion
      const [discussion] = await db.select().from(discussions).where(eq(discussions.id, insertComment.discussionId));

      if (discussion) {
        const currentCommentCount = discussion.commentCount ?? 0;

        await db
            .update(discussions)
            .set({ commentCount: currentCommentCount + 1 })
            .where(eq(discussions.id, insertComment.discussionId));
      }

      return comment;
    } catch (error) {
      console.error("Error creating comment:", error);
      throw error;
    }
  }

  async getCommentsByDiscussion(discussionId: number): Promise<Comment[]> {
    try {
      return await db.select().from(comments).where(eq(comments.discussionId, discussionId));
    } catch (error) {
      console.error("Error getting comments by discussion:", error);
      return [];
    }
  }

  // Stats
  async getStats(): Promise<Stats> {
    try {
      const [statsRecord] = await db.select().from(stats);

      if (statsRecord) {
        return statsRecord;
      }

      // If no stats record exists, create one
      const [newStats] = await db.insert(stats).values({
        activeUsers: 0,
        projectsCreated: 0,
        communityPosts: 0,
        githubStars: 7823
      }).returning();

      return newStats;
    } catch (error) {
      console.error("Error getting stats:", error);

      // Return default stats if there's an error
      return {
        id: 1,
        activeUsers: 0,
        projectsCreated: 0,
        communityPosts: 0,
        githubStars: 7823
      };
    }
  }

  async incrementStat(field: keyof Omit<Stats, 'id'>): Promise<Stats> {
    try {
      // Get current stats
      const currentStats = await this.getStats();

      // Update the specific field
      const updates: any = {};
      updates[field] = (currentStats[field] ?? 0) + 1;

      // Update stats record
      const [updatedStats] = await db
          .update(stats)
          .set(updates)
          .where(eq(stats.id, currentStats.id))
          .returning();

      return updatedStats;
    } catch (error) {
      console.error(`Error incrementing stat ${field}:`, error);

      // Return current stats if there's an error
      return await this.getStats();
    }
  }
}

// Use the DatabaseStorage implementation
export const storage = new DatabaseStorage();

// Create admin user if it doesn't exist
setTimeout(async () => {
  try {
    // Check if admin user exists
    const admin = await storage.getUserByUsername('admin21');

    if (!admin) {
      console.log('Admin user does not exist, creating it...');

      // Create admin user with predefined credentials
      const hashedPassword = await hashPassword('admin123');

      await storage.createUser({
        username: 'admin21',
        email: 'admin@titanai.com',
        password: hashedPassword,
        profession: 'Platform Administrator',
        isAdmin: true,
        bio: 'System administrator',
        avatarUrl: null
      });

      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}, 5000); // Increased timeout to 5 seconds to give more time for DB connection