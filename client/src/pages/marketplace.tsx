import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TradeCard } from "@/components/trades/trade-card";
import { CardSkeleton } from "@/components/ui/loading-skeleton";
import { Search, Filter } from "lucide-react";

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: tradesResponse, isLoading } = useQuery({
    queryKey: ["/trades"],
    queryFn: () => apiClient.getTrades(),
  });

  const trades = tradesResponse?.list || [];

  const categories = [
    { id: "all", label: "Todas as Categorias" },
    { id: "pokemon", label: "Pokemon" },
    { id: "magic", label: "Magic" },
    { id: "yugioh", label: "Yu-Gi-Oh" },
    { id: "sports", label: "Esportes" },
  ];

  const filteredTrades = trades?.filter(trade => {
    if (selectedCategory !== "all") {
      const hasCategory = trade.cards?.some(tc => 
        tc.card?.category?.toLowerCase().includes(selectedCategory.toLowerCase())
      );
      if (!hasCategory) return false;
    }

    if (searchTerm) {
      const matchesSearch = trade.cards?.some(tc =>
        tc.card?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tc.card?.set.toLowerCase().includes(searchTerm.toLowerCase())
      ) || trade.user?.name.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Marketplace
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Descubra e explore oportunidades de troca com colecionadores do mundo todo
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <Input
              type="text"
              placeholder="Buscar trocas, cartas ou usuários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <p className="text-slate-600 dark:text-slate-400">
              {filteredTrades ? `${filteredTrades.length} trocas encontradas` : "Carregando..."}
            </p>
            <Button variant="outline" size="sm">
              <Filter className="mr-2" size={16} />
              Mais Filtros
            </Button>
          </div>
        </div>

        {/* Trades Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : filteredTrades && filteredTrades.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredTrades.map((trade, index) => (
              <motion.div
                key={trade.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <TradeCard trade={trade} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-12"
          >
            <div className="text-slate-400 dark:text-slate-500 mb-4">
              <Search size={64} className="mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhuma troca encontrada</h3>
              <p>Tente ajustar seus critérios de busca ou volte mais tarde para novas trocas.</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
