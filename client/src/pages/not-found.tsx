import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <Card className="w-full max-w-lg mx-auto border-0 shadow-xl">
          <CardContent className="p-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/20 dark:to-red-800/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="h-12 w-12 text-red-500" />
              </div>
              <div className="text-6xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                404
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                Página Não Encontrada
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mb-8">
                A página que você está procurando não existe ou foi movida.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="space-y-4"
            >
              <Link href="/">
                <Button size="lg" className="w-full">
                  <Home className="mr-2" size={20} />
                  Voltar ao Início
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="mr-2" size={20} />
                Voltar à Página Anterior
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
