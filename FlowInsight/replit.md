# Overview

AI Workflow Auditor is a full-stack web application that analyzes productivity across digital tools like Slack, Gmail, Google Drive, Notion, and Asana. The system provides AI-powered insights, efficiency scoring, and actionable recommendations to optimize user workflows. Built with React frontend, Express.js backend, and PostgreSQL database with Drizzle ORM.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client uses React 18 with TypeScript, built with Vite for development and bundling. The UI is built with shadcn/ui components and Radix UI primitives, styled with Tailwind CSS. State management is handled through TanStack React Query for server state and React hooks for local state. The routing is implemented using Wouter for a lightweight solution.

## Backend Architecture
The server runs on Express.js with TypeScript support via tsx. The API follows RESTful conventions with dedicated routes for authentication, dashboard data, integrations, and analytics. The system uses a service-oriented architecture with separate services for integration management and analytics processing. Session management is implemented using express-session with PostgreSQL storage.

## Authentication System
Authentication is handled through Replit's OAuth system using OpenID Connect. The system maintains user sessions in the database and implements middleware for protected routes. User authentication state is managed on the frontend through React Query with automatic retry and error handling.

## Database Design
The system uses PostgreSQL as the primary database with Drizzle ORM for type-safe database operations. The schema includes:
- Users table for authentication data
- Sessions table for session storage
- Integrations table for OAuth connections to third-party services
- Efficiency metrics for tracking user performance scores
- Quick wins for actionable recommendations
- Usage analytics for platform-specific insights
- Activity logs for audit trails

## Integration Architecture
The system connects to external platforms through OAuth 2.0 flows. Each integration stores access tokens, refresh tokens, and platform-specific metadata. A service layer abstracts the different API interactions and provides a unified interface for data synchronization across platforms.

## Analytics Engine
The analytics service calculates efficiency scores based on integration activity, generates quick wins recommendations, and tracks usage patterns across connected platforms. The system processes data asynchronously and stores computed metrics for dashboard display.

## Development Workflow
The project uses a monorepo structure with shared types and schemas. Hot reloading is enabled in development through Vite's HMR. The build process outputs a production bundle with the frontend assets served statically by Express.

# External Dependencies

## Database
- **Neon PostgreSQL**: Serverless PostgreSQL database for production
- **Drizzle ORM**: Type-safe database operations and migrations
- **connect-pg-simple**: PostgreSQL session store

## Authentication
- **Replit OAuth**: OpenID Connect authentication provider
- **Passport.js**: Authentication middleware
- **openid-client**: OAuth client implementation

## Frontend Libraries
- **React 18**: UI framework with hooks and concurrent features  
- **TanStack React Query**: Server state management and caching
- **Wouter**: Lightweight client-side routing
- **shadcn/ui**: Component library built on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework

## Backend Services
- **Express.js**: Web application framework
- **WebSocket**: Real-time communication support via ws package
- **Session Management**: Secure session handling with express-session

## Third-party Integrations
- **Slack API**: Workspace messaging and collaboration data
- **Gmail API**: Email communication analytics
- **Google Drive API**: File organization and sharing insights
- **Notion API**: Workspace and content management data
- **Asana API**: Task and project management metrics

## Development Tools
- **Vite**: Frontend build tool and development server
- **TypeScript**: Type safety across frontend and backend
- **esbuild**: Fast JavaScript bundler for production builds
- **Replit Development**: Integrated development environment features