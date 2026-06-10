# Diaspora-Grid

Diaspora-Grid is a comprehensive Next.js web application designed to empower diaspora communities by providing essential tools and services for welfare, remittances, and rights protection. 

## Features

- **Rooh Network**: A community-driven communication channel.
- **Safar Check**: Pre-departure checks and travel advisory.
- **Hawaala Buster**: Remittance comparison and tracking.
- **Amaanat Shield**: Welfare tracking and financial assistance.
- **Passport SOS**: Emergency SOS system and rights protection timeline.
- **Ujrat Tracker**: Ledger dashboard to keep track of dues and wages.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Setup Prerequisites

- Environment Variables: Copy `.env.example` to `.env.local` and fill in the necessary keys.
- Database: Ensure your SQLite database (`prisma/dev.db`) is set up or run migrations.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Database**: [Prisma ORM](https://www.prisma.io) with SQLite
- **Authentication**: [Auth.js (NextAuth v5)](https://authjs.dev/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com)
