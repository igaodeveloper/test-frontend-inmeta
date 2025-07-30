import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { HelpCircle, Send, Book, MessageCircle, Shield, Star } from "lucide-react";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const { toast } = useToast();

  const faqs = [
    {
      question: "Como adiciono cartas à minha coleção?",
      answer: "Vá ao Dashboard e clique em 'Adicionar Cartas' ou use o botão 'Adicionar Sua Primeira Carta' para começar. Você pode pesquisar e selecionar cartas do nosso catálogo extenso."
    },
    {
      question: "Como criar uma proposta de troca?",
      answer: "No Dashboard, clique em 'Criar Nova Troca'. Selecione as cartas que deseja oferecer e as cartas que gostaria de receber. Sua proposta aparecerá no Marketplace para outros usuários."
    },
    {
      question: "É seguro trocar cartas online?",
      answer: "Sim! Temos sistema de avaliações, proteção contra fraudes e suporte 24/7. Sempre verifique a reputação do vendedor antes de finalizar uma troca."
    },
    {
      question: "Como funciona o envio das cartas?",
      answer: "Após acordar uma troca, vocês combinam os detalhes do envio. Recomendamos usar correios com rastreamento e seguro para cartas valiosas."
    },
    {
      question: "Posso cancelar uma troca?",
      answer: "Sim, você pode cancelar suas próprias propostas de troca a qualquer momento através do seu Dashboard em 'Minhas Trocas'."
    },
    {
      question: "Como posso melhorar minha reputação?",
      answer: "Complete trocas honestamente, responda rapidamente às mensagens e mantenha suas cartas bem conservadas. Usuários satisfeitos deixarão avaliações positivas."
    }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome, email e mensagem.",
        variant: "destructive"
      });
      return;
    }

    // Simulate sending message
    toast({
      title: "Mensagem enviada!",
      description: "Retornaremos em até 24 horas.",
    });
    
    setContactForm({ name: "", email: "", subject: "", message: "" });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <HelpCircle className="text-primary" size={24} />
            <span>Central de Ajuda</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="faq" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Perguntas Frequentes</h3>
              {faqs.map((faq, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
                    {faq.question}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}