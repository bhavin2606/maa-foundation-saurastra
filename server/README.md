# Maa Foundation Backend

Express + Prisma backend API for the Maa Foundation donation platform.

## Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Generate Prisma client:
   ```bash
   npm run db:generate
   ```

4. Push database schema:
   ```bash
   npm run db:push
   ```

5. (Optional) Seed the database:
   ```bash
   npm run db:seed
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

The server will run on http://localhost:4000

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/campaigns | Get all campaigns |
| POST | /api/campaigns | Create a campaign |
| GET | /api/campaigns/:id | Get campaign by ID |
| PUT | /api/campaigns/:id | Update campaign |
| DELETE | /api/campaigns/:id | Delete campaign |
| GET | /api/reels | Get all reels |
| POST | /api/reels | Create a reel |
| GET | /api/reels/:id | Get reel by ID |
| PUT | /api/reels/:id | Update reel |
| DELETE | /api/reels/:id | Delete reel |
| GET | /api/donations | Get all donations |
| POST | /api/donations | Create a donation |
| GET | /api/contact | Get all contact queries |
| POST | /api/contact | Submit contact query |
| GET | /api/dashboard | Get dashboard stats |
| GET | /api/health | Health check |

## Environment Variables

Create a `.env` file with:
```
DATABASE_URL="file:./dev.db"
PORT=4000
```

## Moving to a Separate Repository

To make this a standalone repo:
1. Copy the `server/` folder to a new location
2. Initialize git: `git init`
3. Create a new GitHub repo and push
