import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CardItem } from "@/components/cards/card-item";
import { Skeleton } from "@/components/ui/loading-skeleton";
import { Search, Plus, Filter } from "lucide-react";
import type { Card } from "@shared/schema";

export function AddCardsSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all available cards
  const { data: cardsResponse, isLoading: loadingAllCards } = useQuery({
    queryKey: ["/cards"],
    queryFn: () => apiClient.getCards(),
  });

  const allCards = cardsResponse?.list || [];

  // Fetch user's current cards to avoid duplicates
  const { data: userCards } = useQuery({
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

  // Filter cards based on search and category
  const filteredCards = useMemo(() => {
    if (!allCards) return [];
    
    let filtered = allCards;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(card => 
        card.category?.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(card =>
        card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.set.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.rarity?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter out cards user already owns
    const userCardIds = userCards?.map(card => card.id) || [];
    filtered = filtered.filter(card => !userCardIds.includes(card.id));

    return filtered;
  }, [allCards, selectedCategory, searchTerm, userCards]);

  // Add cards mutation
  const addCardsMutation = useMutation({
    mutationFn: (cardIds: string[]) => apiClient.addCardToUser(cardIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/me/cards"] });
      toast({
        title: "Cartas adicionadas!",
        description: `${selectedCards.length} carta${selectedCards.length > 1 ? 's' : ''} adicionada${selectedCards.length > 1 ? 's' : ''} à sua coleção.`,
      });
      setSelectedCards([]);
    },
    onError: (error: Error) => {
      toast({
        title: "Falha ao adicionar cartas",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCardToggle = (cardId: string) => {
    setSelectedCards(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };

  const handleAddCards = () => {
    if (selectedCards.length > 0) {
      addCardsMutation.mutate(selectedCards);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Adicionar Cartas à Coleção
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Navegue e adicione cartas do nosso marketplace à sua coleção
          </p>
        </div>
        {selectedCards.length > 0 && (
          <Button 
            onClick={handleAddCards}
            disabled={addCardsMutation.isPending}
            className="flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>
              {addCardsMutation.isPending 
                ? "Adicionando..." 
                : `Adicionar ${selectedCards.length} Carta${selectedCards.length > 1 ? 's' : ''}`
              }
            </span>
          </Button>
        )}
      </div>

      {/* Search and Filter Controls */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="search-cards">Buscar Cartas</Label>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
            <Input
              id="search-cards"
              type="text"
              placeholder="Buscar por nome, série ou raridade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="category-filter">Categoria</Label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Selecione uma categoria" />
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
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
        <p>
          {loadingAllCards 
            ? "Carregando cartas..." 
            : `${filteredCards.length} cartas disponíveis para adicionar`
          }
        </p>
        {selectedCards.length > 0 && (
          <p className="font-medium text-primary">
            {selectedCards.length} selecionada${selectedCards.length > 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Cards Grid */}
      {loadingAllCards ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : filteredCards.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-h-96 overflow-y-auto"
        >
          {filteredCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.02 }}
            >
              <CardItem
                card={card}
                selected={selectedCards.includes(card.id)}
                onSelect={() => handleCardToggle(card.id)}
                showCondition={false}
              />
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
            <h4 className="text-lg font-medium mb-2">Nenhuma carta encontrada</h4>
            <p>
              {searchTerm || selectedCategory !== "all" 
                ? "Tente ajustar seus critérios de busca ou filtro."
                : "Todas as cartas disponíveis já estão na sua coleção!"
              }
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}