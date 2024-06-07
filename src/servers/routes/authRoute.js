import express from "express";
import { signInHandler, signUpHandler } from "../handlers/authHandler.js";

const router = express.Router();

router.post("/sign-in", signInHandler);
router.post("/sign-up", signUpHandler);

export default router;
