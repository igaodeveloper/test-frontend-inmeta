import { z } from "zod";

// User schemas
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  createdAt: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Card schemas
export const cardSchema = z.object({
  id: z.string(),
  name: z.string(),
  set: z.string(),
  rarity: z.string().optional(),
  condition: z.string().optional(),
  imageUrl: z.string().optional(),
  category: z.string().optional(),
});

export const addCardSchema = z.object({
  cardId: z.string(),
  condition: z.string().optional(),
});

// Trade schemas
export const tradeCardSchema = z.object({
  id: z.string(),
  cardId: z.string(),
  tradeId: z.string(),
  type: z.enum(["OFFERING", "RECEIVING"]),
  card: cardSchema.optional(),
});

export const tradeSchema = z.object({
  id: z.string(),
  userId: z.string(),
  status: z.enum(["ACTIVE", "COMPLETED", "CANCELLED"]).optional(),
  createdAt: z.string().optional(),
  user: userSchema.optional(),
  cards: z.array(tradeCardSchema).optional(),
});

export const createTradeSchema = z.object({
  offeringCards: z.array(z.string()).min(1, "Please select at least one card to offer"),
  receivingCards: z.array(z.string()).min(1, "Please select at least one card you want"),
});

// Type exports
export type User = z.infer<typeof userSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type Card = z.infer<typeof cardSchema>;
export type AddCardData = z.infer<typeof addCardSchema>;
export type Trade = z.infer<typeof tradeSchema>;
export type TradeCard = z.infer<typeof tradeCardSchema>;
export type CreateTradeData = z.infer<typeof createTradeSchema>;

// API Response schemas
export const authResponseSchema = z.object({
  token: z.string(),
  user: userSchema,
});

export type AuthResponse = z.infer<typeof authResponseSchema>;
