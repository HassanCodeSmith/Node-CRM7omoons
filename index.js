import dotenv from "dotenv";
import https from "https";
import http from "http";
import fs from "fs";

import { app } from "./src/app.js";
import { ConnectDb } from "./src/config/db.config.js";
import { createUser } from "./src/utils/createAdmin.util.js";

/** __________ Dot Env Configuration __________ */
dotenv.config();

/** __________ Server Setup with Clustering __________ */
let server;
if (process.env.NODE_ENV === "PRODUCTION") {
  try {
    const privateKey = fs.readFileSync("./privkey.pem", "utf8");
    const certificate = fs.readFileSync("./fullchain.pem", "utf8");

    const options = {
      key: privateKey,
      cert: certificate,
    };

    server = https.createServer(options, app);
  } catch (err) {
    console.error("Error reading files:", err);
  }
} else {
  server = http.createServer(app);
}

/** __________ Server Listing & DB Connection __________ */
const PORT = process.env.PORT;
(async () => {
  try {
    await ConnectDb();
    server.listen(PORT, () => {
      if (process.env.NODE_ENV === "PRODUCTION") {
        console.log(`Server is running on port ${PORT}`);
      } else {
        console.info(`==> 🌎 Go to http://localhost:${PORT}`);
      }
    });
    await createUser();
  } catch (error) {
    console.error("An error occurred while running server", error);
  }
})();
