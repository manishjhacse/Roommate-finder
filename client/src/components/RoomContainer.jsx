import React, { useEffect, useState } from "react";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FaHeart } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { removeRoom } from "../store/RoomSlice";
export default function RoomContainer({ room }) {
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUser, SetisUser] = useState(false);
  const loggedInUser = useSelector((state) => state.loggedInUser);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  useEffect(() => {
    if (loggedInUser?._id === room?.user?.userID) {
      SetisUser(true);
    } else {
      SetisUser(false);
    }
  }, []);
  const handleDelete = async () => {
    const url = import.meta.env.VITE_BASE_URL;
    try {
      const res = await axios.delete(`${url}/deleteroom`, {
        data: room,
        withCredentials: true,
      });
      dispatch(removeRoom(room._id));
    } catch (err) {
      console.error("Error deleting room:", err);
      if (err.response) {
        console.error("Server responded with:", err.response.data);
      } else {
        console.error("Error details:", err.message);
      }
    }
  };

  const handleFavourite = async () => {
    console.log(loggedInUser);
    const roomIdsInEntries = loggedInUser.favourites.map(
      (entry) => entry.roomId
    );
    console.log(roomIdsInEntries);
    if (roomIdsInEntries.includes(room._id)) {
      try {
        const url = import.meta.env.VITE_BASE_URL;
        const res = await axios.delete(`${url}/deletefromfavourites`, {
          data: room,
          withCredentials: true,
        });
        console.log("Room deleted");
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const url = import.meta.env.VITE_BASE_URL;
        const res = await axios.post(`${url}/addtofavourites`, room, {
          withCredentials: true,
        });
        console.log("Room Added");
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="bg-opacity-40 relative gap-3 backdrop-blur-sm bg-black w-10/12 max-w-[800px] px-2 py-2 rounded-md flex md:flex-row flex-col overflow-hidden">
      <div className="min-w-[200px] md:min-w-[300px]">
        <img
          className="w-[300px] shadow-md shadow-black rounded-md"
          src={room.images}
          alt="room"
        />
      </div>
      <div>
        <div className="flex mb-2 gap-3">
          <h1 className="font-bold">Posted By: </h1>
          <span>{room?.user?.userName?.split(" ")[0]}</span>
        </div>
        {/* location */}
        <div className="text-white gap-3 mb-2 flex font-semibold">
          <h1 className="font-bold ">Location:</h1>
          <div>
            <span>{room?.location?.district}</span>,{" "}
            <span>{room?.location?.state}</span>,{" "}
            <span>{room?.location?.country}</span>
            {room?.location?.landmark !== "" && <span>, </span>}
            <span>{room?.location?.landmark}</span>
          </div>
        </div>
        {/* description */}
        <div className="mb-2 flex gap-3">
          {room?.description !== "" && (
            <h1 className="font-bold">Description:</h1>
          )}
          {isExpanded ? (
            <div>
              {room?.description}
              <span
                onClick={() => setIsExpanded(false)}
                className="text-xs cursor-pointer text-black"
              >
                {" "}
                show less
              </span>
            </div>
          ) : (
            <div>
              {room?.description?.slice(0, 150)}{" "}
              {room?.description?.length > 150 && (
                <span className="-ml-1">...</span>
              )}{" "}
              {room?.description?.length > 150 && (
                <span
                  onClick={() => setIsExpanded(true)}
                  className="text-xs cursor-pointer text-black"
                >
                  show more
                </span>
              )}
            </div>
          )}
        </div>
        {/* Preference */}
        <div className="flex md:text-base text-xs">
          <div className="w-[150px]">
            <span className="font-bold">Gender:</span>{" "}
            <span>{room?.roommatePreferences?.gender}</span>
          </div>
          <div className="w-[200px]">
            <span className="font-bold">Smoker:</span>{" "}
            <span>{room?.roommatePreferences?.smoker}</span>
          </div>
        </div>
        {/* price */}
        <div className="flex md:text-base text-xs my-2">
          <div className="w-[150px]">
            <span className="font-bold">Price: </span>
            <span>{room?.price}</span>
          </div>
          <div className="w-[200px]">
            <button className="flex items-center gap-2 font-bold">
              Chat <IoChatbubbleEllipses />
            </button>
          </div>
        </div>
      </div>

      <div className="absolute top-0 right-2 text-red-500 text-xl ">
        {isUser && (
          <button onClick={handleDelete}>
            <MdDelete />
          </button>
        )}
      </div>
    </div>
  );
}
