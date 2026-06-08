# Maa Foundation Backend

Express + TypeScript + Prisma API for the Maa Foundation donation platform, optimized for high-performance PostgreSQL databases and serverless hosting on Vercel.

---

## 🚀 Local Development Setup

### 1. Start the PostgreSQL Database
We have provided a `docker-compose.yml` file in the workspace root. To start your dedicated database locally:
```bash
# From the project root directory
docker compose up -d
```
This launches a PostgreSQL container mapped to port `5433` with data persistence.

### 2. Configure Environment Variables
Create or update your `.env` file in the `server` directory:
```env
DATABASE_URL="postgresql://myuser:mypassword@localhost:5433/maa_foundation?schema=public"
PORT=4000
JWT_SECRET="your-admin-secret-key"

# Email Configuration (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=465
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Payment Gateways (Razorpay)
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="your_razorpay_secret"

# Media Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
CLOUDINARY_FOLDER="maa_foundation_assets"
```

### 3. Install & Initialize
Navigate to the `server` directory and run:
```bash
cd server
npm install
```

### 4. Push Schema & Seed Data
Push the database schema directly to PostgreSQL and run the seeding script:
```bash
# Generate the Prisma Client
npm run db:generate

# Sync schema with PostgreSQL database
npm run db:push

# Populate database with initial campaigns, reels, and admin user
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
```
The server will boot instantly on `http://localhost:4000`. You can access interactive Swagger API documentation at `http://localhost:4000/api-docs`.

---

## ⚡ Deployment to Vercel (24/7 Serverless)

This backend is 100% configured for serverless hosting on Vercel, ensuring **zero costs** and **no sleeping instances**.

### Step 1: Set up a Hosted PostgreSQL Database
Choose a serverless/hosted PostgreSQL provider:
* **Supabase** (Free Tier available)
* **Neon DB** (Free Tier available)
* **Railway** (High performance)

Create a database and copy the **connection string**.

### Step 2: Deploy to Vercel
1. Install Vercel CLI or import your repository directly on the [Vercel Dashboard](https://vercel.com).
2. Create a new project on Vercel and set the Root Directory to `server/`.
3. Add the required Environment Variables in the Vercel Dashboard (especially your production `DATABASE_URL`, `CLOUDINARY_*`, `RAZORPAY_*`, etc.).
4. Click **Deploy**. Vercel will automatically compile the TypeScript on-the-fly and route all endpoints under `https://your-vercel-domain.vercel.app/api/*`.

---

## 🛠️ API Architecture & Structure

The codebase is built following a clean **Controller-Service-Repository** pattern:

* **`/src/routes/`**: Defines API entry endpoints.
* **`/src/controllers/`**: Receives requests, handles HTTP validation, and formats responses.
* **`/src/services/`**: Implements core business logic (e.g., Razorpay orders, Cloudinary file uploads, PDF receipt creation).
* **`/src/lib/`**: Hosts library clients like the Prisma database connection, Nodemailer transporter, and Logger.
* **`/prisma/`**: Defines the database schema models and database seeds.
