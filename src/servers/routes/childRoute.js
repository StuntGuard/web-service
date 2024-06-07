import express from "express";
import { authRequire } from "../../../middleware/authRequire.js";
import upload from "../../../middleware/uploadMulter.js";
import {
  deleteChildHandler,
  getChildByHandler,
  postChildHandler,
} from "../handlers/childHandler.js";

const router = express.Router();

router.use(authRequire);

router.get("/", getChildByHandler);
router.post("/", upload.single("image"), postChildHandler);
router.delete("/:id", deleteChildHandler);

export default router;
