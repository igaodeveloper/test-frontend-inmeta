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
  const { data: allCards, isLoading: loadingAllCards } = useQuery({
    queryKey: ["/cards"],
    queryFn: () => apiClient.getCards(),
  });

  // Fetch user's current cards to avoid duplicates
  const { data: userCards } = useQuery({
    queryKey: ["/me/cards"],
    queryFn: () => apiClient.getUserCards(),
  });

  const categories = [
    { id: "all", label: "All Categories" },
    { id: "pokemon", label: "Pokemon" },
    { id: "magic", label: "Magic" },
    { id: "yugioh", label: "Yu-Gi-Oh" },
    { id: "sports", label: "Sports" },
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
    mutationFn: async (cardIds: string[]) => {
      // Add cards one by one (API expects single card per request)
      for (const cardId of cardIds) {
        await apiClient.addCardToUser({ cardId });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/me/cards"] });
      toast({
        title: "Cards added!",
        description: `Successfully added ${selectedCards.length} card${selectedCards.length > 1 ? 's' : ''} to your collection.`,
      });
      setSelectedCards([]);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add cards",
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
            Add Cards to Collection
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Browse and add cards from our marketplace to your collection
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
                ? "Adding..." 
                : `Add ${selectedCards.length} Card${selectedCards.length > 1 ? 's' : ''}`
              }
            </span>
          </Button>
        )}
      </div>

      {/* Search and Filter Controls */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="search-cards">Search Cards</Label>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
            <Input
              id="search-cards"
              type="text"
              placeholder="Search by name, set, or rarity..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="category-filter">Category</Label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select category" />
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
            ? "Loading cards..." 
            : `${filteredCards.length} cards available to add`
          }
        </p>
        {selectedCards.length > 0 && (
          <p className="font-medium text-primary">
            {selectedCards.length} selected
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
            <h4 className="text-lg font-medium mb-2">No cards found</h4>
            <p>
              {searchTerm || selectedCategory !== "all" 
                ? "Try adjusting your search or filter criteria."
                : "All available cards are already in your collection!"
              }
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}