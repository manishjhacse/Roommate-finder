import axios from "axios";
import React, { useEffect, useState } from "react";
import RoomContainer from "../components/RoomContainer";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function MyRooms() {
  const [roomsToShow, setRoomsToShow] = useState([]);
  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  const loggedInUser = useSelector((store) => store.loggedInUser);
  const rooms = useSelector((state) => state.rooms);
  const url = import.meta.env.VITE_BASE_URL;
  const getRooms = () => {
    const tempRooms = rooms.filter(
      (room) => loggedInUser?._id === room?.user?.userID
    );
    setRoomsToShow(tempRooms);
  };
  useEffect(() => {
    getRooms();
  }, []);
  return (
    <div className="flex flex-col items-center gap-5">
      {roomsToShow.length === 0 && (
        <div className="flex text-black font-bold flex-col items-center mt-40">
          <p>No Room Available</p>
          <Link className=" underline" to="/addroom">
            Post Room
          </Link>
        </div>
      )}
      {roomsToShow?.length > 0 &&
        roomsToShow.map((room) => {
          return <RoomContainer key={room._id} room={room} />;
        })}
    </div>
  );
}
