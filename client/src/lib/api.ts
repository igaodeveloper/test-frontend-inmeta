import { QueryClient } from "@tanstack/react-query";
import { authStore } from "@/store/auth";
import type { 
  LoginData, 
  RegisterData, 
  AuthResponse, 
  User, 
  Card, 
  Trade, 
  CreateTradeData,
  AddCardData 
} from "@shared/schema";

const API_BASE_URL = "https://cards-marketplace-api-2fjj.onrender.com";

class ApiClient {
  private getAuthHeaders(): Record<string, string> {
    const token = authStore.getState().token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.text().catch(() => response.statusText);
      throw new Error(`${response.status}: ${error}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // Auth endpoints
  async login(data: LoginData): Promise<AuthResponse> {
    return this.request<AuthResponse>("/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    return this.request<AuthResponse>("/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getMe(): Promise<User> {
    return this.request<User>("/me");
  }

  // Cards endpoints
  async getCards(): Promise<{ list: Card[]; rpp: number; page: number; more: boolean }> {
    return this.request<{ list: Card[]; rpp: number; page: number; more: boolean }>("/cards?rpp=100&page=1");
  }

  async getCard(id: string): Promise<Card> {
    return this.request<Card>(`/cards/${id}`);
  }

  async getUserCards(): Promise<Card[]> {
    return this.request<Card[]>("/me/cards");
  }

  async addCardToUser(cardIds: string[]): Promise<void> {
    return this.request<void>("/me/cards", {
      method: "POST",
      body: JSON.stringify({ cardIds }),
    });
  }

  // Trades endpoints
  async getTrades(): Promise<{ list: Trade[]; rpp: number; page: number; more: boolean }> {
    return this.request<{ list: Trade[]; rpp: number; page: number; more: boolean }>("/trades?rpp=100&page=1");
  }

  async createTrade(data: CreateTradeData): Promise<Trade> {
    const tradeData = {
      cards: [
        ...data.offeringCards.map(cardId => ({
          cardId,
          type: "OFFERING" as const,
        })),
        ...data.receivingCards.map(cardId => ({
          cardId,
          type: "RECEIVING" as const,
        })),
      ],
    };

    return this.request<Trade>("/trades", {
      method: "POST",
      body: JSON.stringify(tradeData),
    });
  }

  async deleteTrade(id: string): Promise<void> {
    return this.request<void>(`/trades/${id}`, {
      method: "DELETE",
    });
  }
}

export const apiClient = new ApiClient();

// Query client with retry logic for hibernating API
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error) => {
        // Retry up to 3 times with exponential backoff for server errors
        if (failureCount < 3 && error.message.includes("500")) {
          return true;
        }
        return false;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: (failureCount, error) => {
        if (failureCount < 2 && error.message.includes("500")) {
          return true;
        }
        return false;
      },
    },
  },
});
