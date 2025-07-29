import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, CreditCard, Users, ShieldCheck, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function HowItWorks() {
  const steps = [
    {
      icon: CreditCard,
      title: "Cadastre suas Cartas",
      description: "Adicione suas cartas de trading à sua coleção digital. Fotografe ou selecione de nosso catálogo extenso.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Users,
      title: "Encontre Parceiros",
      description: "Explore o marketplace e encontre outros colecionadores interessados em suas cartas.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: ShieldCheck,
      title: "Negocie com Segurança",
      description: "Use nossa plataforma segura para propor trocas e finalizar transações com confiança.",
      color: "from-purple-500 to-purple-600"
    }
  ];

  const features = [
    "Catálogo completo de cartas",
    "Sistema de avaliação de usuários",
    "Proteção contra fraudes",
    "Rastreamento de envios",
    "Suporte 24/7",
    "Comunidade ativa"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-background dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            Como Funciona o CardTrader
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Descubra como nossa plataforma revoluciona a forma de trocar cartas colecionáveis
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-xl flex items-center justify-center mb-6 mx-auto`}>
                    <step.icon className="text-white" size={32} />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                      {step.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      {step.description}
                    </p>
                  </div>
                  <div className="absolute top-4 right-4 w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                      {index + 1}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid md:grid-cols-2 gap-12 items-center mb-16"
        >
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              Por que escolher o CardTrader?
            </h2>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
                  <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl p-8 text-center">
              <CreditCard className="mx-auto mb-4 text-primary" size={64} />
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                Milhares de Cartas
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Acesso ao maior catálogo de cartas colecionáveis do Brasil
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center bg-gradient-to-r from-primary to-secondary rounded-3xl p-12 text-white"
        >
          <h2 className="text-3xl font-bold mb-4">
            Pronto para começar?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a milhares de colecionadores e comece a trocar hoje mesmo!
          </p>
          <div className="space-x-4">
            <Link href="/">
              <Button size="lg" variant="secondary" className="text-primary">
                Começar Agora
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
                Ver Marketplace
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}