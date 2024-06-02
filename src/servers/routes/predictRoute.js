import express from "express";
import { authRequire } from "../../../middleware/authRequire.js";
import { modelLoadMiddleware } from "../../../middleware/modelLoad.js";
import { getPredictHandler, postPredictHandler } from "../handlers/predictHandler.js";

const router = express.Router();

router.use(modelLoadMiddleware);
router.use(authRequire);

router.post("/:id", postPredictHandler);
router.get("/:id", getPredictHandler);

export default router;
