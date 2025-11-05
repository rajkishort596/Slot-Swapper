import mongoose, { Schema } from "mongoose";

const swapRequestSchema = Schema(
  {
    offeringUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requestingSlot: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    offeringSlot: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    receivingUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

export const SwapRequest = mongoose.model("SwapRequest", swapRequestSchema);
