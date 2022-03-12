import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import hpp from "hpp";
import dataToJson from "data-to-json";
import rateLimit from "express-rate-limit";
import { ethers, utils } from "ethers";
import path from "path";
import { fileURLToPath } from "url";

import sigGenerator from "./scripts/sig-generator.js";

// Defaults
const app = express();
const port = process.env.PORT || 9000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: __dirname + "/../.env" });

// CONSTANTS
const REQ_ETH_BAL = 0.15;

// States
let whitelistAPIStatus = "normal";

// Middlewares: Security ****************************************************
app.use(cors({ origin: ["http://localhost:3000"] })); // Cross-Origin
app.use(helmet()); // Security for HTTP requests
app.use(express.json({ limit: "300kb" })); // Allows JSON but with limit
app.use(hpp()); // Protection against Paramenter Pollution Attacks
app.use(express.urlencoded({ extended: true }));

// Rate limit for /api/whitelist/join route *********************************
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 10, // Limit each IP to 10 requests per `window` (here, per 1 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// The API section **********************************************************
app.post("/api/whitelist/join", apiLimiter, async (req, res) => {
  try {
    const {
      signature: frontendSig,
      address: frontendAddress,
      message,
    } = req.body;
    const PROVIDER = new ethers.providers.JsonRpcProvider(process.env.RPC_LINK);

    // 1. Verify
    const signee = utils.verifyMessage(message, frontendSig);
    if (signee !== frontendAddress) {
      res
        .status(400)
        .json({ status: "failed", message: "Verification failed!" });
      return;
    }

    // 2. Check balance
    const _balance = await PROVIDER.getBalance(frontendAddress);
    const _userBal = ethers.utils.formatEther(_balance);
    const userBal = Number(parseFloat(`${_userBal}`).toFixed(2));
    if (userBal < REQ_ETH_BAL) {
      res.status(400).json({
        status: "failed",
        message: `Balance requirement must be above/equal to ${REQ_ETH_BAL} ETH`,
      });
      return;
    }

    // 3. Ccheck if address already registered

    // 4. Start whitelist process
    // 4.1 Check first if someone is registering, to avoid multiple writes
    if (whitelistAPIStatus !== "normal") {
      res.status(400).json({
        status: "failed",
        message: "Server busy. Please try after a few seconds.",
      });
      return;
    }
    // 4.2  If all is good then proceed
    whitelistAPIStatus = "busy";
    const { address, signature } = await sigGenerator(
      PROVIDER,
      frontendAddress
    );
    if (!address || !signature) {
      whitelistAPIStatus = "normal";
      res.status(400).json({
        status: "failed",
        message: "Something went wrong during the process.",
      });
      return;
    }

    // 5. Save file
    console.log(address, signature);

    // Revert with 1.5sec buffer
    setTimeout(() => {
      whitelistAPIStatus = "normal";
    }, 1500);

    res.status(200).json({ status: "success", message: "NOT YET DONE......" });
  } catch (e) {
    res.status(400).json({ status: "failed", message: e.message });
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
