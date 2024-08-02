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
    <div className="flex justify-center items-center w-full">
    <div className="bg-black bg-opacity-50 text-white px-3 py-4 overflow-hidden rounded-md w-full sm:w-[300px] md:w-[400px] lg:w-[500px] max-h-full flex flex-col shadow-lg h-[85vh] sm:h-[70vh] md:h-[75vh]">
      <h1 className="uppercase text-center  gap-2 font-bold text-base mb-4">
        {`Chatting with ${chattingWith}`}
      </h1>
      <div className="flex-grow w-full hideScrollBar overflow-y-scroll py-3">
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
                className={`rounded-lg py-1 px-2 max-w-xs sm:max-w-sm ${
                  isUserMessage
                    ? "bg-green-500 text-white"
                    : "bg-[#1E40AF] text-white"
                }`}
              >
                <p className="text-sm break-words">{messageContent.message}</p>
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
      <div className="relative border border-[#9CA3AF] rounded-full flex items-center mt-3">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
          className="w-full bg-transparent outline-none placeholder:text-slate-400 py-2 px-3 text-white"
          type="text"
          placeholder="Message..."
        />
        <button
          onClick={handleSend}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 font-bold rounded-full text-2xl"
        >
          <IoIosSend />
        </button>
      </div>
    </div>
  </div>
  
  
  );
}
