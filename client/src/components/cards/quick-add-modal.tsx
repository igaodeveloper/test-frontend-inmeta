import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardItem } from "@/components/cards/card-item";
import { Skeleton } from "@/components/ui/loading-skeleton";
import { Search, Plus, Zap } from "lucide-react";
import type { Card } from "@shared/schema";

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickAddModal({ isOpen, onClose }: QuickAddModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch popular cards for quick selection
  const { data: cardsResponse, isLoading } = useQuery({
    queryKey: ["/cards"],
    queryFn: () => apiClient.getCards(),
    enabled: isOpen,
  });

  const allCards = cardsResponse?.list || [];

  // Get popular cards (first 12) and filter by search if needed
  const displayCards = searchTerm
    ? allCards.filter(card =>
        card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (card.set && card.set.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (card.rarity && card.rarity.toLowerCase().includes(searchTerm.toLowerCase()))
      ).slice(0, 12)
    : allCards.slice(0, 12);

  const addCardsMutation = useMutation({
    mutationFn: (cardIds: string[]) => apiClient.addCardToUser(cardIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/me/cards"] });
      toast({
        title: "Cartas adicionadas!",
        description: `${selectedCards.length} carta${selectedCards.length > 1 ? 's' : ''} adicionada${selectedCards.length > 1 ? 's' : ''} à sua coleção.`,
      });
      setSelectedCards([]);
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Falha ao adicionar cartas",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAddCards = () => {
    if (selectedCards.length === 0) {
      toast({
        title: "Nenhuma carta selecionada",
        description: "Selecione pelo menos uma carta para adicionar.",
        variant: "destructive",
      });
      return;
    }
    addCardsMutation.mutate(selectedCards);
  };

  const toggleCardSelection = (cardId: string) => {
    setSelectedCards(prev =>
      prev.includes(cardId)
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Zap className="text-primary" size={24} />
            <span>Adicione Suas Primeiras Cartas</span>
          </DialogTitle>
          <DialogDescription>
            Selecione cartas populares para começar sua coleção rapidamente
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <Input
              placeholder="Pesquisar cartas por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Selected Cards Counter */}
          {selectedCards.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-primary/10 border border-primary/20 rounded-lg p-4"
            >
              <p className="text-primary font-medium">
                {selectedCards.length} carta{selectedCards.length > 1 ? 's' : ''} selecionada{selectedCards.length > 1 ? 's' : ''}
              </p>
            </motion.div>
          )}

          {/* Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {isLoading ? (
              Array.from({ length: 12 }).map((_, index) => (
                <Skeleton key={index} className="h-48" />
              ))
            ) : (
              displayCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`relative cursor-pointer transition-all duration-200 ${
                    selectedCards.includes(card.id)
                      ? "ring-2 ring-primary ring-offset-2 scale-105"
                      : "hover:scale-105"
                  }`}
                  onClick={() => toggleCardSelection(card.id)}
                >
                  <CardItem card={card} />
                  {selectedCards.includes(card.id) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                    >
                      <Plus className="text-white" size={14} />
                    </motion.div>
                  )}
                </motion.div>
              ))
            )}
          </div>

          {displayCards.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <p className="text-slate-500">Nenhuma carta encontrada</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              onClick={handleAddCards}
              disabled={selectedCards.length === 0 || addCardsMutation.isPending}
              className="flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>
                {addCardsMutation.isPending
                  ? "Adicionando..."
                  : `Adicionar ${selectedCards.length || ""} Carta${selectedCards.length !== 1 ? "s" : ""}`
                }
              </span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}