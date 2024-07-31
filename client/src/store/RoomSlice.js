import { createSlice } from "@reduxjs/toolkit";
const initialState=[];
const roomSlice = createSlice({
    name: 'rooms',
    initialState,
    reducers: {
      addRoom: (state, action) => {
        return action.payload; // Directly set the state to the payload
      },
      addOneRoom:(state,action)=>{
        state.push(action.payload);
      },
      removeRoom: (state, action) => {
        return state.filter(room => room._id !== action.payload);
      }
    }
  });
  
  export const { addRoom,addOneRoom, removeRoom } = roomSlice.actions;
  export default roomSlice.reducer;
  