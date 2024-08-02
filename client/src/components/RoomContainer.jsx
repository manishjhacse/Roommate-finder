import React, { useEffect, useState } from "react";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FaHeart } from "react-icons/fa6";
import { MdCancel } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { removeRoom } from "../store/RoomSlice";
import io from "socket.io-client";
export default function RoomContainer({ room }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loggedIn = useSelector((store) => store.loggedIn);

  const [showChatList, setShowChatList] = useState(false);
  const [chatList, setChatList] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUser, SetisUser] = useState(false);
  const [chatMessage, setChatMessage] = useState("chat");
  const loggedInUser = useSelector((state) => state.loggedInUser);
  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  const url = import.meta.env.VITE_BASE_URL;
  const socket = io.connect(`${import.meta.env.VITE_SOCKET_URL}`);
  useEffect(() => {
    if (loggedInUser?._id === room?.user?.userID) {
      SetisUser(true);
    } else {
      SetisUser(false);
    }
  }, []);
  const handleDelete = async () => {
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

  const handleChat = async () => {
    if (!loggedIn) {
      navigate("/login");
      return;
    }
    setChatMessage("Please wait...");
    let chatId = "";
    let chattingWith = "";
    try {
      const roomId = room?._id;
      console.log(room);
      const ownerName = room?.user?.userName;
      const ownerId = room?.user?.userID;
      if (isUser) {
        try {
          const res = await axios.post(
            `${url}/getchatlist`,
            { roomId, ownerId },
            {
              withCredentials: true,
            }
          );
          setChatList(res.data.chatList);
          setShowChatList(true);
        } catch (err) {
          console.log(err);
        }
        setChatMessage("chat");
        return;
      }
      const res = await axios.get(`${url}/ischatexist`, {
        params: { roomId, ownerId },
        withCredentials: true,
      });
      chatId = res?.data?.chatId;
      chattingWith = ownerName;
      if (!res?.data?.chatExist) {
        try {
          const res = await axios.post(
            `${url}/createnewchat`,
            { roomId, ownerId, ownerName },
            {
              withCredentials: true,
            }
          );
          chatId = res.data.chat._id;
        } catch (err) {
          console.log(err);
        }
      }
      try {
        // socket.emit("startChat", { chatId });
        console.log(chattingWith);
        navigate(`/chat/${chatId}/${loggedInUser?._id}`, {
          state: { name: loggedInUser?.name, chattingWith: chattingWith },
        });
        // toast.success("Welcome to the Room");
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.log(err);
    }
    setChatMessage("chat");
  };

  const handleChatByUser = async (list) => {
    const interestedId = list.interestedId;
    const chattingWith = list.interestedName;
    try {
      const roomId = room?._id;
      const ownerId = room?.user?.userID;
      let chatId = "";
      try {
        const res = await axios.get(`${url}/getchatid`, {
          params: { roomId, ownerId, interestedId },
          withCredentials: true,
        });

        chatId = res?.data?.chatId;
        console.log(chatId);
      } catch (err) {
        console.log(err);
        return;
      }
      try {
        // socket.emit("startChat", { chatId });
        navigate(`/chat/${chatId}/${loggedInUser?._id}`, {
          state: { name: loggedInUser?.name, chattingWith: chattingWith },
        });
        // toast.success("Welcome to the Room");
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.log(err);
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
            <button
              onClick={handleChat}
              className="flex items-center gap-2 font-bold"
            >
              {chatMessage} <IoChatbubbleEllipses />
            </button>
          </div>
        </div>
      </div>
      {/* chatlist */}
      {showChatList && (
        <div className="bg-black h-full absolute w-[200px] right-0 top-0 px-3 py-3 overflow-auto rounded-md max-h-full z-20">
          {chatList.map((list) => {
            return (
              <div
                className="cursor-pointer uppercase"
                onClick={() => handleChatByUser(list)}
                key={list.interestedId}
              >
                {list.interestedName}
              </div>
            );
          })}
          <div onClick={()=>setShowChatList(false)} className="top-2 cursor-pointer text-xl absolute right-2">
            <MdCancel />
          </div>
        </div>
      )}
      {/* chatlist end */}
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
