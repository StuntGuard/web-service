import express from "express";
import { authRequire } from "../../../middleware/authRequire.js";
import {
  getChildByHandler,
  postChildHandler,
  deleteChildHandler,
} from "../handlers/childHandler.js";
import upload from "../../../middleware/uploadMulter.js";

const router = express.Router();

router.use(authRequire);

router.get("/", getChildByHandler);
router.post("/", upload.single("image"), postChildHandler);
router.delete("/:id", deleteChildHandler);

export default router;
