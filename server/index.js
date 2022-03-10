import express from "express";
import helmet from "helmet";
import cors from "cors";
import hpp from "hpp";
import JFile from "jfile";
import dataToJson from "data-to-json";
import rateLimit from "express-rate-limit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 9000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares: Security ****************************************************
app.use(cors({ origin: ["http://localhost:3000"] })); // Cross-Origin
app.use(helmet()); // Security for HTTP requests
app.use(express.json({ limit: "300kb" })); // Allows JSON but with limit
app.use(hpp()); // Protection against Paramenter Pollution Attacks
app.use(express.urlencoded({ extended: true }));

// Rate limit for /api/whitelist/join route *********************************
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// The API section **********************************************************
app.post("/api/whitelist/join", apiLimiter, async (req, res) => {
  try {
    const { signature, address, message } = req.body;
    const csvFilePath = path.join(
      __dirname,
      "./../server",
      "registered-wallets.csv"
    );

    // Check if file exists
    await fs.access(csvFilePath, fs.F_OK, async (err) => {
      // No file exist yet
      if (err) {
        const genesisContent = `address,message,signature\r\n${address},"${message}",${signature}\r\n`;
        fs.writeFile(csvFilePath, genesisContent, "utf-8", (err) => {
          if (err) {
            console.error(err);
            return;
          }
        });

        res
          .status(200)
          .json({ status: "success", message: "Wallet Registered!" });
        return;
      }

      // If file .csv already exist
      // Check first if user have previously registered
      const jfile = new JFile(csvFilePath);
      const result = jfile.grep(address);
      if (result.length > 0) {
        res
          .status(400)
          .json({ status: "failed", message: "Already registered!" });
        return;
      }

      // File exists, and user is not registered yet, just append to it
      const newContent = `${address},"${message}",${signature}\r\n`;
      await fs.appendFileSync(csvFilePath, newContent, "utf-8");
      res
        .status(200)
        .json({ status: "success", message: "Wallet Registered!" });
    });
  } catch (e) {
    res.status(400).json({ status: "failed", message: e.message });
  }
});

app.get("/api/whitelisted", async (req, res) => {
  try {
    const dataInJSON = dataToJson
      .csv({ filePath: "./registered-wallets.csv" })
      .toJson();
    const finalData = dataInJSON.shift();

    res.status(200).json({ status: "success", whitelisted: dataInJSON });
  } catch (e) {
    res
      .status(400)
      .json({ status: "failed", message: "No registered users yet!" });
  }
});

// The static section *******************************************************
app.use(express.static(path.join(__dirname, "./../frontend", "build")));
app.get("*", function (_, res) {
  res.sendFile(
    path.join(__dirname, "./../frontend", "build", "index.html"),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
});

// Aoo **********************************************************************
app.listen(port, () => console.log(`Listening on port ${port}`));
export default app;
