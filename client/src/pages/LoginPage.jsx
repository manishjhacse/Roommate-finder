import React from "react";
import LoginForm from "../components/LoginForm";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function LoginPage() {
  const loggedIn = useSelector((store) => store.loggedIn);
  if (loggedIn) {
    return <Navigate to="/" />;
  } else {
    return (
      <div className="bg-gradient-to-r px-3 from-fuchsia-600 to-purple-600 flex justify-center items-center min-h-screen overflow-hidden">
        <div className="overflow-hidden bg-black w-[300px]  px-10 py-5 bg-opacity-40 backdrop-blur-sm rounded-tl-3xl rounded-tr-lg  rounded-br-3xl rounded-bl-lg">
          <LoginForm />
        </div>
      </div>
    );
  }
}
