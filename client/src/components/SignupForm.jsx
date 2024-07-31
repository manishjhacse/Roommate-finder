import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignupForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    otp: "",
  });
  const [optSent, setOptSent] = useState(false);
  const [buttonText, setButtonText] = useState("Sign Up");
  const [optText, setOptText] = useState("Send OTP");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }
  async function signup() {
    setButtonText("Signing up...");
    const url = import.meta.env.VITE_BASE_URL;
    try {
      const res = await axios.post(`${url}/signup`, formData, {
        withCredentials: true,
      });
      navigate("/login");
    } catch (err) {
      setMessage(err.response.data.message);
      setTimeout(() => {
        setMessage("");
      }, 5000);
    }
    setButtonText("Sign up");
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (formData.password != formData.confirmPassword) {
      setMessage("Password & Confirm password does not match");
      setTimeout(() => {
        setMessage("");
      }, 5000);
      return;
    }
    await signup();
  }
  async function handleOTP(e) {
    e.preventDefault();
    if (
      formData.name == "" ||
      formData.email == "" ||
      formData.confirmPassword == "" ||
      formData.mobile == ""
    ) {
      setMessage("please fill all the details");
      setTimeout(() => {
        setMessage("");
      }, 3000);
      return;
    }
    setMessage("Sending OTP...");

    if (formData.password != formData.confirmPassword) {
      setMessage("Password & Confirm password does not match");
      setTimeout(() => {
        setMessage("");
      }, 5000);
      return;
    }
    const url = import.meta.env.VITE_BASE_URL;
    try {
      const res = await axios.post(`${url}/sendotp`, formData, {
        withCredentials: true,
      });
      setOptSent(true);
      setOptText("Resend OTP");
      setMessage("OTP sent");
      setTimeout(() => {
        setMessage("");
      }, 5000);
    } catch (err) {
      setMessage(err.response.data.message);
      setTimeout(() => {
        setMessage("");
      }, 5000);
    }
  }
  return (
    <div>
      <form
        action=""
        className="text-black flex flex-col justify-center items-center gap-3"
      >
        <div className="text-white">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            className="px-2 py-1.5 rounded-md outline-none border border-black bg-transparent text-white"
            type="name"
            name="name"
            placeholder="Enter your Name*"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="text-white">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            className="px-2 py-1.5 rounded-md outline-none border border-black bg-transparent text-white"
            type="email"
            name="email"
            placeholder="Enter your email*"
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
            placeholder="Create Password*"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div className="text-white">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            className="px-2 py-1.5 rounded-md outline-none border border-black bg-transparent text-white"
            type="password"
            name="confirmPassword"
            placeholder="Confirm password*"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <div className="text-white">
          <label htmlFor="mobile">Mobile</label>
          <input
            id="mobile"
            className="px-2 py-1.5 rounded-md outline-none border border-black bg-transparent text-white"
            type="text"
            name="mobile"
            placeholder="Enter your Phone no."
            value={formData.mobile}
            onChange={handleChange}
          />
        </div>
        {optSent && (
          <div className="text-white">
            <label htmlFor="otp">OTP</label>
            <input
              id="otp"
              className="px-2 py-1.5 rounded-md outline-none border border-black bg-transparent text-white"
              type="text"
              name="otp"
              placeholder="Enter otp send to your mail"
              value={formData.otp}
              onChange={handleChange}
            />
          </div>
        )}
        <p className="w-full text-start text-xs text-red-500 font-bold">
          {message}
        </p>
        <div className="flex justify-between gap-3">
          <button
            onClick={handleOTP}
            className="px-2 py-1.5 rounded-md outline-none border text-white border-black hover:bg-purple-800 hover:border-purple-800 transition-all duration-200"
          >
            {optText}
          </button>
          {optSent && (
            <button
              onClick={handleSubmit}
              className="px-2 py-1.5 rounded-md outline-none border text-white border-black hover:bg-purple-800 hover:border-purple-800 transition-all duration-200"
            >
              {buttonText}
            </button>
          )}
        </div>
        <div className="text-[15px] text-center">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold cursor-pointer">
            <p>Login</p>
          </Link>
        </div>
      </form>
    </div>
  );
}
