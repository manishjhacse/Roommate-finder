import { configureStore } from "@reduxjs/toolkit";
import loggedInSlice from "./loginSlice"
import userSlice from "./userSlice";
import roomSlice from "./RoomSlice";
const store = configureStore({
  reducer: {
    loggedIn: loggedInSlice,
    loggedInUser:userSlice,
    rooms:roomSlice
  },
});
export default store;
