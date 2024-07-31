import React from "react";
import SignupForm from "../components/SignupForm";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function SignupPage() {
  const loggedIn = useSelector((store) => store.loggedIn);
  if (loggedIn) {
    return <Navigate to="/" />;
  } else {
    return (
      <div className="bg-gradient-to-r px-3 from-fuchsia-600 to-purple-600 flex justify-center items-center min-h-screen overflow-hidden">
        <div className="overflow-hidden bg-black w-[300px]  px-10 py-5 bg-opacity-40 backdrop-blur-sm rounded-tl-3xl rounded-tr-lg  rounded-br-3xl rounded-bl-lg">
          <SignupForm />
        </div>
      </div>
    );
  }
}
