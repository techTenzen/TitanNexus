import { 
  users, type User, type InsertUser,
  projects, type Project, type InsertProject,
  discussions, type Discussion, type InsertDiscussion,
  comments, type Comment, type InsertComment,
  stats, type Stats
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

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
  
  // Comments
  createComment(comment: InsertComment): Promise<Comment>;
  getCommentsByDiscussion(discussionId: number): Promise<Comment[]>;
  
  // Stats
  getStats(): Promise<Stats>;
  incrementStat(field: keyof Omit<Stats, 'id'>): Promise<Stats>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private discussions: Map<number, Discussion>;
  private comments: Map<number, Comment>;
  private stats: Stats;
  public sessionStore: session.SessionStore;
  
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
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    
    // Increment active users count
    this.stats.activeUsers += 1;
    
    return user;
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
      createdAt: now 
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
      createdAt: now 
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

export const storage = new MemStorage();
