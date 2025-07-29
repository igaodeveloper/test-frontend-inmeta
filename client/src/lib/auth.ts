import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./api";
import { authStore } from "@/store/auth";
import { useToast } from "@/hooks/use-toast";
import type { LoginData, RegisterData } from "@shared/schema";

export function useAuth() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { token, user, setAuth, clearAuth } = authStore();

  const loginMutation = useMutation({
    mutationFn: (data: LoginData) => apiClient.login(data),
    onSuccess: (response) => {
      setAuth(response.token, response.user);
      queryClient.invalidateQueries();
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterData) => apiClient.register(data),
    onSuccess: (response) => {
      setAuth(response.token, response.user);
      queryClient.invalidateQueries();
      toast({
        title: "Account created!",
        description: "Welcome to CardTrader.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logout = () => {
    clearAuth();
    queryClient.clear();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  const { data: currentUser } = useQuery({
    queryKey: ["/me"],
    queryFn: () => apiClient.getMe(),
    enabled: !!token,
    retry: false,
  });

  return {
    user: currentUser || user,
    isAuthenticated: !!token,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
}
