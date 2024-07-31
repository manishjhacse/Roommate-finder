import axios from "axios";
import React, { useState } from "react";
import LocationSelector from "./LocationSelector"; // Adjust the import path as necessary
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addOneRoom } from "../store/RoomSlice";

export default function AddRoom() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    description: "",
    location: { country: "", state: "", district: "", landmark: "" },
    roommatePreferences: { gender: "", smoker: "" },
    price: "",
    image: null,
  });
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  function handleFormData(e) {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
    } else {
      setFormData((prevData) => {
        const newFormData = { ...prevData };
        if (name.includes(".")) {
          const keys = name.split(".");
          newFormData[keys[0]][keys[1]] = value;
        } else {
          newFormData[name] = value;
        }
        return newFormData;
      });
    }
  }

  const url = import.meta.env.VITE_BASE_URL;

  async function addRoom() {
    setMessage("Adding Room");
    const formDataToSend = new FormData();
    formDataToSend.append("description", formData.description);
    formDataToSend.append("location", JSON.stringify(formData.location));
    formDataToSend.append(
      "roommatePreferences",
      JSON.stringify(formData.roommatePreferences)
    );
    formDataToSend.append("price", formData.price);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }
    try {
      const res = await axios.post(`${url}/addRoom`, formDataToSend, {
        withCredentials: true,
      });
      dispatch(addOneRoom(res.data.room));
      setMessage("");
      navigate("/");
    } catch (err) {
      console.log(err);
      setTimeout(() => {
        setMessage("");
      }, 3000);
      setMessage(err.response.data.message);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (
      !formData.location.country ||
      !formData.location.state ||
      !formData.price ||
      !formData.roommatePreferences.gender ||
      !formData.roommatePreferences.smoker
    ) {
      setMessage("Please fill in all required fields");
      setTimeout(() => {
        setMessage("");
      }, 3000);
      return;
    }
    await addRoom();
  }

  return (
    <form
      className="text-black flex flex-col justify-center items-center gap-3"
      onSubmit={handleSubmit}
    >
      <div className="text-white w-full flex flex-col">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          className="px-2 py-1.5 md:w-full w-[200px] rounded-md outline-none border border-black bg-transparent text-white resize-none"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleFormData}
          rows="2"
        />
      </div>

      <LocationSelector formData={formData} handleFormData={handleFormData} />

      <div className="text-white grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
        <div className="flex flex-col">
          <label htmlFor="gender">
            Gender Preference<span className="text-black">*</span>
          </label>
          <select
            id="gender"
            className="px-2 py-1.5 rounded-md outline-none border border-black bg-transparent text-white"
            name="roommatePreferences.gender"
            value={formData.roommatePreferences.gender}
            onChange={handleFormData}
          >
            <option className="md:w-[150px]  bg-black w-[200px]" value="">
              Select Gender
            </option>
            <option className="md:w-[150px]  bg-black w-[200px]" value="Male">
              Male
            </option>
            <option className="md:w-[150px]  bg-black w-[200px]" value="Female">
              Female
            </option>
            <option className="md:w-[150px]  bg-black w-[200px]" value="Any">
              Any
            </option>
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="smoker">
            Smoker Preference<span className="text-black">*</span>
          </label>
          <select
            id="smoker"
            className="px-2 py-1.5 md:w-[150px] w-[200px] rounded-md outline-none border border-black bg-transparent text-white"
            name="roommatePreferences.smoker"
            value={formData.roommatePreferences.smoker}
            onChange={handleFormData}
          >
            <option className="md:w-[150px] bg-black w-[200px]" value="">
              Select Smoker Preference
            </option>
            <option
              className="md:w-[150px] bg-black  w-[200px]"
              value="Allowed"
            >
              Allowed
            </option>
            <option
              className="md:w-[150px] bg-black  w-[200px]"
              value="Not allowed"
            >
              Not Allowed
            </option>
          </select>
        </div>
      </div>

      <div className="text-white grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
        <div className="flex flex-col">
          <label htmlFor="price">
            Price<span className="text-black">*</span>
          </label>
          <input
            id="price"
            className="px-2 py-1.5 md:w-[150px] w-[200px] rounded-md outline-none border border-black bg-transparent text-white"
            type="text"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleFormData}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="image">Image</label>
          <input
            id="image"
            className="px-2 md:w-[150px]  w-[200px] py-1.5 rounded-md outline-none border text-black border-black bg-trasnparent"
            type="file"
            name="image"
            onChange={handleFormData}
          />
        </div>
      </div>

      <p className="w-full text-start text-xs text-red-500 font-bold">
        {message}
      </p>
      <button className="px-2 py-1.5 rounded-md outline-none border text-white border-black hover:bg-purple-800 hover:border-purple-800 transition-all duration-200">
        Add Room
      </button>
    </form>
  );
}
