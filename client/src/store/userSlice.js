import { createSlice } from "@reduxjs/toolkit";
const initialState = localStorage.getItem("loggedInUser")
  ? JSON.parse(localStorage.getItem("loggedInUser"))
  : {};
const userSlice = createSlice({
  initialState,
  name: "loggedInUser",
  reducers: {
    changeLoggedInUser: (state, action) => {
      const newState = action.payload;
      localStorage.setItem("loggedInUser", JSON.stringify(newState));
      return newState;
    },
  },
});
export const { changeLoggedInUser } = userSlice.actions;
export default userSlice.reducer;
