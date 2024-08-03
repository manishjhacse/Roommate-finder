import { useEffect, useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import ChangePassword from "./pages/ChangePassword";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NewRoom from "./pages/NewRoom";
import HomePage from "./pages/HomePage";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { changeLoggedIn } from "./store/loginSlice";
import PrivateRoute from "./components/PrivateRoute";
import NavBar from "./components/NavBar";
import MyRooms from "./pages/MyRooms";
import { addRoom } from "./store/RoomSlice";
import axios from "axios";
import ChatPage from "./pages/ChatPage";

function App() {
  const dispatch = useDispatch();
  const [backendConnected, SetbackendConnected] = useState(false);
  const url = import.meta.env.VITE_BASE_URL;
  const isloggedinFunction = async () => {
    const token = localStorage.getItem("token");
    if (token != null) {
      dispatch(changeLoggedIn(true));
    } else {
      dispatch(changeLoggedIn(false));
    }
  };
  const getRooms = async () => {
    try {
      SetbackendConnected(false);
      const res = await axios.get(`${url}/getAllRooms`);
      dispatch(addRoom(res.data.rooms));
      SetbackendConnected(true);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    isloggedinFunction();
    getRooms();
  }, []);
  return (
    <div className="bg-gradient-to-r relative from-fuchsia-600 to-purple-600 text-white min-h-screen min-w-screen">
      <NavBar />
      <p className="py-10"></p>
      {backendConnected ? (
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/changepassword" element={<ChangePassword />} />

          <Route
            path="/addroom"
            element={
              <PrivateRoute>
                <NewRoom />
              </PrivateRoute>
            }
          />
          <Route
            path="/myrooms"
            element={
              <PrivateRoute>
                <MyRooms />
              </PrivateRoute>
            }
          />
          <Route
            path="/chat/:chatId/:userId"
            element={
              <PrivateRoute>
                <ChatPage />
              </PrivateRoute>
            }
          />
        </Routes>
      ) : (
        <div className="absolute rounded-md px-5 gap-2 top-1/2 left-1/2 -translate-x-1/2 z-50 flex justify-center flex-col items-center -translate-y-1/2">

          <p className="w-20 h-20 border-l-white border-l-[3px] animate-spin rounded-full"></p>

          <p className="font-bold">Loading...</p>
        </div>
      )}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default App;
