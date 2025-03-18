import "express-async-errors";
import morgan from "morgan";
import express from "express";
import cors from "cors";
import { routeNotFound } from "./middlewares/routeNotFound.middleware.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import { router } from "./routes/index.js";

/** __________ Express Instance __________ */
const app = express();

/** __________ SET PORT __________ */
app.set("port", process.env.PORT || 3000);

/** __________ Middlewares __________ */
app.use(morgan("dev"));
app.use(cors("*"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public"));

/** __________ Testing Route __________ */
app.route("/").get((req, res) => {
  return res.send(
    "<h1 style='display: flex; justify-content: center;  align-items: center; font-size:9rem; margin-top:10rem;'>Server is running.</h1>"
  );
});

/** __________ Routes Setup __________ */
app.use("/api/v1", router);

/** __________ Error Handling Middlewares __________ */
app.use(routeNotFound);
app.use(errorHandler);

export { app };
