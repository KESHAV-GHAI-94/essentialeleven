# Essential Eleven

**Zero-Budget. Open-Source. Production-Ready.**

## Project Structure (MVC Architecture)
- **/ElevenEssentials**: The **View Layer** (Next.js 14, Tailwind, React).
- **/backend/src/models**: The **Model Layer** (Zod Schemas + Type definitions).
- **/backend/src/controllers**: The **Controller Layer** (Business logic and Orchestration).
- **/backend/src/services**: The **Service Layer** (Direct Data access / Database interaction).
- **/backend/prisma**: Database Infrastructure (Schema & Migrations).

## Running the Project
This project uses **npm workspaces**.

### 1. Initial Setup
Install all dependencies from the root:
```bash
npm install
```

### 2. Database Setup
Go to the `backend` folder to manage your database:
```bash
# Push schema to Supabase
npm run prisma:push
```

### 3. Start Development
Run the frontend server from the root:
```bash
npm run dev:frontend
```
Or navigate to `ElevenEssentials` and run:
```bash
npm run dev
```

## Tech Stack
- **Frontend**: Next.js 14, Zustand, Framer Motion
- **UI**: Tailwind CSS + shadcn/ui (Custom Navy & Saffron Theme)
- **Database**: Supabase PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
