import express from "express";
import helmet from "helmet";
import cors from "cors";
import hpp from "hpp";
import dataToJson from "data-to-json";
import rateLimit from "express-rate-limit";
import { ethers, utils } from "ethers";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 9000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CONSTANTS
const REQ_ETH_BAL = 0.15;

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
    const { signature, address, message, chainName } = req.body;

    // 1. Verify
    const signee = utils.verifyMessage(message, signature);
    if (signee !== address) {
      res.status(400).json({ status: "failed", message: "Does not match!" });
      return;
    }

    // 2. Check balance
    const provider = ethers.getDefaultProvider(chainName.toLowerCase());
    const _balance = await provider.getBalance(address);
    const _userBal = ethers.utils.formatEther(_balance);
    const userBal = Number(parseFloat(`${_userBal}`).toFixed(2));
    if (userBal < REQ_ETH_BAL) {
      res.status(400).json({
        status: "failed",
        message: `Balance requirement must be above/equal to ${REQ_ETH_BAL} ETH`,
      });
      return;
    }

    // 3. Start whitelisting script here
    // 3.1  check if address already registered
    // 3.2  if new then proceed

    // 4. Save to google spreadsheets

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
