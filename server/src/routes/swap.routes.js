import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getSwappableSlots,
  createSwapRequest,
  handleSwapRequest,
  getIncomingSwapRequests,
  getOutgoingSwapRequests,
} from "../controllers/swap.controller.js";

const router = Router();

// All routes require authentication
router.use(verifyJWT);

router.get("/swappable-slots", getSwappableSlots);

router.post("/swap-request", createSwapRequest);

router.post("/swap-response/:requestId", handleSwapRequest);

router.get("/incoming", getIncomingSwapRequests);

router.get("/outgoing", getOutgoingSwapRequests);

export default router;
