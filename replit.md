# CardTrader - Trading Card Marketplace

## Overview

CardTrader is a professional, modern React + TypeScript single-page application (SPA) for a trading card marketplace. The application consumes an external API to provide user authentication, card management, and trading functionality. It features a clean, modular architecture with premium UI/UX, animations, and comprehensive state management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18+ with TypeScript for type safety and modern development
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing with protected routes
- **Styling**: Tailwind CSS with shadcn/ui components for rapid, responsive design
- **State Management**: Zustand for lightweight global state (auth, theme)
- **Data Fetching**: TanStack Query (React Query) for server state management with caching
- **HTTP Client**: Custom API client built on fetch with automatic JWT token handling
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Animations**: Framer Motion for smooth transitions and micro-interactions

### Backend Architecture
- **Server**: Express.js with TypeScript setup (minimal implementation)
- **External API**: Consumes https://cards-marketplace-api-2fjj.onrender.com
- **Database**: Drizzle ORM configured for PostgreSQL (ready for future implementation)
- **Storage**: In-memory storage interface with extensible design

## Key Components

### Authentication System
- JWT-based authentication with persistent token storage
- Protected routes that redirect unauthorized users
- Login/Register modals with form validation
- Automatic token injection in API requests
- User session management with Zustand store

### Card Management
- Display user's card collection with visual card components
- Add new cards to user collection from available cards
- Card filtering and search functionality
- Category-based card organization (Pokemon, Magic, Yu-Gi-Oh, Sports)

### Trading System
- Create trade requests with offering/receiving cards
- View marketplace of open trades from all users
- Delete own trade requests
- Trade status tracking (active, completed, cancelled)

### UI/UX Features
- Dark/light mode toggle with system preference detection
- Responsive design for mobile and desktop
- Skeleton loading states for better perceived performance
- Toast notifications for user feedback
- Smooth animations and transitions throughout

## Data Flow

1. **Authentication Flow**:
   - User logs in → JWT token stored in Zustand → Token automatically included in API requests
   - Protected routes check authentication status before rendering

2. **Data Fetching**:
   - React Query manages all server state with caching and revalidation
   - API client handles HTTP requests with error handling and retries
   - Optimistic updates for better user experience

3. **State Management**:
   - Global state (auth, theme) managed by Zustand stores
   - Server state cached and synchronized by React Query
   - Form state handled locally by React Hook Form

## External Dependencies

### Core Dependencies
- **UI Library**: Radix UI primitives with shadcn/ui components
- **Validation**: Zod for runtime type checking and form validation
- **Date Handling**: date-fns for date manipulation
- **Utilities**: clsx and tailwind-merge for conditional styling

### External API Integration
- **Base URL**: https://cards-marketplace-api-2fjj.onrender.com
- **Key Endpoints**:
  - POST /register - User registration
  - POST /login - User authentication
  - GET /me - User profile data
  - GET /me/cards - User's card collection
  - POST /me/cards - Add cards to collection
  - GET /cards - All available cards
  - GET /trades - All trade requests
  - POST /trades - Create new trade
  - DELETE /trades/:id - Remove trade

### API Resilience
- Automatic retry logic for failed requests
- Intelligent handling of API hibernation (common with free hosting)
- Error boundaries and graceful degradation
- Loading states and user feedback for all operations

## Deployment Strategy

### Development Environment
- Vite dev server with hot module replacement
- TypeScript checking and ESLint integration
- Replit-specific plugins for enhanced development experience

### Production Build
- Vite optimized build with code splitting
- Static asset optimization and bundling
- TypeScript compilation and type checking
- Ready for deployment to Vercel, Netlify, or similar platforms

### Build Commands
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run check` - TypeScript type checking
- `npm run db:push` - Database schema push (when database is added)

### Architecture Benefits
- **Scalability**: Modular component structure allows easy feature additions
- **Performance**: React Query caching reduces API calls and improves UX
- **Maintainability**: Strong TypeScript typing and clean separation of concerns
- **User Experience**: Smooth animations, responsive design, and intuitive interface
- **Reliability**: Comprehensive error handling and resilient API integration