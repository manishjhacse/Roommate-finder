import axios from "axios";
import React, { useEffect, useState } from "react";
import RoomContainer from "../components/RoomContainer";
import { Link } from "react-router-dom";

export default function MyRooms() {
  const [rooms, setRooms] = useState([]);
  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  const url = import.meta.env.VITE_BASE_URL;
  const getRooms = async () => {
    try {
      const res = await axios.get(`${url}/getUserRooms`);
      setRooms(res.data.rooms);
    } catch (err) {
      setRooms([]);
    }
  };
  useEffect(() => {
    getRooms();
  }, []);
  return (
    <div className="flex flex-col items-center gap-5">
      {rooms.length === 0 && (
        <div className="flex text-black font-bold flex-col items-center mt-40">
          <p>No Room Available</p>
          <Link className=" underline" to="/addroom">
            Post Room
          </Link>
        </div>
      )}
      {rooms?.length > 0 &&
        rooms.map((room) => {
          return <RoomContainer key={room._id} room={room} />;
        })}
    </div>
  );
}
