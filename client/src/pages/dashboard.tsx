import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardItem } from "@/components/cards/card-item";
import { AddCardsSection } from "@/components/cards/add-cards-section";
import { TradeCard } from "@/components/trades/trade-card";
import { CreateTradeModal } from "@/components/trades/create-trade-modal";
import { QuickAddModal } from "@/components/cards/quick-add-modal";
import { DashboardSkeleton } from "@/components/ui/loading-skeleton";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Plus, CreditCard, ArrowUpDown, CheckCircle, Star, Trash2 } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreateTrade, setShowCreateTrade] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  // Fetch user's cards
  const { data: userCards, isLoading: cardsLoading } = useQuery({
    queryKey: ["/me/cards"],
    queryFn: () => apiClient.getUserCards(),
  });

  // Fetch all trades to filter user's trades
  const { data: tradesResponse, isLoading: tradesLoading } = useQuery({
    queryKey: ["/trades"],
    queryFn: () => apiClient.getTrades(),
  });

  const allTrades = tradesResponse?.list || [];
  const userTrades = allTrades.filter(trade => trade.userId === user?.id);
  const activeTrades = userTrades.filter(trade => trade.status !== "COMPLETED" && trade.status !== "CANCELLED");
  const completedTrades = userTrades.filter(trade => trade.status === "COMPLETED");

  // Delete trade mutation
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
      label: "Minhas Cartas",
      value: userCards?.length || 0,
      icon: CreditCard,
      color: "from-primary/10 to-primary/20",
      iconColor: "text-primary",
    },
    {
      label: "Trocas Ativas",
      value: activeTrades.length,
      icon: ArrowUpDown,
      color: "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
      iconColor: "text-green-600",
    },
    {
      label: "Concluídas",
      value: completedTrades.length,
      icon: CheckCircle,
      color: "from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20",
      iconColor: "text-yellow-600",
    },
    {
      label: "Avaliação",
      value: "4.9",
      icon: Star,
      color: "from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
      iconColor: "text-purple-600",
    },
  ];

  if (cardsLoading || tradesLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-white dark:bg-background py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <DashboardSkeleton />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white dark:bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Bem-vindo de volta, <span className="text-primary">{user?.name?.split(' ')[0]}</span>!
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-400">
                  Gerencie suas cartas e trocas
                </p>
              </div>
              <Button
                onClick={() => setShowCreateTrade(true)}
                size="lg"
                className="flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Criar Nova Troca</span>
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
          >
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
          </motion.div>

          {/* Content Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Tabs defaultValue="cards" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="cards">Minhas Cartas</TabsTrigger>
                <TabsTrigger value="trades">Minhas Trocas</TabsTrigger>
                <TabsTrigger value="add-cards">Adicionar Cartas</TabsTrigger>
              </TabsList>

              <TabsContent value="cards" className="mt-8">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    Sua Coleção ({userCards?.length || 0} cartas)
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Gerencie sua coleção de cartas
                  </p>
                </div>

                {userCards && userCards.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {userCards.map((card, index) => (
                      <motion.div
                        key={card.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                      >
                        <CardItem 
                          card={card} 
                          onClick={() => {
                            // Open card details modal
                            console.log("Card clicked:", card.name);
                          }}
                        />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CreditCard className="mx-auto mb-4 text-slate-400" size={64} />
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      Nenhuma carta ainda
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      Comece a construir sua coleção adicionando cartas
                    </p>
                    <Button 
                      onClick={() => setShowQuickAdd(true)}
                      size="lg"
                      className="inline-flex items-center space-x-2"
                    >
                      <Plus size={20} />
                      <span>Adicionar Sua Primeira Carta</span>
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="trades" className="mt-8">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    Suas Trocas ({userTrades.length} total)
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Monitore e gerencie suas propostas de troca
                  </p>
                </div>

                {userTrades.length > 0 ? (
                  <div className="space-y-6">
                    {activeTrades.length > 0 && (
                      <div>
                        <h4 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
                          Trocas Ativas ({activeTrades.length})
                        </h4>
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
                      </div>
                    )}

                    {completedTrades.length > 0 && (
                      <div>
                        <h4 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
                          Trocas Concluídas ({completedTrades.length})
                        </h4>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {completedTrades.map((trade) => (
                            <TradeCard key={trade.id} trade={trade} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ArrowUpDown className="mx-auto mb-4 text-slate-400" size={64} />
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      Nenhuma troca ainda
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      Crie sua primeira troca para começar a trocar cartas
                    </p>
                    <Button onClick={() => setShowCreateTrade(true)}>
                      <Plus className="mr-2" size={16} />
                      Criar Sua Primeira Troca
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="add-cards" className="mt-8">
                <AddCardsSection />
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>

        <CreateTradeModal
          isOpen={showCreateTrade}
          onClose={() => setShowCreateTrade(false)}
        />

        <QuickAddModal
          isOpen={showQuickAdd}
          onClose={() => setShowQuickAdd(false)}
        />
      </div>
    </ProtectedRoute>
  );
}
