import axios from "../axios.js";

export const fetchAllEvents = async () => {
  try {
    const response = await axios.get("/events");
    return response.data.data;
  } catch (error) {
    console.error("Failed to Fetch Events:", error);
    throw error;
  }
};
export const createEvent = async (eventData) => {
  try {
    const response = await axios.post("/events", eventData);
    return response.data.data;
  } catch (error) {
    console.error("Failed to Create Event:", error);
    throw error;
  }
};

export const updateEvent = async (eventData, eventId) => {
  try {
    const response = await axios.patch(`/events/${eventId}`, eventData);
    return response.data.data;
  } catch (error) {
    console.error("Failed to Update Event:", error);
    throw error;
  }
};
export const updateEventStatus = async (status, eventId) => {
  try {
    const response = await axios.patch(`/events/${eventId}/status`, status);
    return response.data.data;
  } catch (error) {
    console.error("Failed to Update Event Status:", error);
    throw error;
  }
};

export const deleteEvent = async (eventId) => {
  try {
    const response = await axios.delete(`/events/${eventId}`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to Delete Event:", error);
    throw error;
  }
};
