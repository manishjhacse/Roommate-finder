import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { changeLoggedIn } from "../store/loginSlice";
import { changeLoggedInUser } from "../store/userSlice";
import { toast } from "react-hot-toast";
export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }
  const url = import.meta.env.VITE_BASE_URL;
  async function login() {
    try {
      const res = await axios.post(`${url}/login`, formData, {
        withCredentials: true,
      });
      console.log(res);
      const user = res.data.user;
      localStorage.setItem("loggedInUser", user);
      localStorage.setItem("token", res.data.token);
      dispatch(changeLoggedIn(true));
      dispatch(changeLoggedInUser(user));
      toast.success("logged in")
      navigate("/");
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message);
    }
  }
  async function handleLogin(e) {
    e.preventDefault();
    if (formData.email == "" || formData.password == "") {
      toast.error("Enter all details")
      return;
    }
    await login();
   
  }
  return (
    <form
      className="text-black flex flex-col py-20 justify-center items-center gap-3"
      onSubmit={handleLogin}
    >
      <div className="text-white">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          className="px-2 py-1.5 rounded-md outline-none border border-black bg-transparent text-white"
          type="email"
          placeholder="Enter your Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div className="text-white">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          className="px-2 py-1.5 rounded-md outline-none border border-black bg-transparent text-white"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      <button className="px-2 py-1.5 rounded-md outline-none border text-white border-black hover:bg-purple-800 hover:border-purple-800 transition-all duration-200">
        Login
      </button>
      <Link
        to="/changepassword"
        className="w-full text-center text-xs cursor-pointer"
      >
        Forgot password?
      </Link>
      <div className="text-[15px] text-center">
        Don't have an account?{" "}
        <Link to="/signup" className="font-semibold cursor-pointer">
          <p>Sign up</p>
        </Link>
      </div>
    </form>
  );
}
