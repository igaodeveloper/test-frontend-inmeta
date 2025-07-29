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
        title: "Bem-vindo de volta!",
        description: "Você fez login com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Falha no login",
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
        title: "Conta criada!",
        description: "Bem-vindo ao CardTrader.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Falha no cadastro",
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
