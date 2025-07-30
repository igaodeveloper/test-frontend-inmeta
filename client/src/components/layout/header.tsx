import { useState } from "react";

import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/store/theme";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LoginModal } from "@/components/auth/login-modal";
import { RegisterModal } from "@/components/auth/register-modal";
import { HelpModal } from "@/components/help/help-modal";
import { MobileMenu } from "@/components/navigation/mobile-menu";
import { Moon, Sun, Monitor, ChevronDown, CreditCard, HelpCircle } from "lucide-react";

export function Header() {
  const [location] = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const navItems = [
    { href: "/marketplace", label: "Marketplace" },
    { href: "/how-it-works", label: "Como Funciona" },
    { href: "/about", label: "Sobre" },
  ];

  return (
    <>
      <header className="bg-white dark:bg-card border-b border-slate-200 dark:border-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-4">
              <img
                src="/assets/logo.png"
                alt="CardTrader Logo"
                width={64}
                height={64}
                className="rounded-full"
              />
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                CardTrader
              </span>
            </Link>

            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-medium transition-colors ${
                    location === item.href
                      ? "text-primary"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Auth Section */}
            <div className="flex items-center space-x-4">
              {/* Help Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHelpModal(true)}
                className="flex items-center space-x-1"
              >
                <HelpCircle size={20} />
                <span className="hidden md:inline">Ajuda</span>
              </Button>

              {/* Theme Toggle */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    {theme === "dark" ? <Moon size={20} /> : theme === "light" ? <Sun size={20} /> : <Monitor size={20} />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="mr-2" size={16} />
                    Claro
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="mr-2" size={16} />
                    Escuro
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    <Monitor className="mr-2" size={16} />
                    Sistema
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-sm font-medium">
                          {user?.name?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden md:inline">{user?.name}</span>
                      <ChevronDown size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/my-cards">Minhas Cartas</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/my-trades">Minhas Trocas</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-600">
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowLoginModal(true)}
                    className="font-medium"
                  >
                    Entrar
                  </Button>
                  <Button 
                    onClick={() => setShowRegisterModal(true)}
                    className="font-medium"
                  >
                    Começar
                  </Button>
                </div>
              )}

              {/* Mobile Menu */}
              <MobileMenu
                onLoginClick={() => setShowLoginModal(true)}
                onRegisterClick={() => setShowRegisterModal(true)}
                onHelpClick={() => setShowHelpModal(true)}
              />
            </div>
          </div>
        </div>
      </header>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />

      <HelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />
    </>
  );
}
