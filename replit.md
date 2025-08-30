# Overview

This is a full-stack TypeScript web application built with React (frontend) and Express.js (backend). The application appears to be a professional landing page or business website with a contact form submission system. It uses modern web development practices with a component-based architecture, featuring a sleek UI built with Radix UI components and Tailwind CSS styling. The backend provides API endpoints for handling contact form submissions with proper validation and error handling.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite as the build tool
- **Routing**: File-based routing using Wouter for client-side navigation
- **UI Components**: Radix UI primitives with custom shadcn/ui components for consistent design
- **Styling**: Tailwind CSS with CSS custom properties for theming and dark mode support
- **State Management**: React Hook Form for form handling with Zod validation
- **Data Fetching**: TanStack Query (React Query) for server state management and API requests
- **Build System**: Vite with TypeScript compilation and hot module replacement

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful endpoints with proper HTTP status codes and error handling
- **Request Handling**: Built-in Express middleware for JSON parsing and request logging
- **Storage**: In-memory storage implementation with interface for easy database migration
- **Validation**: Zod schemas for runtime type checking and data validation
- **Development**: Hot reload with tsx and custom logging middleware

## Data Storage
- **Current Implementation**: In-memory storage using Maps for development/testing
- **Database Schema**: Drizzle ORM with PostgreSQL schema definitions ready for production
- **Data Models**: User management and contact submission tracking with proper relationships
- **Migration Ready**: Drizzle configuration prepared for database deployment

## Form Handling & Validation
- **Client-Side**: React Hook Form with Zod resolvers for type-safe form validation
- **Server-Side**: Zod schema validation with detailed error messages
- **User Experience**: Real-time form validation with toast notifications for feedback
- **Data Flow**: Validated submissions stored via API with proper error handling

## Development Environment
- **Hot Reload**: Both client and server support hot reloading for rapid development
- **TypeScript**: Strict type checking across the entire application
- **Path Aliases**: Configured import paths for clean code organization
- **Error Handling**: Runtime error overlay and comprehensive error boundaries

# External Dependencies

## UI & Styling
- **Radix UI**: Accessible component primitives for modals, forms, and interactive elements
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Type-safe component variants

## Data & API Management
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form state management with validation
- **Zod**: Runtime type validation and schema definition
- **Date-fns**: Date manipulation and formatting utilities

## Database & ORM
- **Drizzle ORM**: Type-safe SQL query builder and schema management
- **Drizzle Kit**: Database migration and schema generation tools
- **PostgreSQL**: Target database (Neon Database serverless configuration)

## Development Tools
- **Vite**: Fast build tool with HMR and optimization
- **TypeScript**: Static type checking and modern JavaScript features
- **ESBuild**: Fast JavaScript bundling for production builds
- **Replit Integration**: Development environment plugins and error handling