import path from "path";
import fs from "fs";
import express, { type Express } from "express";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

export function serveStatic(app: Express) {
  // Get current file path and directory in ESM context
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  // Try multiple possible locations for the static files
  const possiblePaths = [
    path.resolve(__dirname, "../public"),
    path.resolve(__dirname, "public"),
    path.resolve(process.cwd(), "dist/public"),
    path.resolve(process.cwd(), "public")
  ];

  console.log("Searching for static files in the following locations:");
  possiblePaths.forEach(p => console.log(" - " + p));

  // Find the first path that exists
  const distPath = possiblePaths.find(p => fs.existsSync(p));

  if (!distPath) {
    console.error("Could not find static files in any of the expected locations");
    throw new Error("Could not find the build directory, make sure to build the client first");
  }

  console.log(`Found static files at: ${distPath}`);

  // Serve static files
  app.use(express.static(distPath));

  // Serve index.html for all other routes (SPA fallback)
  app.use("*", (_req, res) => {
    const indexPath = path.resolve(distPath, "index.html");

    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      console.error(`index.html not found at ${indexPath}`);
      res.status(404).send("Application files not found");
    }
  });
}