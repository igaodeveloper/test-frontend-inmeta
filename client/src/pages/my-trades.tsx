import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { TradeCard } from "@/components/trades/trade-card";
import { CreateTradeModal } from "@/components/trades/create-trade-modal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/loading-skeleton";
import { Plus, ArrowUpDown, CheckCircle, Clock, Trash2 } from "lucide-react";

export default function MyTrades() {
  const [showCreateTrade, setShowCreateTrade] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tradesResponse, isLoading } = useQuery({
    queryKey: ["/trades"],
    queryFn: () => apiClient.getTrades(),
  });

  // Filter trades for current user
  const allTrades = tradesResponse?.list || [];
  const userTrades = allTrades.filter(trade => trade.userId === user?.id);
  const activeTrades = userTrades.filter(trade => trade.status === "ACTIVE");
  const completedTrades = userTrades.filter(trade => trade.status === "COMPLETED");
  const cancelledTrades = userTrades.filter(trade => trade.status === "CANCELLED");

  const deleteTradeMutation = useMutation({
    mutationFn: (tradeId: string) => apiClient.deleteTrade(tradeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/trades"] });
      toast({
        title: "Troca excluída",
        description: "Sua proposta de troca foi removida.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Falha ao excluir troca",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDeleteTrade = (tradeId: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta troca?")) {
      deleteTradeMutation.mutate(tradeId);
    }
  };

  const stats = [
    {
      label: "Trocas Ativas",
      value: activeTrades.length,
      icon: ArrowUpDown,
      color: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
      iconColor: "text-blue-600",
    },
    {
      label: "Canceladas",
      value: cancelledTrades.length,
      icon: Clock,
      color: "from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20",
      iconColor: "text-yellow-600",
    },
    {
      label: "Concluídas",
      value: completedTrades.length,
      icon: CheckCircle,
      color: "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
      iconColor: "text-green-600",
    },
    {
      label: "Total",
      value: userTrades.length,
      icon: ArrowUpDown,
      color: "from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 dark:bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Minhas Trocas
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-400">
                  Gerencie suas propostas de troca e acompanhe o progresso
                </p>
              </div>
              <Button
                onClick={() => setShowCreateTrade(true)}
                size="lg"
                className="flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Nova Troca</span>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`bg-gradient-to-br ${stat.color} rounded-xl p-6`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`${stat.iconColor} font-medium`}>{stat.label}</p>
                      <p className={`text-3xl font-bold ${stat.iconColor}`}>{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 bg-white dark:bg-card rounded-lg flex items-center justify-center ${stat.iconColor}`}>
                      <stat.icon size={24} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Trades Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="active">Ativas ({activeTrades.length})</TabsTrigger>
                <TabsTrigger value="cancelled">Canceladas ({cancelledTrades.length})</TabsTrigger>
                <TabsTrigger value="completed">Concluídas ({completedTrades.length})</TabsTrigger>
                <TabsTrigger value="all">Todas ({userTrades.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="mt-8">
                {isLoading ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <Skeleton key={i} className="h-80" />
                    ))}
                  </div>
                ) : activeTrades.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeTrades.map((trade) => (
                      <div key={trade.id} className="relative">
                        <TradeCard trade={trade} />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-2 right-2"
                          onClick={() => handleDeleteTrade(trade.id)}
                          disabled={deleteTradeMutation.isPending}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <ArrowUpDown className="mx-auto mb-4 text-slate-400" size={64} />
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      Nenhuma troca ativa
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                      Crie sua primeira troca para começar a trocar cartas
                    </p>
                    <Button onClick={() => setShowCreateTrade(true)}>
                      <Plus className="mr-2" size={16} />
                      Criar Nova Troca
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="cancelled" className="mt-8">
                {isLoading ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <Skeleton key={i} className="h-80" />
                    ))}
                  </div>
                ) : cancelledTrades.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cancelledTrades.map((trade) => (
                      <div key={trade.id} className="relative">
                        <TradeCard trade={trade} />
                        <div className="absolute top-2 left-2 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 px-2 py-1 rounded text-xs font-medium">
                          Cancelada
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <Clock className="mx-auto mb-4 text-slate-400" size={64} />
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      Nenhuma troca cancelada
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Trocas canceladas aparecerão aqui
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="completed" className="mt-8">
                {isLoading ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <Skeleton key={i} className="h-80" />
                    ))}
                  </div>
                ) : completedTrades.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {completedTrades.map((trade) => (
                      <div key={trade.id} className="relative">
                        <TradeCard trade={trade} />
                        <div className="absolute top-2 left-2 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs font-medium">
                          Concluída
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <CheckCircle className="mx-auto mb-4 text-slate-400" size={64} />
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      Nenhuma troca concluída
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Trocas finalizadas aparecerão aqui
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="all" className="mt-8">
                {isLoading ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <Skeleton key={i} className="h-80" />
                    ))}
                  </div>
                ) : userTrades.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userTrades.map((trade) => (
                      <div key={trade.id} className="relative">
                        <TradeCard trade={trade} />
                        {trade.status === "ACTIVE" && (
                          <Button
                            size="sm"
                            variant="destructive"
                            className="absolute top-2 right-2"
                            onClick={() => handleDeleteTrade(trade.id)}
                            disabled={deleteTradeMutation.isPending}
                          >
                            <Trash2 size={16} />
                          </Button>
                        )}
                        <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium ${
                          trade.status === "ACTIVE" 
                            ? "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200"
                            : trade.status === "CANCELLED"
                            ? "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200"
                            : "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200"
                        }`}>
                          {trade.status === "ACTIVE" ? "Ativa" : 
                           trade.status === "CANCELLED" ? "Cancelada" : "Concluída"}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <ArrowUpDown className="mx-auto mb-4 text-slate-400" size={64} />
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      Nenhuma troca ainda
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                      Crie sua primeira troca para começar a trocar cartas
                    </p>
                    <Button onClick={() => setShowCreateTrade(true)}>
                      <Plus className="mr-2" size={16} />
                      Criar Nova Troca
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>

        <CreateTradeModal
          isOpen={showCreateTrade}
          onClose={() => setShowCreateTrade(false)}
        />
      </div>
    </ProtectedRoute>
  );
}