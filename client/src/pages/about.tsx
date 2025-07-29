import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Star, Users, Globe, Award, Zap } from "lucide-react";
import { Link } from "wouter";

export default function About() {
  const stats = [
    { label: "Usuários Ativos", value: "50K+", icon: Users },
    { label: "Trocas Realizadas", value: "1M+", icon: Star },
    { label: "Países Atendidos", value: "25+", icon: Globe },
    { label: "Avaliação Média", value: "4.9", icon: Award }
  ];

  const teamValues = [
    {
      icon: Heart,
      title: "Paixão por Coleções",
      description: "Somos colecionadores apaixonados que entendem a emoção de encontrar aquela carta especial."
    },
    {
      icon: Users,
      title: "Comunidade Primeiro",
      description: "Construímos uma plataforma focada em conectar pessoas e criar relacionamentos genuínos."
    },
    {
      icon: Zap,
      title: "Inovação Constante",
      description: "Sempre buscando novas formas de melhorar a experiência de trading para nossos usuários."
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            Sobre o CardTrader
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-8">
            Nascemos da paixão por cartas colecionáveis e da visão de criar o maior marketplace de trading do Brasil
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="text-center border-0 shadow-lg">
                <CardContent className="p-6">
                  <stat.icon className="mx-auto mb-3 text-primary" size={32} />
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid md:grid-cols-2 gap-12 items-center mb-16"
        >
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              Nossa História
            </h2>
            <div className="space-y-4 text-slate-600 dark:text-slate-400">
              <p>
                O CardTrader nasceu em 2023 da frustração de dois colecionadores que enfrentavam dificuldades 
                para encontrar e trocar cartas com outros entusiastas. Percebemos que existia uma necessidade 
                real de uma plataforma confiável e segura.
              </p>
              <p>
                Com backgrounds em tecnologia e uma paixão genuína por cartas colecionáveis, decidimos criar 
                a solução que gostaríamos de usar. Começamos pequeno, focando na experiência do usuário e 
                na construção de uma comunidade sólida.
              </p>
              <p>
                Hoje, somos a maior plataforma de trading de cartas do Brasil, conectando milhares de 
                colecionadores e facilitando milhões de trocas seguras e satisfatórias.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-card p-4 rounded-xl shadow-sm">
                  <Heart className="text-red-500 mb-2" size={24} />
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Paixão</div>
                </div>
                <div className="bg-white dark:bg-card p-4 rounded-xl shadow-sm">
                  <Users className="text-blue-500 mb-2" size={24} />
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Comunidade</div>
                </div>
                <div className="bg-white dark:bg-card p-4 rounded-xl shadow-sm">
                  <Star className="text-yellow-500 mb-2" size={24} />
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Qualidade</div>
                </div>
                <div className="bg-white dark:bg-card p-4 rounded-xl shadow-sm">
                  <Zap className="text-purple-500 mb-2" size={24} />
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Inovação</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-slate-100 mb-12">
            Nossos Valores
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {teamValues.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
              >
                <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                      <value.icon className="text-primary" size={32} />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                      {value.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center bg-gradient-to-r from-primary to-secondary rounded-3xl p-12 text-white"
        >
          <h2 className="text-3xl font-bold mb-6">
            Nossa Missão
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Conectar colecionadores de todo o Brasil através de uma plataforma segura, confiável e inovadora, 
            tornando o trading de cartas uma experiência prazerosa e acessível para todos.
          </p>
          <Link href="/">
            <Button size="lg" variant="secondary" className="text-primary">
              Faça Parte da Comunidade
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}