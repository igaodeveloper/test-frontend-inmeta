import { motion } from "framer-motion";
import { ArrowUpDown, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CardItem } from "@/components/cards/card-item";
import type { Trade } from "@shared/schema";

interface TradeCardProps {
  trade: Trade;
  onViewDetails?: () => void;
}

export function TradeCard({ trade, onViewDetails }: TradeCardProps) {
  const offeringCards = trade.cards?.filter(tc => tc.type === "OFFERING") || [];
  const receivingCards = trade.cards?.filter(tc => tc.type === "RECEIVING") || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-card rounded-xl shadow-lg border border-slate-200 dark:border-border overflow-hidden hover:shadow-xl transition-all"
    >
      <div className="p-6">
        {/* Trader Info */}
        <div className="flex items-center mb-4">
          <Avatar className="w-10 h-10 mr-3">
            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-semibold">
              {trade.user?.name?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold text-slate-900 dark:text-slate-100">
              {trade.user?.name || "Unknown User"}
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {trade.createdAt ? new Date(trade.createdAt).toLocaleDateString() : "Recently"}
            </div>
          </div>
        </div>

        {/* Trade Details */}
        <div className="space-y-4">
          {/* Offering */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Offering
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {offeringCards.slice(0, 2).map((tradeCard) => (
                <div key={tradeCard.id} className="min-w-0">
                  {tradeCard.card && (
                    <CardItem 
                      card={tradeCard.card} 
                      showCondition={false}
                      className="h-24"
                    />
                  )}
                </div>
              ))}
              {offeringCards.length > 2 && (
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2 flex items-center justify-center text-slate-500 dark:text-slate-400 text-xs">
                  +{offeringCards.length - 2} more
                </div>
              )}
            </div>
          </div>

          {/* Exchange Arrow */}
          <div className="flex justify-center">
            <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
              <ArrowUpDown className="text-slate-500 dark:text-slate-400" size={16} />
            </div>
          </div>

          {/* Requesting */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Requesting
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {receivingCards.slice(0, 2).map((tradeCard) => (
                <div key={tradeCard.id} className="min-w-0">
                  {tradeCard.card && (
                    <CardItem 
                      card={tradeCard.card} 
                      showCondition={false}
                      className="h-24"
                    />
                  )}
                </div>
              ))}
              {receivingCards.length > 2 && (
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2 flex items-center justify-center text-slate-500 dark:text-slate-400 text-xs">
                  +{receivingCards.length - 2} more
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={onViewDetails}
          className="w-full mt-6"
          variant="default"
        >
          <Eye className="mr-2" size={16} />
          View Trade Details
        </Button>
      </div>
    </motion.div>
  );
}
