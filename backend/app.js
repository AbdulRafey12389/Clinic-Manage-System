import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { connectToDatabase, disconnectFromDatabase } from "./src/config/db.js";
import routes from "./src/routes/index.js";

dotenv.config();

connectToDatabase();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/v1", routes);

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

server.on("close", () => disconnectFromDatabase());
