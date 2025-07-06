# MyLittleBank 🏦

A Progressive Web App (PWA) designed for kids to track chores, earn money, and learn financial responsibility. Built with React, Express, and PostgreSQL.

## Features

- **Chore Management**: Create and complete chores with instant payment
- **Goal Setting**: Set savings goals and track progress
- **Balance Tracking**: Real-time balance updates with transaction history
- **Mobile-First**: iOS-style interface optimized for mobile devices
- **PWA Support**: Install on home screen like a native app
- **Undo Functionality**: Reverse recent transactions within 24 hours
- **Complete Reset**: Start fresh with danger zone controls

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Express.js + Node.js
- **Database**: PostgreSQL (Neon)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: TanStack Query
- **ORM**: Drizzle ORM

## Deployment

This app is configured for deployment on Vercel with Neon PostgreSQL. See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed setup instructions.

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   DATABASE_URL=your_postgresql_connection_string
   ```

3. Push database schema:
   ```bash
   npm run db:push
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

## Database Schema

- **users**: User accounts and balances
- **chores**: Available tasks with payment amounts
- **goals**: Savings targets with progress tracking
- **transactions**: Complete audit trail of money movements

## PWA Features

- Custom app icon and splash screen
- Offline-capable with service worker
- Add to home screen functionality
- Native app-like experience on mobile

## License

MIT License - see LICENSE file for details