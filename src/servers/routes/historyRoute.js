import express from "express";
import { getHistoryHandler } from "../handlers/historyHandler.js";
import { authRequire } from "../../../middleware/authRequire.js";

const router = express.Router();

router.use(authRequire);

router.get("/:id", getHistoryHandler);

export default router;
