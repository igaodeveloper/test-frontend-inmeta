import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, Calendar, Package, Palette, ArrowUpDown } from "lucide-react";
import type { Card } from "@shared/schema";

interface CardDetailsModalProps {
  card: Card | null;
  isOpen: boolean;
  onClose: () => void;
  onCreateTrade?: (cardId: string) => void;
}

export function CardDetailsModal({ card, isOpen, onClose, onCreateTrade }: CardDetailsModalProps) {
  if (!card) return null;

  const handleCreateTrade = () => {
    if (onCreateTrade) {
      onCreateTrade(card.id);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {card.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Card Image */}
          <div className="aspect-[3/4] bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
            {card.imageUrl ? (
              <img
                src={card.imageUrl}
                alt={card.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="text-slate-400" size={48} />
              </div>
            )}
          </div>

          {/* Card Details */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Informações da Carta
              </h3>
              <div className="space-y-3">
                {card.set && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400 flex items-center">
                      <Package className="mr-2" size={16} />
                      Set:
                    </span>
                    <Badge variant="secondary">{card.set}</Badge>
                  </div>
                )}

                {card.rarity && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400 flex items-center">
                      <Star className="mr-2" size={16} />
                      Raridade:
                    </span>
                    <Badge variant="outline">{card.rarity}</Badge>
                  </div>
                )}

                {card.category && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400 flex items-center">
                      <Palette className="mr-2" size={16} />
                      Categoria:
                    </span>
                    <Badge>{card.category}</Badge>
                  </div>
                )}

                {card.condition && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400 flex items-center">
                      <Calendar className="mr-2" size={16} />
                      Condição:
                    </span>
                    <Badge variant="outline">{card.condition}</Badge>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Actions */}
            <div className="space-y-3">
              <h4 className="font-medium text-slate-900 dark:text-slate-100">
                Ações
              </h4>
              <div className="flex flex-col space-y-2">
                {onCreateTrade && (
                  <Button
                    onClick={handleCreateTrade}
                    className="flex items-center justify-center space-x-2"
                  >
                    <ArrowUpDown size={16} />
                    <span>Criar Troca com Esta Carta</span>
                  </Button>
                )}
                <Button variant="outline" onClick={onClose}>
                  Fechar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}