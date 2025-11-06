import axios from "../axios.js";

export const fetchAllSwappableSlots = async () => {
  try {
    const response = await axios.get("/swaps/swappable-slots");
    return response.data.data;
  } catch (error) {
    console.error("Failed to Fetch All Swappable Slots:", error);
    throw error;
  }
};

export const fetchMySwappableSlots = async () => {
  try {
    const response = await axios.get("/events/swappable");
    return response.data.data;
  } catch (error) {
    console.error("Failed to Fetch Users Swappable Slots:", error);
    throw error;
  }
};

export const createSwapRequest = async (mySlotId, theirSlotId) => {
  try {
    const response = await axios.post("/swaps/swap-request", {
      mySlotId,
      theirSlotId,
    });
    return response.data.data;
  } catch (error) {
    console.error("Failed to Create Swap Request:", error);
    throw error;
  }
};

export const handleSwapRequest = async (accepted, requestId) => {
  try {
    const response = await axios.post(
      `/swaps/swap-response/${requestId}`,
      accepted
    );
    return response.data.data;
  } catch (error) {
    console.error("Failed to Create Swap Request:", error);
    throw error;
  }
};
