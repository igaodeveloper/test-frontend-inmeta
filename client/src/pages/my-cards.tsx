import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { apiClient } from "@/lib/api";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { CardItem } from "@/components/cards/card-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/loading-skeleton";
import { Search, Filter, Plus, CreditCard } from "lucide-react";
import { Link } from "wouter";

export default function MyCards() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRarity, setSelectedRarity] = useState("all");

  const { data: userCards, isLoading } = useQuery({
    queryKey: ["/me/cards"],
    queryFn: () => apiClient.getUserCards(),
  });

  const categories = [
    { id: "all", label: "Todas as Categorias" },
    { id: "pokemon", label: "Pokemon" },
    { id: "magic", label: "Magic" },
    { id: "yugioh", label: "Yu-Gi-Oh" },
    { id: "sports", label: "Esportes" },
  ];

  const rarities = [
    { id: "all", label: "Todas as Raridades" },
    { id: "common", label: "Comum" },
    { id: "uncommon", label: "Incomum" },
    { id: "rare", label: "Rara" },
    { id: "epic", label: "Épica" },
    { id: "legendary", label: "Lendária" },
  ];

  // Filter cards based on search criteria
  const filteredCards = userCards?.filter(card => {
    const matchesSearch = !searchTerm || 
      card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.set.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === "all" || 
      card.category?.toLowerCase().includes(selectedCategory.toLowerCase());

    const matchesRarity = selectedRarity === "all" || 
      card.rarity?.toLowerCase().includes(selectedRarity.toLowerCase());

    return matchesSearch && matchesCategory && matchesRarity;
  });

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 dark:bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Minha Coleção
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-400">
                  Gerencie e organize suas cartas colecionáveis
                </p>
              </div>
              <Link href="/dashboard?tab=add-cards">
                <Button size="lg" className="flex items-center space-x-2">
                  <Plus size={20} />
                  <span>Adicionar Cartas</span>
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-card rounded-lg p-4 border border-slate-200 dark:border-border">
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {userCards?.length || 0}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Total de Cartas
                </div>
              </div>
              <div className="bg-white dark:bg-card rounded-lg p-4 border border-slate-200 dark:border-border">
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {filteredCards?.length || 0}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Cartas Filtradas
                </div>
              </div>
              <div className="bg-white dark:bg-card rounded-lg p-4 border border-slate-200 dark:border-border">
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {new Set(userCards?.map(card => card.category)).size || 0}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Categorias
                </div>
              </div>
              <div className="bg-white dark:bg-card rounded-lg p-4 border border-slate-200 dark:border-border">
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {new Set(userCards?.map(card => card.set)).size || 0}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Séries Diferentes
                </div>
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white dark:bg-card rounded-lg p-6 mb-8 border border-slate-200 dark:border-border"
          >
            <div className="grid md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                  <Input
                    type="text"
                    placeholder="Buscar por nome, série..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={selectedRarity} onValueChange={setSelectedRarity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Raridade" />
                  </SelectTrigger>
                  <SelectContent>
                    {rarities.map((rarity) => (
                      <SelectItem key={rarity.id} value={rarity.id}>
                        {rarity.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>

          {/* Cards Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(12)].map((_, i) => (
                <Skeleton key={i} className="h-48" />
              ))}
            </div>
          ) : filteredCards && filteredCards.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
            >
              {filteredCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <CardItem card={card} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center py-16"
            >
              <CreditCard className="mx-auto mb-4 text-slate-400" size={64} />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                {searchTerm || selectedCategory !== "all" || selectedRarity !== "all" 
                  ? "Nenhuma carta encontrada" 
                  : "Nenhuma carta na coleção"
                }
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {searchTerm || selectedCategory !== "all" || selectedRarity !== "all"
                  ? "Tente ajustar seus filtros de busca"
                  : "Comece adicionando suas primeiras cartas à coleção"
                }
              </p>
              <Link href="/dashboard?tab=add-cards">
                <Button>
                  <Plus className="mr-2" size={16} />
                  Adicionar Cartas
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}