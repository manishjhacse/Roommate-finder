import React from "react";
import AddRoom from "../components/AddRoom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { changeLoggedIn } from "../store/loginSlice";
import axios from "axios";

export default function NewRoom() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  if (token === null || token === undefined) {
    dispatch(changeLoggedIn(false));
    navigate("/");
    return;
  }
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  return (
    <div className="bg-gradient-to-r px-3 from-fuchsia-600 to-purple-600 flex justify-center items-center min-h-screen overflow-hidden">
      <div className="overflow-hidden bg-black min-w-[300px]  px-10 py-5 bg-opacity-40 backdrop-blur-sm rounded-tl-3xl rounded-tr-lg  rounded-br-3xl rounded-bl-lg">
        <AddRoom />
      </div>
    </div>
  );
}
