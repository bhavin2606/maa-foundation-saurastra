# Foundation Project

This is the Foundation project, refactored into a clean separation of concerns with independent frontend and backend modules.

## Project Structure

```
foundation/
├── client/          # Next.js frontend application
├── server/          # Node.js/Express backend API (MVC architecture)
└── README.md        # Project overview
```

## Prerequisites

- Node.js (v18+)
- npm or yarn

## Getting Started

### 1. Backend (Server)

The backend uses Node.js, Express, and Prisma.

```bash
cd server
npm install
npm run dev
```

The server will run on `http://localhost:4000`.

### 2. Frontend (Client)

The frontend uses Next.js and RTK Query.

```bash
cd client
npm install
npm run dev
```

The frontend will run on `http://localhost:3000`.

## Architecture

- **Client**: Built with Next.js 16 (App Router), Redux Toolkit, and Tailwind CSS.
- **Server**: Built with Express.js, following a Model-Controller-Service-Route architecture for scalability.
- **Database**: Integrated with Prisma ORM (SQLite for development).

## Features

- Campaign Management
- Donation Processing
- Reel Management
- Dashboard Analytics
- Contact Query Management
