import serverless from "serverless-http";
import app from "../server/app";
import { registerRoutes } from "../server/routes";

// Register routes once at init time
await registerRoutes(app);

export default serverless(app);