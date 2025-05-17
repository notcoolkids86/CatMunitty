import { 
  users, type User, type InsertUser,
  campaigns, type Campaign, type InsertCampaign,
  donations, type Donation, type InsertDonation,
  volunteers, type Volunteer, type InsertVolunteer,
  successStories, type SuccessStory, type InsertSuccessStory,
  transactions, type Transaction, type InsertTransaction
} from "@shared/schema";
import { db, pool } from "./db";
import { eq, desc, and, like, gte, lte, sql } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  sessionStore: session.SessionStore;
  
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User>;
  
  // Campaign methods
  getCampaign(id: number): Promise<Campaign | undefined>;
  getCampaigns(params?: { 
    category?: string, 
    featured?: boolean,
    search?: string,
    page?: number,
    limit?: number
  }): Promise<{ campaigns: Campaign[], total: number }>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: number, campaign: Partial<Campaign>): Promise<Campaign>;
  updateCampaignAmount(id: number, amount: number): Promise<Campaign>;
  
  // Donation methods
  getDonation(id: number): Promise<Donation | undefined>;
  getDonationsByUser(userId: number): Promise<Donation[]>;
  getDonationsByCampaign(campaignId: number): Promise<Donation[]>;
  createDonation(donation: InsertDonation): Promise<Donation>;
  updateDonationStatus(id: number, status: string): Promise<Donation>;
  
  // Volunteer methods
  getVolunteer(id: number): Promise<Volunteer | undefined>;
  getVolunteers(): Promise<Volunteer[]>;
  createVolunteer(volunteer: InsertVolunteer): Promise<Volunteer>;
  
  // Success Story methods
  getSuccessStory(id: number): Promise<SuccessStory | undefined>;
  getSuccessStories(): Promise<SuccessStory[]>;
  createSuccessStory(story: InsertSuccessStory): Promise<SuccessStory>;
  
  // Transaction methods
  getTransaction(id: number): Promise<Transaction | undefined>;
  getTransactions(): Promise<Transaction[]>;
  getTransactionsByCampaign(campaignId: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  // Campaign methods
  async getCampaign(id: number): Promise<Campaign | undefined> {
    const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, id));
    return campaign || undefined;
  }

  async getCampaigns(params?: { 
    category?: string, 
    featured?: boolean,
    search?: string,
    page?: number,
    limit?: number
  }): Promise<{ campaigns: Campaign[], total: number }> {
    let query = db.select().from(campaigns);
    
    // Apply filters
    if (params?.category) {
      query = query.where(eq(campaigns.category, params.category));
    }
    
    if (params?.featured !== undefined) {
      query = query.where(eq(campaigns.featured, params.featured));
    }
    
    if (params?.search) {
      query = query.where(like(campaigns.title, `%${params.search}%`));
    }
    
    // Get total count for pagination
    // Gunakan query count yang kompatibel dengan drizzle
    const countResult = await db.select({ count: sql`count(*)` }).from(campaigns);
    const total = Number(countResult[0]?.count || 0);
    
    // Apply pagination
    if (params?.page !== undefined && params?.limit !== undefined) {
      const offset = (params.page - 1) * params.limit;
      query = query.limit(params.limit).offset(offset);
    }
    
    // Order by newest first
    query = query.orderBy(desc(campaigns.id)); // Gunakan id sebagai pengganti createdAt karena auto-increment
    
    const result = await query;
    return { campaigns: result, total };
  }

  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const [newCampaign] = await db.insert(campaigns).values(campaign).returning();
    return newCampaign;
  }

  async updateCampaign(id: number, campaignData: Partial<Campaign>): Promise<Campaign> {
    const [updatedCampaign] = await db
      .update(campaigns)
      .set(campaignData)
      .where(eq(campaigns.id, id))
      .returning();
    return updatedCampaign;
  }

  async updateCampaignAmount(id: number, amount: number): Promise<Campaign> {
    const campaign = await this.getCampaign(id);
    if (!campaign) {
      throw new Error(`Campaign with id ${id} not found`);
    }
    
    const newAmount = campaign.currentAmount + amount;
    
    const [updatedCampaign] = await db
      .update(campaigns)
      .set({ currentAmount: newAmount })
      .where(eq(campaigns.id, id))
      .returning();
    
    return updatedCampaign;
  }

  // Donation methods
  async getDonation(id: number): Promise<Donation | undefined> {
    const [donation] = await db.select().from(donations).where(eq(donations.id, id));
    return donation || undefined;
  }

  async getDonationsByUser(userId: number): Promise<Donation[]> {
    return await db.select().from(donations).where(eq(donations.userId, userId));
  }

  async getDonationsByCampaign(campaignId: number): Promise<Donation[]> {
    return await db.select().from(donations).where(eq(donations.campaignId, campaignId));
  }

  async createDonation(donation: InsertDonation): Promise<Donation> {
    const [newDonation] = await db.insert(donations).values(donation).returning();
    return newDonation;
  }

  async updateDonationStatus(id: number, status: string): Promise<Donation> {
    const [updatedDonation] = await db
      .update(donations)
      .set({ paymentStatus: status })
      .where(eq(donations.id, id))
      .returning();
    return updatedDonation;
  }

  // Volunteer methods
  async getVolunteer(id: number): Promise<Volunteer | undefined> {
    const [volunteer] = await db.select().from(volunteers).where(eq(volunteers.id, id));
    return volunteer || undefined;
  }

  async getVolunteers(): Promise<Volunteer[]> {
    return await db.select().from(volunteers);
  }

  async createVolunteer(volunteer: InsertVolunteer): Promise<Volunteer> {
    const [newVolunteer] = await db.insert(volunteers).values(volunteer).returning();
    return newVolunteer;
  }

  // Success Story methods
  async getSuccessStory(id: number): Promise<SuccessStory | undefined> {
    const [story] = await db.select().from(successStories).where(eq(successStories.id, id));
    return story || undefined;
  }

  async getSuccessStories(): Promise<SuccessStory[]> {
    return await db.select().from(successStories).orderBy(desc(successStories.date));
  }

  async createSuccessStory(story: InsertSuccessStory): Promise<SuccessStory> {
    const [newStory] = await db.insert(successStories).values(story).returning();
    return newStory;
  }

  // Transaction methods
  async getTransaction(id: number): Promise<Transaction | undefined> {
    const [transaction] = await db.select().from(transactions).where(eq(transactions.id, id));
    return transaction || undefined;
  }

  async getTransactions(): Promise<Transaction[]> {
    return await db.select().from(transactions).orderBy(desc(transactions.date));
  }

  async getTransactionsByCampaign(campaignId: number): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.campaignId, campaignId))
      .orderBy(desc(transactions.date));
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db.insert(transactions).values(transaction).returning();
    return newTransaction;
  }
}

// Use DatabaseStorage in production
export const storage = new DatabaseStorage();
