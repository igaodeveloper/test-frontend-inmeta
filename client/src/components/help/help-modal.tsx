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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="guides">Guias</TabsTrigger>
            <TabsTrigger value="contact">Contato</TabsTrigger>
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

          <TabsContent value="guides" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-6 text-center">
                <Book className="mx-auto mb-4 text-blue-500" size={48} />
                <h3 className="font-semibold mb-2">Guia do Iniciante</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Aprenda os primeiros passos para começar a trocar cartas
                </p>
                <Button variant="outline" size="sm">Ver Guia</Button>
              </div>
              
              <div className="border rounded-lg p-6 text-center">
                <Shield className="mx-auto mb-4 text-green-500" size={48} />
                <h3 className="font-semibold mb-2">Segurança</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Dicas para trocar com segurança e evitar golpes
                </p>
                <Button variant="outline" size="sm">Ver Dicas</Button>
              </div>
              
              <div className="border rounded-lg p-6 text-center">
                <Star className="mx-auto mb-4 text-yellow-500" size={48} />
                <h3 className="font-semibold mb-2">Avaliações</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Como avaliar e ser avaliado por outros usuários
                </p>
                <Button variant="outline" size="sm">Ver Como</Button>
              </div>
              
              <div className="border rounded-lg p-6 text-center">
                <MessageCircle className="mx-auto mb-4 text-purple-500" size={48} />
                <h3 className="font-semibold mb-2">Comunicação</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Melhores práticas para negociar trocas
                </p>
                <Button variant="outline" size="sm">Ver Práticas</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nome *</label>
                <Input
                  value={contactForm.name}
                  onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Seu nome completo"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <Input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="seu@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Assunto</label>
                <Input
                  value={contactForm.subject}
                  onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Assunto da sua mensagem"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Mensagem *</label>
                <Textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Descreva sua dúvida ou problema..."
                  rows={4}
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit" className="flex items-center space-x-2">
                  <Send size={16} />
                  <span>Enviar Mensagem</span>
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}