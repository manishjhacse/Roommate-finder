import React, { useEffect, useState } from "react";
import RoomContainer from "../components/RoomContainer";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addRoom } from "../store/RoomSlice";
import { changeLoggedIn } from "../store/loginSlice";
import { Link } from "react-router-dom";
import LocationSelector from "../components/LocationSelector";
import FilterOptions from "../components/FilterOptions";
export default function HomePage() {
  const rooms = useSelector((state) => state.rooms);
  const [roomsToShow, setRoomsToShow] = useState([])
  const dispatch = useDispatch();
  const url = import.meta.env.VITE_BASE_URL;
  const getRooms = async () => {
    try {
      const res = await axios.get(`${url}/getAllRooms`);
      dispatch(addRoom(res.data.rooms));
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    // getRooms();
    setRoomsToShow(rooms)
  }, [rooms]);
  if (rooms.length < 1) {
    return (
      <div className="flex text-black font-bold flex-col items-center mt-40">
        <p>No Room Available</p>
        <Link className=" underline" to="/addroom">Post Room</Link>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-center gap-5">
       <div className="w-full">
        <FilterOptions roomsToShow={roomsToShow} setRoomsToShow={setRoomsToShow}/>
       </div>
      { roomsToShow.length>0 ?
        roomsToShow?.map((room) => {
          return <RoomContainer key={room._id} room={room} />
        }):<div className="flex text-black font-bold flex-col items-center mt-40">
        <p>No Room Available</p>
        <Link className=" underline" to="/addroom">Post Room</Link>
      </div>}
      <p className="py-10"></p>
      </div>
    );
  }
}
