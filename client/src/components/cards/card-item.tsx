import { cn } from "@/lib/utils";
import type { Card } from "@shared/schema";

interface CardItemProps {
  card: Card;
  selected?: boolean;
  onSelect?: () => void;
  className?: string;
  showCondition?: boolean;
  onClick?: () => void;
}

const getCardGradient = (category?: string) => {
  switch (category?.toLowerCase()) {
    case "pokemon":
      return "from-yellow-400 to-red-500";
    case "magic":
      return "from-purple-600 to-blue-600";
    case "yugioh":
    case "yu-gi-oh":
      return "from-orange-500 to-red-600";
    case "sports":
      return "from-green-500 to-teal-600";
    default:
      return "from-blue-500 to-purple-600";
  }
};

const getCardInnerGradient = (category?: string) => {
  switch (category?.toLowerCase()) {
    case "pokemon":
      return "from-blue-400 to-purple-500";
    case "magic":
      return "from-green-400 to-blue-400";
    case "yugioh":
    case "yu-gi-oh":
      return "from-red-400 to-orange-400";
    case "sports":
      return "from-indigo-400 to-purple-400";
    default:
      return "from-pink-400 to-red-400";
  }
};

export function CardItem({ 
  card, 
  selected = false, 
  onSelect, 
  className, 
  showCondition = true,
  onClick 
}: CardItemProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-card rounded-lg border-2 transition-all cursor-pointer",
        selected 
          ? "border-primary shadow-lg scale-105" 
          : "border-slate-200 dark:border-border hover:border-primary/50 hover:scale-102",
        onSelect && "cursor-pointer",
        className
      )}
      onClick={onClick || onSelect}
    >
      <div className="p-3">
        <div className={cn(
          "rounded-lg p-2 mb-3 bg-gradient-to-br",
          getCardGradient(card.category)
        )}>
          <div className="bg-white rounded p-2">
            <div className={cn(
              "h-16 rounded bg-gradient-to-br",
              getCardInnerGradient(card.category)
            )} />
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-1 truncate">
            {card.name}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
            {card.set}
          </p>
          {showCondition && card.condition && (
            <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
              {card.condition}
            </p>
          )}
          {card.rarity && (
            <p className="text-xs text-primary font-medium truncate">
              {card.rarity}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
