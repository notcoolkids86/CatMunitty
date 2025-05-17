import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import Stripe from "stripe";
import {
  insertCampaignSchema,
  insertDonationSchema,
  insertVolunteerSchema,
  insertSuccessStorySchema,
  insertTransactionSchema
} from "@shared/schema";
import { z } from "zod";

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Missing STRIPE_SECRET_KEY environment variable - donations will not work!');
}

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
    })
  : null;

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Campaign endpoints
  app.get("/api/campaigns", async (req, res) => {
    try {
      const { 
        category, 
        featured, 
        search,
        page = 1,
        limit = 10,
        list = 'false'
      } = req.query;
      
      // Jika parameter list=true, hanya kembalikan data minimal untuk dropdown
      if (list === 'true') {
        const result = await storage.getCampaigns({});
        const simplifiedList = result.campaigns.map(c => ({
          id: c.id,
          title: c.title,
        }));
        return res.json(simplifiedList);
      }
      
      const params = {
        category: category as string | undefined,
        featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
        search: search as string | undefined,
        page: parseInt(page as string),
        limit: parseInt(limit as string)
      };
      
      const result = await storage.getCampaigns(params);
      res.json(result);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      res.status(500).json({ message: "Failed to fetch campaigns" });
    }
  });

  app.get("/api/campaigns/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const campaign = await storage.getCampaign(id);
      
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      res.json(campaign);
    } catch (error) {
      console.error("Error fetching campaign:", error);
      res.status(500).json({ message: "Failed to fetch campaign" });
    }
  });

  app.post("/api/campaigns", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to create a campaign" });
      }
      
      // Validate input
      const campaignData = insertCampaignSchema.parse(req.body);
      
      // Set creator ID to current user
      campaignData.creatorId = req.user.id;
      
      const campaign = await storage.createCampaign(campaignData);
      res.status(201).json(campaign);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid campaign data", errors: error.errors });
      }
      console.error("Error creating campaign:", error);
      res.status(500).json({ message: "Failed to create campaign" });
    }
  });

  // Donation endpoints
  app.post("/api/donations", async (req, res) => {
    try {
      // Validate input
      const donationData = insertDonationSchema.parse(req.body);
      
      // If user is authenticated, set userId
      if (req.isAuthenticated()) {
        donationData.userId = req.user.id;
      }
      
      // Create donation record with pending status
      const donation = await storage.createDonation(donationData);
      
      // If stripe is configured, create payment intent
      if (stripe) {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: donationData.amount * 100, // Convert to cents
          currency: "idr", // Indonesian Rupiah
          metadata: {
            donationId: donation.id.toString(),
            campaignId: donationData.campaignId.toString()
          }
        });
        
        // Update donation with stripe session id
        await storage.updateDonationStatus(donation.id, "awaiting_payment");
        
        res.json({ 
          donation,
          paymentIntent: {
            clientSecret: paymentIntent.client_secret
          }
        });
      } else {
        // For development without Stripe
        // Update campaign amount
        await storage.updateCampaignAmount(donationData.campaignId, donationData.amount);
        await storage.updateDonationStatus(donation.id, "completed");
        
        res.status(201).json({ donation, paymentIntent: null });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid donation data", errors: error.errors });
      }
      console.error("Error creating donation:", error);
      res.status(500).json({ message: "Failed to create donation" });
    }
  });

  app.post("/api/payments/webhook", async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ message: "Stripe is not configured" });
    }
    
    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        req.headers['stripe-signature'] as string,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );
      
      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const donationId = parseInt(paymentIntent.metadata.donationId);
        const campaignId = parseInt(paymentIntent.metadata.campaignId);
        
        // Update donation status
        const donation = await storage.updateDonationStatus(donationId, "completed");
        
        // Update campaign amount
        await storage.updateCampaignAmount(campaignId, donation.amount);
      }
      
      res.json({ received: true });
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(400).json({ message: "Webhook error" });
    }
  });

  // Volunteer endpoints
  app.post("/api/volunteers", async (req, res) => {
    try {
      // Validate input
      const volunteerData = insertVolunteerSchema.parse(req.body);
      
      // If user is authenticated, set userId
      if (req.isAuthenticated()) {
        volunteerData.userId = req.user.id;
      }
      
      const volunteer = await storage.createVolunteer(volunteerData);
      res.status(201).json(volunteer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid volunteer data", errors: error.errors });
      }
      console.error("Error creating volunteer application:", error);
      res.status(500).json({ message: "Failed to submit volunteer application" });
    }
  });

  // Success Stories endpoints
  app.get("/api/success-stories", async (req, res) => {
    try {
      const stories = await storage.getSuccessStories();
      res.json(stories);
    } catch (error) {
      console.error("Error fetching success stories:", error);
      res.status(500).json({ message: "Failed to fetch success stories" });
    }
  });

  // Admin-only endpoints
  app.post("/api/success-stories", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      // Validate input
      const storyData = insertSuccessStorySchema.parse(req.body);
      
      const story = await storage.createSuccessStory(storyData);
      res.status(201).json(story);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid story data", errors: error.errors });
      }
      console.error("Error creating success story:", error);
      res.status(500).json({ message: "Failed to create success story" });
    }
  });

  // Transaction endpoints
  app.get("/api/transactions", async (req, res) => {
    try {
      const campaignId = req.query.campaignId ? parseInt(req.query.campaignId as string) : undefined;
      
      let transactions;
      if (campaignId) {
        transactions = await storage.getTransactionsByCampaign(campaignId);
      } else {
        transactions = await storage.getTransactions();
      }
      
      // Menambahkan judul kampanye ke transaksi
      if (transactions.length > 0) {
        // Mendapatkan semua ID kampanye yang ada dalam transaksi
        const campaignIds = [...new Set(
          transactions
            .filter(t => t.campaignId !== null && t.campaignId !== undefined)
            .map(t => t.campaignId)
        )];
        
        // Mendapatkan informasi kampanye jika ada ID kampanye
        let campaignsInfo: Record<number, string> = {};
        if (campaignIds.length > 0) {
          const campaigns = await Promise.all(
            campaignIds.map(id => storage.getCampaign(id as number))
          );
          
          // Membangun map kampanye ID -> judul
          campaignsInfo = campaigns.reduce((acc, campaign) => {
            if (campaign) {
              acc[campaign.id] = campaign.title;
            }
            return acc;
          }, {} as Record<number, string>);
        }
        
        // Menambahkan judul kampanye ke setiap transaksi
        transactions = transactions.map(transaction => {
          if (transaction.campaignId && campaignsInfo[transaction.campaignId]) {
            return {
              ...transaction,
              campaignTitle: campaignsInfo[transaction.campaignId]
            };
          }
          return transaction;
        });
      }
      
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      // Validate input
      const transactionData = insertTransactionSchema.parse(req.body);
      
      const transaction = await storage.createTransaction(transactionData);
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid transaction data", errors: error.errors });
      }
      console.error("Error creating transaction:", error);
      res.status(500).json({ message: "Failed to create transaction" });
    }
  });

  // Stripe payment intent
  app.post("/api/create-payment-intent", async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ message: "Stripe is not configured" });
    }
    
    try {
      const { amount } = req.body;
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "idr", // Indonesian Rupiah
      });
      
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
