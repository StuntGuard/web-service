import express from "express";
import { authRequire } from "../../../middleware/authRequire.js";
import {
  deleteMissionHandler,
  getAllMissionsHandler,
  // getMissionByIdHandler,
  postMissionHandler,
  // updateMissionHandler,
} from "../handlers/missionHandler.js";

const router = express.Router();

router.use(authRequire);

router.get("/:id", getAllMissionsHandler);
router.post("/:id", postMissionHandler);
// router.get("/:id", getMissionByIdHandler);
// router.put("/:id", updateMissionHandler);
router.delete("/:id", deleteMissionHandler);

export default router;
