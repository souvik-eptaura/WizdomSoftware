import http from "http";
import app from "./app";  // <-- import the single app
import 'dotenv/config';

const port = parseInt(process.env.PORT || "5000", 10);
const server = http.createServer(app);

server.listen(port, "0.0.0.0", () => {
  console.log(`Server listening on http://localhost:${port}`);
});