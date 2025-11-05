import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Event } from "../models/event.model.js";

// Create Event
const createEvent = asyncHandler(async (req, res) => {
  const { title, startTime, endTime } = req.body;
  const userId = req.user._id;

  if (!title || !startTime || !endTime) {
    throw new ApiError(400, "Title, start time, and end time are required.");
  }

  const event = await Event.create({
    title: title.trim(),
    startTime,
    endTime,
    user: userId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, event, "Event created successfully."));
});

// Get User Events
const getUserEvents = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const events = await Event.find({ user: userId }).sort({ startTime: 1 });

  if (!events.length) {
    throw new ApiError(404, "No events found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, events, "User events fetched successfully."));
});

// Get Event by ID
const getEventById = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user._id;
  const event = await Event.findOne({ _id: eventId, user: userId });

  if (!event) {
    throw new ApiError(404, "Event not found or user is not owner of event.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, event, "Event fetched successfully."));
});

const getUserSwappableEvents = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const events = await Event.find({ user: userId, status: "SWAPPABLE" }).sort({
    startTime: 1,
  });

  if (!events.length) {
    throw new ApiError(404, "No swappable events found for the user.");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        events,
        "User swappable events fetched successfully."
      )
    );
});

// Update Event Details
const updateEventDetails = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user._id;
  const { title, startTime, endTime } = req.body;

  const updateData = {};
  if (title && title.trim() !== "") updateData.title = title.trim();
  if (startTime) updateData.startTime = startTime;
  if (endTime) updateData.endTime = endTime;

  if (Object.keys(updateData).length === 0) {
    throw new ApiError(400, "At least one valid field is required to update.");
  }

  const event = await Event.findOneAndUpdate(
    { _id: eventId, user: userId },
    { $set: updateData },
    { new: true }
  );

  if (!event) {
    throw new ApiError(404, "Event not found or user is not owner of event.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, event, "Event details updated successfully."));
});

// Update Event Status
const updateEventStatus = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const { status } = req.body;
  const userId = req.user._id;

  if (!["BUSY", "SWAPPABLE"].includes(status)) {
    throw new ApiError(
      400,
      "Invalid status provided. Must be BUSY or SWAPPABLE."
    );
  }

  const event = await Event.findOne({ _id: eventId, user: userId });

  if (!event) {
    throw new ApiError(404, "Event not found or user is not owner of event.");
  }

  if (event.status === "SWAP_PENDING") {
    throw new ApiError(
      400,
      "Cannot change status while the event is SWAP_PENDING."
    );
  }

  event.status = status;
  await event.save();

  return res
    .status(200)
    .json(new ApiResponse(200, event, `Event status updated to ${status}.`));
});

// Delete Event
const deleteEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user._id;

  const event = await Event.findOne({ _id: eventId, user: userId });

  if (!event) {
    throw new ApiError(404, "Event not found or user is not owner of event.");
  }

  if (event.status === "SWAP_PENDING") {
    throw new ApiError(400, "Cannot delete event while it is SWAP_PENDING.");
  }

  await Event.deleteOne({ _id: eventId });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Event deleted successfully."));
});

export {
  createEvent,
  getUserEvents,
  getEventById,
  getUserSwappableEvents,
  updateEventDetails,
  updateEventStatus,
  deleteEvent,
};
