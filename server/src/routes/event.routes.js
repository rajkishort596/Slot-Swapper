import { Router } from "express";
// Assuming you have an authentication middleware set up
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createEvent,
  getUserEvents,
  updateEventDetails,
  updateEventStatus,
  deleteEvent,
} from "../controllers/event.controller.js";

const router = Router();

router.use(verifyJWT);

router.post("/", createEvent);

router.get("/", getUserEvents);

router.patch("/:eventId", updateEventDetails);

router.patch("/:eventId/status", updateEventStatus);

router.delete("/:eventId", deleteEvent);

export const eventRouter = router;
