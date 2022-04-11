import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import { ethers, utils } from "ethers";
import path from "path";
import { fileURLToPath } from "url";

// For generating whitelist
import sigGenerator from "./scripts/sig-generator.js";

// Airtable API
import {
  ATCreate,
  ATCheckIfExist,
  ATGetAllRecords,
} from "./utils/airtable/api.js";

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

    // 3. Check first if someone is registering, to avoid multiple writes
    if (whitelistAPIStatus !== "normal") {
      res.status(400).json({
        status: "failed",
        message: "Server busy. Please try after a few seconds.",
      });
      return;
    }

    // 4. Set to busy
    whitelistAPIStatus = "busy";

    // 5. Check first if address already registered previously
    const _records = await ATCheckIfExist(frontendAddress);
    if (_records.length > 0) {
      whitelistAPIStatus = "normal";
      res.status(400).json({
        status: "failed",
        message: "Already registered",
      });
      return;
    }

    // 6. Start whitelist process
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

    // 7. Save to Airtable
    const { status: _s, message: _m } = await ATCreate({ address, signature });
    if (_s !== "success") {
      whitelistAPIStatus = "normal";
      res.status(400).json({ status: "failed", message: _m });
      return;
    }

    // 8. Revert with 1.5sec buffer
    setTimeout(() => {
      whitelistAPIStatus = "normal";
    }, 1500);

    res
      .status(200)
      .json({ status: "success", message: "Successfully Registered!" });
  } catch (e) {
    console.log(e);
    res.status(400).json({ status: "failed", message: e.message });
  }
});

app.get("/api/whitelisted/all", async (req, res) => {
  const _records = await ATGetAllRecords();
  res.status(200).json({ whitelisted: _records });
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
