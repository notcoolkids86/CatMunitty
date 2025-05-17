import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  phoneNumber: text("phone_number"),
  address: text("address"),
  bio: text("bio"),
  profileImage: text("profile_image"),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  phoneNumber: true,
  address: true,
});

export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  shortDescription: text("short_description").notNull(),
  imageUrl: text("image_url").notNull(),
  targetAmount: integer("target_amount").notNull(),
  currentAmount: integer("current_amount").default(0),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date").notNull(),
  creatorId: integer("creator_id").notNull(),
  category: text("category").notNull(),
  location: text("location"),
  status: text("status").default("active"),
  featured: boolean("featured").default(false),
});

export const insertCampaignSchema = createInsertSchema(campaigns).pick({
  title: true,
  description: true,
  shortDescription: true,
  imageUrl: true,
  targetAmount: true,
  endDate: true,
  creatorId: true,
  category: true,
  location: true,
});

export const donations = pgTable("donations", {
  id: serial("id").primaryKey(),
  amount: integer("amount").notNull(),
  userId: integer("user_id"),
  campaignId: integer("campaign_id").notNull(),
  message: text("message"),
  anonymous: boolean("anonymous").default(false),
  stripeSessionId: text("stripe_session_id"),
  paymentStatus: text("payment_status").default("pending"),
  donorName: text("donor_name"),
  donorEmail: text("donor_email"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDonationSchema = createInsertSchema(donations).pick({
  amount: true,
  userId: true,
  campaignId: true,
  message: true,
  anonymous: true,
  donorName: true,
  donorEmail: true,
});

export const volunteers = pgTable("volunteers", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number").notNull(),
  address: text("address").notNull(),
  areaOfInterest: text("area_of_interest").notNull(),
  experience: text("experience"),
  userId: integer("user_id"),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertVolunteerSchema = createInsertSchema(volunteers).pick({
  firstName: true,
  lastName: true,
  email: true,
  phoneNumber: true,
  address: true,
  areaOfInterest: true,
  experience: true,
  userId: true,
});

export const successStories = pgTable("success_stories", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  date: timestamp("date").defaultNow(),
  campaignId: integer("campaign_id"),
});

export const insertSuccessStorySchema = createInsertSchema(successStories).pick({
  title: true,
  description: true,
  imageUrl: true,
  date: true,
  campaignId: true,
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  description: text("description").notNull(),
  amount: integer("amount").notNull(),
  campaignId: integer("campaign_id"),
  category: text("category").notNull(),
  date: timestamp("date").defaultNow(),
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  description: true,
  amount: true,
  campaignId: true,
  category: true,
  date: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;

export type Donation = typeof donations.$inferSelect;
export type InsertDonation = z.infer<typeof insertDonationSchema>;

export type Volunteer = typeof volunteers.$inferSelect;
export type InsertVolunteer = z.infer<typeof insertVolunteerSchema>;

export type SuccessStory = typeof successStories.$inferSelect;
export type InsertSuccessStory = z.infer<typeof insertSuccessStorySchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
