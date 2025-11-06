import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Event } from "../models/event.model.js";
import { SwapRequest } from "../models/swaprequest.model.js";

const validateAndGetSlot = async (slotId, currentUserId, expectedStatus) => {
  if (!mongoose.Types.ObjectId.isValid(slotId)) {
    throw new ApiError(400, "Invalid slot ID format.");
  }

  const slot = await Event.findById(slotId);

  if (!slot) {
    throw new ApiError(404, "Slot not found.");
  }

  if (slot.status !== expectedStatus) {
    throw new ApiError(
      400,
      `Slot is not currently ${expectedStatus}. Status: ${slot.status}`
    );
  }

  const isOwner = slot.user.equals(currentUserId);

  return { slot, isOwner };
};

const getSwappableSlots = asyncHandler(async (req, res) => {
  const currentUserId = req.user._id;

  //Events that are SWAPPABLE and not owned by user
  const swappableSlots = await Event.find({
    status: "SWAPPABLE",
    user: { $ne: currentUserId },
  }).populate("user", "name email");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        swappableSlots,
        "Successfully fetched swappable slots."
      )
    );
});

const createSwapRequest = asyncHandler(async (req, res) => {
  const { mySlotId, theirSlotId } = req.body;
  const offeringUserId = req.user._id; // The user initiating the swap

  // --- Transaction Start ---
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Validate the user's slot (must be owned by me and SWAPPABLE)
    const mySlotCheck = await validateAndGetSlot(
      mySlotId,
      offeringUserId,
      "SWAPPABLE"
    );
    if (!mySlotCheck.isOwner) {
      throw new ApiError(403, "The slot you are offering is not owned by you.");
    }
    const mySlot = mySlotCheck.slot;

    // 2. Validate the desired slot (must be owned by someone else and SWAPPABLE)
    const theirSlotCheck = await validateAndGetSlot(
      theirSlotId,
      offeringUserId,
      "SWAPPABLE"
    );
    if (theirSlotCheck.isOwner) {
      throw new ApiError(400, "Cannot request a swap for your own slot.");
    }
    const theirSlot = theirSlotCheck.slot;
    const receivingUserId = theirSlot.user;

    // 3. Check for existing PENDING request (optional but recommended for UX)
    const existingRequest = await SwapRequest.findOne({
      $or: [
        {
          offeringSlot: mySlotId,
          requestingSlot: theirSlotId,
          status: "PENDING",
        },
        {
          offeringSlot: theirSlotId,
          requestingSlot: mySlotId,
          status: "PENDING",
        },
      ],
    });
    if (existingRequest) {
      throw new ApiError(
        400,
        "A PENDING swap request already exists for these slots."
      );
    }

    // 4. Create the SwapRequest
    const swapRequest = await SwapRequest.create(
      [
        {
          offeringUser: offeringUserId,
          offeringSlot: mySlotId,
          receivingUser: receivingUserId,
          requestingSlot: theirSlotId,
          status: "PENDING",
        },
      ],
      { session }
    );

    // 5. Update the status of both events to SWAP_PENDING
    await Event.updateMany(
      { _id: { $in: [mySlotId, theirSlotId] } },
      { status: "SWAP_PENDING" },
      { session }
    );

    await session.commitTransaction();

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          swapRequest[0],
          "Swap request created successfully and slots locked."
        )
      );
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

const handleSwapRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  const { accepted } = req.body; // true for accept, false for reject
  const currentUserId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(requestId)) {
    throw new ApiError(400, "Invalid request ID format.");
  }

  // 1. Find the request
  const swapRequest = await SwapRequest.findById(requestId);

  if (!swapRequest) {
    throw new ApiError(404, "Swap request not found.");
  }

  // 2. Authorization Check: Only the receivingUser can respond
  if (!swapRequest.receivingUser.equals(currentUserId)) {
    throw new ApiError(
      403,
      "You are not authorized to respond to this request."
    );
  }

  // 3. Status Check: Must be PENDING to be acted upon
  if (swapRequest.status !== "PENDING") {
    throw new ApiError(400, `Request has already been ${swapRequest.status}.`);
  }

  // --- Transaction Start ---
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const offeringSlotId = swapRequest.offeringSlot;
    const requestingSlotId = swapRequest.requestingSlot;
    const slotsToUpdate = [offeringSlotId, requestingSlotId];

    if (accepted) {
      // 4. Set new status to ACCEPTED
      swapRequest.status = "ACCEPTED";
      await swapRequest.save({ session });

      // 5. Swap the ownership (user field) and set status to BUSY for both slots

      // A. Update the OFFERING slot: new owner is the receiving user
      await Event.findByIdAndUpdate(
        offeringSlotId,
        {
          user: swapRequest.receivingUser, // New owner of offering slot
          status: "BUSY",
        },
        { session }
      );

      // B. Update the REQUESTING slot: new owner is the offering user
      await Event.findByIdAndUpdate(
        requestingSlotId,
        {
          user: swapRequest.offeringUser, // New owner of requested slot
          status: "BUSY",
        },
        { session }
      );

      await session.commitTransaction();
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            swapRequest,
            "Swap request accepted. Slots exchanged and marked BUSY."
          )
        );
    } else {
      // 4. Set new status to REJECTED
      swapRequest.status = "REJECTED";
      await swapRequest.save({ session });

      // 5. Reset both slots' status back to SWAPPABLE
      await Event.updateMany(
        { _id: { $in: slotsToUpdate } },
        { status: "SWAPPABLE" },
        { session }
      );

      await session.commitTransaction();
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            swapRequest,
            "Swap request rejected. Slots reset to SWAPPABLE."
          )
        );
    }
  } catch (error) {
    await session.abortTransaction();
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw new ApiError(500, "Transaction failed due to an unexpected error.");
    }
  } finally {
    session.endSession();
  }
});

const getIncomingSwapRequests = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const incomingRequests = await SwapRequest.find({
    receivingUser: userId,
    status: "PENDING",
  })
    .populate("offeringUser", "name email")
    .populate("offeringSlot", "title startTime endTime")
    .populate("requestingSlot", "title startTime endTime")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        incomingRequests,
        "Incoming swap requests fetched successfully."
      )
    );
});

const getOutgoingSwapRequests = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const outgoingRequests = await SwapRequest.find({
    offeringUser: userId,
  })
    .populate("receivingUser", "name email")
    .populate("offeringSlot", "title startTime endTime")
    .populate("requestingSlot", "title startTime endTime")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        outgoingRequests,
        "Outgoing swap requests fetched successfully."
      )
    );
});

export {
  getSwappableSlots,
  createSwapRequest,
  handleSwapRequest,
  getIncomingSwapRequests,
  getOutgoingSwapRequests,
};
