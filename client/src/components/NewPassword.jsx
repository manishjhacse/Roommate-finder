import React from "react";

export default function NewPassword({ formData, handleChange }) {
  return (
    <div className="text-black flex flex-col justify-center items-center gap-3">
      <div className="text-white">
        <label htmlFor="code">OTP</label>
        <input
          id="code"
          className="px-2 py-1.5 rounded-md outline-none border border-black bg-transparent text-white"
          type="text"
          name="code"
          placeholder="Enter OTP"
          value={formData.code}
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
      <div className="text-white">
        <label htmlFor="confirmPassword">Confirm password</label>
        <input
          id="confirmPassword"
          className="px-2 py-1.5 rounded-md outline-none border border-black bg-transparent text-white"
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
