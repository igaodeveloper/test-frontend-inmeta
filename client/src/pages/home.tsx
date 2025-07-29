import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { TradeCard } from "@/components/trades/trade-card";
import { CardSkeleton } from "@/components/ui/loading-skeleton";
import { LoginModal } from "@/components/auth/login-modal";
import { RegisterModal } from "@/components/auth/register-modal";
import { ArrowRight, TrendingUp, Users, Shield, Star } from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Fetch recent trades for preview
  const { data: trades, isLoading: tradesLoading } = useQuery({
    queryKey: ["/trades"],
    queryFn: () => apiClient.getTrades(),
  });

  const stats = [
    { label: "Active Traders", value: "10K+", icon: Users },
    { label: "Cards Available", value: "50K+", icon: TrendingUp },
    { label: "Trades Completed", value: "25K+", icon: Shield },
    { label: "Satisfaction Rate", value: "99.9%", icon: Star },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-white dark:via-background to-secondary/5 dark:to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 dark:text-slate-100 leading-tight mb-6">
                Trade Your Cards
                <span className="text-primary block">Seamlessly</span>
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                Join the premier marketplace for trading cards. Connect with collectors worldwide, 
                discover rare cards, and make perfect trades with our secure platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <Button asChild size="lg" className="text-lg">
                    <Link href="/dashboard">
                      Go to Dashboard
                      <ArrowRight className="ml-2" size={20} />
                    </Link>
                  </Button>
                ) : (
                  <Button 
                    size="lg" 
                    className="text-lg"
                    onClick={() => setShowRegisterModal(true)}
                  >
                    Start Trading Now
                    <ArrowRight className="ml-2" size={20} />
                  </Button>
                )}
                <Button variant="outline" size="lg" className="text-lg" asChild>
                  <Link href="/marketplace">View Marketplace</Link>
                </Button>
              </div>
            </motion.div>
            
            {/* Hero Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4 transform rotate-3">
                {/* Pokemon card mockup */}
                <motion.div
                  whileHover={{ rotate: 0, scale: 1.05 }}
                  className="bg-gradient-to-br from-yellow-400 to-red-500 rounded-xl p-4 shadow-xl transform -rotate-6 transition-transform"
                >
                  <div className="bg-white rounded-lg p-3 mb-3">
                    <div className="h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg"></div>
                  </div>
                  <h3 className="text-white font-bold text-sm mb-1">Charizard</h3>
                  <p className="text-yellow-100 text-xs">Base Set</p>
                </motion.div>
                
                {/* Magic card mockup */}
                <motion.div
                  whileHover={{ rotate: 6, scale: 1.05 }}
                  className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-4 shadow-xl transform rotate-12 transition-transform"
                >
                  <div className="bg-white rounded-lg p-3 mb-3">
                    <div className="h-24 bg-gradient-to-br from-green-400 to-blue-400 rounded-lg"></div>
                  </div>
                  <h3 className="text-white font-bold text-sm mb-1">Black Lotus</h3>
                  <p className="text-purple-100 text-xs">Alpha</p>
                </motion.div>
                
                {/* Yu-Gi-Oh card mockup */}
                <motion.div
                  whileHover={{ rotate: 3, scale: 1.05 }}
                  className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-4 shadow-xl transform rotate-6 transition-transform"
                >
                  <div className="bg-white rounded-lg p-3 mb-3">
                    <div className="h-24 bg-gradient-to-br from-red-400 to-orange-400 rounded-lg"></div>
                  </div>
                  <h3 className="text-white font-bold text-sm mb-1">Blue-Eyes</h3>
                  <p className="text-orange-100 text-xs">LOB-001</p>
                </motion.div>
                
                {/* Sports card mockup */}
                <motion.div
                  whileHover={{ rotate: -6, scale: 1.05 }}
                  className="bg-gradient-to-br from-green-500 to-teal-600 rounded-xl p-4 shadow-xl transform -rotate-12 transition-transform"
                >
                  <div className="bg-white rounded-lg p-3 mb-3">
                    <div className="h-24 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-lg"></div>
                  </div>
                  <h3 className="text-white font-bold text-sm mb-1">Jordan RC</h3>
                  <p className="text-green-100 text-xs">1986 Fleer</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white dark:bg-background py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center"
              >
                <stat.icon className="text-primary mb-2" size={32} />
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-slate-600 dark:text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Trades Section */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4"
            >
              Active Trade Requests
            </motion.h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Browse through current trade requests from collectors around the world
            </p>
          </div>

          {tradesLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {trades?.slice(0, 6).map((trade) => (
                <TradeCard key={trade.id} trade={trade} />
              ))}
            </div>
          )}

          <div className="text-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/marketplace">
                View All Trades
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Modals */}
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
    </div>
  );
}
