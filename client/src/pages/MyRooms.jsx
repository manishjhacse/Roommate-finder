import axios from "axios";
import React, { useEffect, useState } from "react";
import RoomContainer from "../components/RoomContainer";

export default function MyRooms() {
  const [rooms, setRooms] = useState([]);
  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  const url = import.meta.env.VITE_BASE_URL;
  const getRooms = async () => {
    const res = await axios.get(`${url}/getAllRooms`);
    setRooms(res.data.rooms);
  };
  useEffect(() => {
    getRooms();
  }, []);
  return (
    <div className="flex flex-col items-center gap-5">
      {rooms.map((room) => {
        return <RoomContainer key={room._id} room={room} />;
      })}
    </div>
  );
}
