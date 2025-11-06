import { configureStore } from "@reduxjs/toolkit";
import userAuthReducer from "../features/authSlice.js";
export const store = configureStore({
  reducer: {
    auth: userAuthReducer,
  },
});
export default store;
