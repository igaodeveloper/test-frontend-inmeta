# 🔄 Marketplace de Troca de Cartas (Front-End com React + TypeScript)

Este projeto é uma aplicação **front-end SPA** construída como parte de um **desafio técnico para desenvolvedor front-end pleno**.  
A proposta é desenvolver a interface de um **marketplace fictício de cartas colecionáveis**, que permite ao usuário navegar, visualizar cartas disponíveis, gerenciar seu acervo e propor trocas com outros usuários.

Toda a aplicação foi construída **sem back-end e sem banco de dados próprio**, consumindo diretamente uma **API pública real** e mantendo uma arquitetura modular, escalável e com foco em usabilidade e performance.

---

## 🧠 Sobre o projeto

Este projeto simula uma plataforma onde os usuários podem:

- 📦 Visualizar todas as cartas registradas na API
- 🔍 Filtrar e buscar cartas específicas
- ✍️ Cadastrar novas cartas
- ✏️ Editar e remover suas próprias cartas
- 🔁 Criar propostas de troca com outros usuários
- 🗑️ Cancelar trocas existentes
- 🔐 Realizar login e cadastro com Firebase Authentication
- 🛡️ Acessar áreas protegidas dependendo do tipo de usuário (comum ou admin)

Além das funcionalidades principais, o projeto também se destaca por:

- ✅ Feedbacks de ação (toasts)
- 🎯 Skeleton loaders durante carregamento
- 🎨 Dark mode e animações de transição/scroll
- 📱 Totalmente responsivo

---

## 🛠️ Tecnologias Utilizadas

O projeto foi desenvolvido com uma stack moderna e eficiente:

- **React + TypeScript** – Base da aplicação
- **Vite** – Build tool ultrarrápida
- **Tailwind CSS** – Estilização utilitária e responsiva
- **React Router DOM** – Controle de rotas
- **React Query** – Gerenciamento de requisições e cache
- **Zustand** – Estado global simples e escalável
- **Framer Motion + AOS** – Animações visuais
- **React Hook Form + Zod** – Formulários tipados e validados
- **React Toastify** – Notificações
- **React Helmet** – SEO básico (opcional)

---

## 🧭 Como o projeto funciona

A aplicação se comunica diretamente com uma API pública RESTful hospedada em ambiente externo. Toda a manipulação de dados é feita por meio de chamadas HTTP via `fetch`, encapsuladas em **camadas de serviço** organizadas, com cache e estados de loading gerenciados pelo **React Query**.

O projeto é divido em rotas públicas e privadas. Rotas protegidas garantem que apenas usuários autenticados possam realizar certas ações. Há diferenciação entre usuários comuns e administradores para controle de permissões.

---

## 📚 Motivo da escolha do React (sem comparar ou criticar o Vue)

Tanto o **Vue.js** quanto o **React** são bibliotecas modernas, extremamente populares e capazes de entregar aplicações de altíssimo nível. Em termos técnicos, as duas possuem:

- Arquitetura baseada em componentes
- Renderização reativa
- Bom ecossistema de ferramentas
- Curva de aprendizado parecida
- Suporte a TypeScript e modularização

A principal diferença entre elas está no **estilo de sintaxe e abordagem de desenvolvimento**.  
O Vue costuma ser mais direto na hora de construir interfaces, o que pode torná-lo mais prático em alguns cenários. Por outro lado, o React oferece **flexibilidade** e **um ecossistema mais maduro em algumas áreas específicas**, como **gerenciamento de estado** (Zustand, Jotai, Redux), e ferramentas como **React Query**.

**Nesta entrega**, o React foi escolhido por:

1. Familiaridade do desenvolvedor com a stack React + TypeScript
2. Maior sinergia com ferramentas como React Query e Zustand
3. Velocidade de entrega com Vite + Tailwind + Firebase
4. A stack já estar amplamente adotada em grandes times e projetos de produção

**Não há vantagem absoluta entre React e Vue.** A escolha depende da equipe, contexto do projeto e ferramentas disponíveis. Ambas as stacks são igualmente poderosas e eficientes.

---

## ⚙️ Como rodar o projeto

### Pré-requisitos

- Node.js (versão 18 ou superior)
- pnpm (ou npm/yarn, se preferir)

### Passos

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/nome-do-repo.git

# 2. Acesse o projeto
cd nome-do-repo

# 3. Instale as dependências
pnpm install

# 4. Execute o projeto
# Para rodar apenas o frontend em modo de desenvolvimento:
npm run frontend-dev


O projeto estará disponível em: http://localhost:5174/

 src
 ┣ components       → Componentes reutilizáveis
 ┣ pages            → Páginas principais da aplicação
 ┣ services         → Funções de consumo da API
 ┣ hooks            → Hooks personalizados
 ┣ store            → Estado global com Zustand
 ┣ routes           → Rotas públicas e privadas
 ┣ types            → Tipagens TypeScript
 ┣ utils            → Funções auxiliares
 ┣ 📂services         → Funções de consumo da API
 ┣ 📂hooks            → Hooks personalizados
 ┣ 📂store            → Estado global com Zustand
 ┣ 📂routes           → Rotas públicas e privadas
 ┣ 📂types            → Tipagens TypeScript
 ┣ 📂utils            → Funções auxiliares
 ┣ App.tsx           → Componente principal
 ┗ main.tsx          → Bootstrap da aplicação
📡 API Consumida
A API pública utilizada está disponível em:
🔗 https://cards-marketplace-api-2fjj.onrender.com

A integração com a API foi feita de forma completa:

Todas as rotas de cartas e trocas foram utilizadas

Autenticação tratada via Firebase

Estado de carregamento, erro e sucesso com feedback ao usuário

Estrutura modular para fácil manutenção

📌 Conclusão
Este projeto foi arquitetado com foco em clareza, performance, escalabilidade e qualidade visual.
Não apenas cumpre todos os requisitos técnicos do desafio, mas também entrega uma experiência de uso moderna, fluida e visualmente atrativa — sem atalhos.
```
