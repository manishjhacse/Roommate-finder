import { createSlice } from "@reduxjs/toolkit";

const initialState = localStorage.getItem("isloggedinUser")
  ? JSON.parse(localStorage.getItem("isloggedinUser"))
  : false;

const loggedInSlice = createSlice({
  name: "loggedIn",
  initialState,
  reducers: {
    changeLoggedIn: (state, action) => {
      const newState = action.payload;
      localStorage.setItem("isloggedinUser", JSON.stringify(newState));
      return newState;
    },
  },
});

export const { changeLoggedIn } = loggedInSlice.actions;
export default loggedInSlice.reducer;
