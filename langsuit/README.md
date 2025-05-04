# LangSuit 🌍

An easy way to become a Polyglot - A modern language learning platform built with Next.js.

## Features

- 🎯 Interactive language learning exercises
- 📊 Real-time progress tracking
- 🏆 Leaderboard and achievements system
- 🎓 Multiple language courses
- 💻 Instructor dashboard
- 📱 Mobile-responsive design
- 🔄 Real-time analytics

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Drizzle ORM with PostgreSQL
- Redis Caching
- TailwindCSS
- Clerk Authentication
- React Admin Dashboard
- Recharts for Analytics
- Jest for Testing

## Prerequisites

- Node.js 18+
- PostgreSQL
- Redis (optional, for caching)

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/codegasms/langsuit.git
cd langsuit
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Update the .env file with your credentials:

```env
DATABASE_URL=your_postgres_url
REDIS_URL=your_redis_url
CLERK_SECRET_KEY=your_clerk_key
.
.
.
```

5. Run database migrations:

```bash
npm run db:push
```

6. Seed the database:

```bash
npm run db:seed
```

7. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests
- `npm run test:coverage` - Run tests with coverage
- `npm run db:studio` - Open Drizzle Studio
- `npm run db:push` - Push database changes
- `npm run db:seed` - Seed the database

## Testing

The project uses Jest for testing. Run the test suite with:

```bash
npm run test
```

For coverage report:

```bash
npm run test:coverage
```

Check [package.json](package.json) for more scripts.

## Project Structure

```
langsuit/
├── app/                    # Next.js app directory
│   ├── (dashboard)/       # Dashboard routes
│   ├── (home)/           # Public routes
│   └── api/              # API routes
├── components/            # Reusable components
├── db/                    # Database configuration
├── lib/                   # Utility functions
├── public/               # Static assets
└── tests/                # Test files
```

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email bishwajeet.s22@iiits.in, parth.v22@iiits.in or akshat.m22@iiits.in. Otherwise open an issue in the repository.
