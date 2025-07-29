import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Menu, Home, ShoppingBag, HelpCircle, Info, LogIn, UserPlus, Settings, LogOut, CreditCard } from "lucide-react";

interface MobileMenuProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onHelpClick: () => void;
}

export function MobileMenu({ onLoginClick, onRegisterClick, onHelpClick }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const publicNavItems = [
    { href: "/", label: "Início", icon: Home },
    { href: "/marketplace", label: "Marketplace", icon: ShoppingBag },
    { href: "/how-it-works", label: "Como Funciona", icon: HelpCircle },
    { href: "/about", label: "Sobre", icon: Info },
  ];

  const authenticatedNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: Settings },
    { href: "/my-cards", label: "Minhas Cartas", icon: CreditCard },
    { href: "/my-trades", label: "Minhas Trocas", icon: ShoppingBag },
  ];

  const handleNavClick = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <CreditCard className="text-white" size={16} />
            </div>
            <span>CardTrader</span>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-8 space-y-4">
          {/* User Info */}
          {isAuthenticated && user && (
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {user.name}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-2">
            {publicNavItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={handleNavClick}>
                <div className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  location === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}>
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </div>
              </Link>
            ))}

            {isAuthenticated && (
              <>
                <Separator className="my-4" />
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 px-3 py-1">
                  MINHA CONTA
                </div>
                {authenticatedNavItems.map((item) => (
                  <Link key={item.href} href={item.href} onClick={handleNavClick}>
                    <div className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      location === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}>
                      <item.icon size={20} />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                ))}
              </>
            )}
          </nav>

          <Separator className="my-4" />

          {/* Help */}
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              onHelpClick();
              setOpen(false);
            }}
          >
            <HelpCircle className="mr-3" size={20} />
            Central de Ajuda
          </Button>

          {/* Auth Actions */}
          <div className="space-y-2">
            {isAuthenticated ? (
              <Button
                variant="outline"
                className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="mr-3" size={20} />
                Sair
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    onLoginClick();
                    setOpen(false);
                  }}
                >
                  <LogIn className="mr-3" size={20} />
                  Entrar
                </Button>
                <Button
                  className="w-full justify-start"
                  onClick={() => {
                    onRegisterClick();
                    setOpen(false);
                  }}
                >
                  <UserPlus className="mr-3" size={20} />
                  Criar Conta
                </Button>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}