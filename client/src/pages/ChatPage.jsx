import React, { useEffect, useRef, useState } from "react";
import { IoIosSend } from "react-icons/io";
import { useLocation, useParams } from "react-router-dom";
import io from "socket.io-client";
import { FaCopy } from "react-icons/fa";
import { GoHeartFill } from "react-icons/go";
import { useSelector } from "react-redux";
import axios from "axios";

export default function ChatPage() {
  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  const url = import.meta.env.VITE_BASE_URL;
  const loggedInUser = useSelector((state) => state.loggedInUser);
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");
  const location = useLocation();
  const { chatId, userId } = useParams();
  const socket = useRef(null);
  const messagesEndRef = useRef(null);
  const senderName = location.state.name;
  const chattingWith = location.state.chattingWith;

  useEffect(() => {
    if (!token) {
      console.error("Token not found");
      return;
    }

    // Initialize socket connection
    socket.current = io.connect(import.meta.env.VITE_SOCKET_URL, {
      transports: ["websocket"],
    });

    socket.current.on("connect", () => {
      console.log("Connected to socket server");
    });

    socket.current.emit("startChat", { chatId });

    socket.current.on("receive_message", (messageData) => {
      console.log("Message received:", messageData);
      setChats((prev) => [...prev, messageData]);
    });

    return () => {
      socket.current.off("receive_message");
      socket.current.disconnect();
    };
  }, [chatId, token]);

  useEffect(() => {
    const getPrevMessages = async () => {
      try {
        const res = await axios.get(`${url}/getchats`, {
          params: { chatId },
          withCredentials: true,
        });
        const messages = res.data?.chat?.messages || [];
        setChats(messages);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setChats([]);
      }
    };

    getPrevMessages();
  }, [chatId, url]);

  const handleSend = async () => {
    if (message === "") return;
    const messageData = {
      chatId,
      senderId: userId,
      senderName,
      message,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    await socket.current.emit("send_message", messageData);
    setChats((prev) => [...prev, messageData]);
    setMessage("");
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(chatId);
      console.log("RoomId Copied to clipboard");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  return (
    <div className="flex justify-center h-[600px] items-center  w-full">
      <div className=" bg-gray-900 md:bg-opacity-80 text-white px-3 overflow-hidden md:py-1 w-screen sm:w-[300px] h-full pt-4 flex flex-col items-center rounded-md">
        <h1 className="uppercase relative flex items-center gap-2 font-bold text-base">
          {`Chagging with ${chattingWith}`}
        </h1>
        <div className="w-full hideScrollBar overflow-y-scroll hide-scrollbar py-3 h-full md:h-[87%]">
          {chats.map((messageContent, index) => {
            const isUserMessage = loggedInUser._id === messageContent.senderId;
            return (
              <div
                key={index}
                className={`flex flex-col ${
                  isUserMessage ? "items-end" : "items-start"
                } mb-4`}
              >
                <div
                  style={{
                    maxWidth: "200px",
                    overflow: "hidden",
                    wordWrap: "break-word",
                  }}
                  className={`rounded-lg py-1 px-2 ${
                    isUserMessage
                      ? "bg-green-500 text-white"
                      : "bg-[#1E40AF] text-white"
                  }`}
                >
                  <p className="text-sm">{messageContent.message}</p>
                </div>
                <div className="text-[10px] text-slate-500">
                  <span className="mr-1">{messageContent.time}</span>
                  <span>{messageContent.name}</span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        <div className="relative px border border-[#9CA3AF] my-1 rounded-full flex w-full justify-start">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
            className="w-[90%] bg-transparent outline-none placeholder:text-slate-400 py-2 px-2 text-white"
            type="text"
            placeholder="Message..."
          />
          <button
            onClick={handleSend}
            className="px-1 py-1 text-blue-500 font-bold rounded-full absolute text-2xl right-1 top-1/2 -translate-y-1/2"
          >
            <IoIosSend />
          </button>
        </div>
      </div>
    </div>
  );
}
