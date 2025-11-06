import axios from "../axios.js";

export const registerUser = async (userData) => {
  try {
    const response = await axios.post("/users/register", userData);
    return response.data.data;
  } catch (error) {
    console.error("Failed to register User:", error);
    throw error;
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await axios.post("/users/login", userData);
    return response.data.data;
  } catch (error) {
    console.error("Failed to login User:", error);
    throw error;
  }
};
export const logoutUser = async () => {
  try {
    const response = await axios.post("/users/logout");
    return response.data.data;
  } catch (error) {
    console.error("Failed to logout User:", error);
    throw error;
  }
};

export const fetchUser = async () => {
  try {
    const response = await axios.get("/users/me");
    return response.data.data;
  } catch (error) {
    console.error("Failed to Fetch User Profile:", error);
    throw error;
  }
};
