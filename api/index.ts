export const config = { runtime: "nodejs22.x" };

import serverless from "serverless-http";
import app from "../server/app";
import { registerRoutes } from "../server/routes";

await registerRoutes(app);
export default serverless(app);