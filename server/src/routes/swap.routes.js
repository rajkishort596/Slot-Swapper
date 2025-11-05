import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getSwappableSlots,
  createSwapRequest,
  handleSwapRequest,
} from "../controllers/swap.controller.js";

const router = Router();

// All routes require authentication
router.use(verifyJWT);

router.get("/swappable-slots", getSwappableSlots);

router.post("/swap-request", createSwapRequest);

router.post("/swap-response/:requestId", handleSwapRequest);

export default router;
