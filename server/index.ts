// Load environment variables - put this at the very top
import 'dotenv/config';
import * as dotenv from 'dotenv';
// Try to load from multiple locations
dotenv.config();
dotenv.config({ path: '.env.local' });

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { registerRoutes } from "./routes";
import { serveStatic, setupVite, log } from "./vite";

console.log('Database URL detected:', process.env.DATABASE_URL ? 'Yes' : 'No');
console.log('Session Secret detected:', process.env.SESSION_SECRET ? 'Yes' : 'No');

const app = express();

// Common middleware
app.use(cors());
app.use(express.json());

// Routes
async function main() {
  // Setup routes
  const server = await registerRoutes(app);

  // If this is a production build, serve static files
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    // In development, setup Vite middleware
    await setupVite(app, server);
  }

  // Error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({ message: err.message });
  });

  // Start the server
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, "0.0.0.0", () => {
    log(`serving on port ${PORT}`);
  });
}

main().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});