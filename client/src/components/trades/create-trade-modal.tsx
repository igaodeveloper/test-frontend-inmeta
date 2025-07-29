import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createTradeSchema, type CreateTradeData, type Card } from "@shared/schema";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardItem } from "@/components/cards/card-item";
import { Skeleton } from "@/components/ui/loading-skeleton";
import { Plus, Minus, Search } from "lucide-react";

interface CreateTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTradeModal({ isOpen, onClose }: CreateTradeModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOffering, setSelectedOffering] = useState<string[]>([]);
  const [selectedReceiving, setSelectedReceiving] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CreateTradeData>({
    resolver: zodResolver(createTradeSchema),
    defaultValues: {
      offeringCards: [],
      receivingCards: [],
    },
  });

  // Fetch user's cards
  const { data: userCards, isLoading: loadingUserCards } = useQuery({
    queryKey: ["/me/cards"],
    queryFn: () => apiClient.getUserCards(),
    enabled: isOpen,
  });

  // Fetch all cards for search
  const { data: allCards, isLoading: loadingAllCards } = useQuery({
    queryKey: ["/cards"],
    queryFn: () => apiClient.getCards(),
    enabled: isOpen,
  });

  // Filter cards based on search
  const filteredCards = useMemo(() => {
    if (!allCards || !searchTerm) return allCards || [];
    return allCards.filter(card => 
      card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.set.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allCards, searchTerm]);

  const createTradeMutation = useMutation({
    mutationFn: (data: CreateTradeData) => apiClient.createTrade(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/trades"] });
      toast({
        title: "Trade created!",
        description: "Your trade request has been posted successfully.",
      });
      onClose();
      handleReset();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create trade",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleReset = () => {
    setSelectedOffering([]);
    setSelectedReceiving([]);
    setSearchTerm("");
    form.reset();
  };

  const handleOfferingToggle = (cardId: string) => {
    setSelectedOffering(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };

  const handleReceivingToggle = (cardId: string) => {
    setSelectedReceiving(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };

  const onSubmit = (data: CreateTradeData) => {
    const tradeData = {
      offeringCards: selectedOffering,
      receivingCards: selectedReceiving,
    };
    createTradeMutation.mutate(tradeData);
  };

  const handleClose = () => {
    onClose();
    handleReset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-slate-900 dark:text-slate-100">
            Create New Trade
          </DialogTitle>
          <p className="text-center text-slate-600 dark:text-slate-400">
            Select cards to offer and cards you want to receive
          </p>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Offering Section */}
            <div>
              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-4 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Cards I'm Offering ({selectedOffering.length})
              </h3>
              
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 mb-4 min-h-[200px]">
                {selectedOffering.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {selectedOffering.map(cardId => {
                      const card = userCards?.find(c => c.id === cardId);
                      return card ? (
                        <div key={cardId} className="relative">
                          <CardItem card={card} selected />
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                            onClick={() => handleOfferingToggle(cardId)}
                          >
                            <Minus size={12} />
                          </Button>
                        </div>
                      ) : null;
                    })}
                  </div>
                ) : (
                  <div className="text-center text-slate-500 dark:text-slate-400 py-8">
                    <Plus className="mx-auto mb-2" size={32} />
                    <p>Select cards from your collection</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-2">
                  My Cards
                </h4>
                {loadingUserCards ? (
                  <div className="grid grid-cols-2 gap-2">
                    {[...Array(6)].map((_, i) => (
                      <Skeleton key={i} className="h-24" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {userCards?.map(card => (
                      <CardItem
                        key={card.id}
                        card={card}
                        selected={selectedOffering.includes(card.id)}
                        onSelect={() => handleOfferingToggle(card.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Requesting Section */}
            <div>
              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-4 flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Cards I Want ({selectedReceiving.length})
              </h3>
              
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 mb-4 min-h-[200px]">
                {selectedReceiving.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {selectedReceiving.map(cardId => {
                      const card = allCards?.find(c => c.id === cardId);
                      return card ? (
                        <div key={cardId} className="relative">
                          <CardItem card={card} selected />
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                            onClick={() => handleReceivingToggle(cardId)}
                          >
                            <Minus size={12} />
                          </Button>
                        </div>
                      ) : null;
                    })}
                  </div>
                ) : (
                  <div className="text-center text-slate-500 dark:text-slate-400 py-8">
                    <Search className="mx-auto mb-2" size={32} />
                    <p>Search and select cards you want</p>
                  </div>
                )}
              </div>
              
              <div className="mb-4">
                <Label htmlFor="search">Search Cards</Label>
                <Input
                  id="search"
                  type="text"
                  placeholder="Search for cards..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mt-2"
                />
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {loadingAllCards ? (
                  <div className="grid grid-cols-2 gap-2">
                    {[...Array(6)].map((_, i) => (
                      <Skeleton key={i} className="h-24" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {filteredCards.map(card => (
                      <CardItem
                        key={card.id}
                        card={card}
                        selected={selectedReceiving.includes(card.id)}
                        onSelect={() => handleReceivingToggle(card.id)}
                        showCondition={false}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Errors */}
          {(form.formState.errors.offeringCards || form.formState.errors.receivingCards) && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              {form.formState.errors.offeringCards && (
                <p className="text-red-600 dark:text-red-400 text-sm">
                  {form.formState.errors.offeringCards.message}
                </p>
              )}
              {form.formState.errors.receivingCards && (
                <p className="text-red-600 dark:text-red-400 text-sm">
                  {form.formState.errors.receivingCards.message}
                </p>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createTradeMutation.isPending || selectedOffering.length === 0 || selectedReceiving.length === 0}
            >
              {createTradeMutation.isPending ? "Creating..." : "Create Trade"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
