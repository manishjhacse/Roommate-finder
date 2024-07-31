import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { changeLoggedIn } from "../store/loginSlice";
import roommatefinderlogo from "../assests/roommatefinderlogo.jpg";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoCloseSharp } from "react-icons/io5";
import { changeLoggedInUser } from "../store/userSlice";
export default function NavBar() {
  const [top, setTop] = useState(0);
  const [show, setShow] = useState("h-0 py-0 px-0");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showNavbar, setShowNavbar] = useState(false);
  const loggedIn = useSelector((state) => state.loggedIn);
  const handleLogout = async () => {
    handleNavBar();
    try {
      const url = import.meta.env.VITE_BASE_URL;
      const res = await axios.delete(`${url}/logout`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        localStorage.removeItem("token");
        localStorage.removeItem("isloggedinUser");
        localStorage.removeItem("loggedInUser");
        dispatch(changeLoggedInUser({}));
        dispatch(changeLoggedIn(false));
        navigate("/login");
      } else {
        console.log("Logout failed with status:", res.status);
      }
    } catch (err) {
      console.error("Logout error:", err);
      navigate("/");
    }
  };

  function handleNavBar() {
    if (showNavbar) {
      setShowNavbar(false);
      setShow("h-0 py-0 px-0");
    } else {
      setShowNavbar(true);
      setTop(68);
      setShow("h-[163px] py-3 px-4");
    }
  }
  return (
    <div className="w-full fixed  bg-black bg-opacity-70 text-white backdrop-blur-sm font-semibold h-fit mx-auto flex items-center shadow-sm z-10">
      <div className="w-full relative py-2 h-fit px-4 mx-auto md:text-[18px] text-[16px] flex items-center justify-between max-w-[1080px]">
        <Link to="/" onClick={handleNavBar} className="group ">
          <img
            className="w-14 rounded-full"
            src={roommatefinderlogo}
            alt="LOGO"
          />
        </Link>
        <button
          onClick={handleNavBar}
          className="md:hidden text-xl font-bold block"
        >
          {showNavbar ? <IoCloseSharp /> : <GiHamburgerMenu />}
        </button>
        <div
          className={` transition-all duration-300  md:scale-100 ${show} flex md:px-0  md:py-0 md:flex-row flex-col md:relative top-[68px] md:h-fit overflow-hidden right-0 absolute md:top-0 gap-3 md:gap-8 bg-black md:bg-transparent bg-opacity-80 rounded-bl-md z-20`}
        >
          {loggedIn ? (
            <Link onClick={handleNavBar} to="/addroom" className="group">
              <button className="font-bold">Post Room</button>
              <div className="w-0 group-hover:w-full transition-all duration-200 border-t-2 border-white"></div>
            </Link>
          ) : (
            <Link onClick={handleNavBar} to="/login" className="group">
              <button className="font-bold">Login</button>
              <div className="w-0 group-hover:w-full transition-all duration-200 border-t-2 border-white"></div>
            </Link>
          )}
          {loggedIn ? (
            <div onClick={handleLogout} className="group">
              <button className="font-bold">Log out</button>
              <div className="w-0 group-hover:w-full transition-all duration-200 border-t-2 border-white"></div>
            </div>
          ) : (
            <Link to="/signup" onClick={handleNavBar} className="group">
              <button className="font-bold">Sign up</button>
              <div className="w-0 group-hover:w-full transition-all duration-200 border-t-2 border-white"></div>
            </Link>
          )}

          {loggedIn && (
            <Link onClick={handleNavBar} to="/myrooms" className="group">
              <button className="font-bold">My Rooms</button>
              <div className="w-0 group-hover:w-full transition-all duration-200 border-t-2 border-white"></div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
