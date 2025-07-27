# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server at http://localhost:3000
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables
- `NEXT_PUBLIC_API_URL` - API base URL (default: http://localhost:3001)
- `MAINTENANCE_MODE` - Set to 'true' to enable maintenance mode

## Architecture

### Stack
- **Next.js 15.2.3** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **next-intl** - Internationalization (English/Korean)
- **Zustand** - State management
- **FontAwesome** - Icons
- **GSAP** - Animations

### Key Patterns

#### Authentication
- Uses Zustand store (`src/store/authStore.ts`) for user state
- JWT tokens stored in cookies for SSR compatibility
- User data persisted to localStorage
- Protected routes using `ProtectedRoute` component

#### Internationalization
- English/Korean support via next-intl
- Messages in `messages/en.json` and `messages/ko.json`
- Locale detection from cookies (`NEXT_LOCALE`)
- Translation hooks: `useTranslations('namespace')`

#### API Communication
- Service layer in `src/services/` for API calls
- Centralized error handling with `handleResponse` utility
- Retry logic available via `fetchWithRetry` utility
- TypeScript interfaces for all API responses

#### State Management
- Zustand stores for global state (auth, password, video)
- Local component state for UI interactions
- Persistent auth state with cookie/localStorage hybrid

#### Layout & Navigation
- `ClientLayout` provides header, bottom navigation, and slide menu
- Conditional navigation based on authentication status
- Route-based active states for navigation items
- Maintenance mode support via environment variable

### Project Structure
- `/src/app/` - Next.js App Router pages
- `/src/components/` - Reusable React components organized by feature
- `/src/services/` - API communication layer
- `/src/store/` - Zustand state stores
- `/src/utils/` - Utility functions
- `/src/types/` - TypeScript type definitions
- `/messages/` - Internationalization JSON files

### Special Features
- Maintenance mode: Set `MAINTENANCE_MODE=true` to redirect all users to maintenance page
- Image optimization for CloudFront and S3 domains
- Responsive design with mobile-first approach
- Dark theme optimized (black background)