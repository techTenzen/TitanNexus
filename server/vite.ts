import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { nanoid } from "nanoid";

// Get current file path and directory in ESM context
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true,
  };

  // Import vite config dynamically to avoid issues with ESM
  const viteConfigModule = await import("../vite.config.js");
  const viteConfig = viteConfigModule.default;

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
          __dirname,
          "..",
          "client",
          "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
          `src="/src/main.tsx"`,
          `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  // Try multiple possible locations for the static files
  const possiblePaths = [
    path.resolve(__dirname, "../public"),
    path.resolve(__dirname, "public"),
    path.resolve(process.cwd(), "dist/public"),
    path.resolve(process.cwd(), "public"),
    path.resolve(process.cwd(), "dist/client"),
    path.resolve(__dirname, "../client")
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