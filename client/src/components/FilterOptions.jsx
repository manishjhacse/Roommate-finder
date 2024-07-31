import React, { useEffect, useState } from "react";
import { Country, State, City } from "country-state-city";
import { FaFilter } from "react-icons/fa";
import { CiFilter } from "react-icons/ci";
import { useSelector } from "react-redux";
export default function FilterOptions({ roomsToShow, setRoomsToShow }) {
    const rooms=useSelector(state=>state.rooms)
  const [formData, setFormData] = useState({
    location: { country: "", state: "", district: "" },
    roommatePreferences: { gender: "", smoker: "" },
  });
  const [showFilterButton, setShowFilterButton] = useState(true);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  useEffect(() => {
    if (formData.location.country) {
      const selectedCountry = countries.find(
        (c) => c.name === formData.location.country
      );
      if (selectedCountry) {
        setStates(State.getStatesOfCountry(selectedCountry.isoCode));
      }
    }
  }, [formData.location.country, countries]);

  useEffect(() => {
    if (formData.location.state) {
      const selectedState = states.find(
        (s) => s.name === formData.location.state
      );
      if (selectedState) {
        setCities(
          City.getCitiesOfState(
            selectedState.countryCode,
            selectedState.isoCode
          )
        );
      }
    }
  }, [formData.location.state, states]);

  function handleFormData(e) {
    const { name, value, type, files } = e.target;
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
  const [height, setHeight] = useState("h-0");
  function handleFilterContainer() {
    if (showFilterButton) {
      setShowFilterButton(false);
      setHeight("h-[285px] py-2 ");
    } else {
      setShowFilterButton(true);
      setHeight("h-0");
    }
  }

  const handleFilter = (e) => {
    e.preventDefault();
    setShowFilterButton(true);
    setHeight("h-0");
    
    let filteredRooms = [...rooms];
  
    if (formData.location.country) {
      filteredRooms = filteredRooms.filter(
        room => room.location.country === formData.location.country
      );
    }
    if (formData.location.state) {
      filteredRooms = filteredRooms.filter(
        room => room.location.state === formData.location.state
      );
    }
    if (formData.location.district) {
      filteredRooms = filteredRooms.filter(
        room => room.location.district === formData.location.district
      );
    }
    if (formData.roommatePreferences.gender) {
      filteredRooms = filteredRooms.filter(
        room => room.roommatePreferences.gender === formData.roommatePreferences.gender
      );
    }
    if (formData.roommatePreferences.smoker) {
      filteredRooms = filteredRooms.filter(
        room => room.roommatePreferences.smoker === formData.roommatePreferences.smoker
      );
    }
    console.log(filteredRooms)
    setRoomsToShow(filteredRooms);
  };
  

  return (
    <div className="w-full relative">
      {showFilterButton && (
        <button
          onClick={handleFilterContainer}
          className="flex absolute md:hidden -top-2 right-5 items-center gap-1 "
        >
          Filter <FaFilter />
        </button>
      )}
      <div
        className={` transition-all duration-200 absolute md:relative bg-black opacity-90 rounded-b-md md:rounded-none md:bg-transparent md:top-0 z-20 -top-3 left-0 right-0 md:flex ${height} w-10/12 mx-auto justify-center overflow-hidden flex-wrap max-w-[800px] md:h-fit h-0  grid gap-2`}
      >
        {/* country */}
        <select
          id="country"
          className="px-2 cursor-pointer py-1.5 rounded-md outline-none border md:w-[150px] w-[200px] border-black bg-transparent text-white"
          name="location.country"
          value={formData.location.country}
          onChange={handleFormData}
        >
          <option className="bg-black text-white" value="">
            Select Country
          </option>
          {countries.map((country, index) => (
            <option
              className="bg-black text-white"
              key={index}
              value={country.name}
            >
              {country.name}
            </option>
          ))}
        </select>

        {/* state */}
        <select
          id="state"
          className="px-2 cursor-pointer py-1.5 rounded-md outline-none border border-black bg-transparent md:w-[150px] w-[200px] text-white"
          name="location.state"
          value={formData.location.state}
          onChange={handleFormData}
        >
          <option className="bg-black text-white" value="">
            Select State
          </option>
          {states.map((state, index) => (
            <option
              className="bg-black text-white"
              key={index}
              value={state.name}
            >
              {state.name}
            </option>
          ))}
        </select>

        {/* city */}

        <select
          id="city"
          className="px-2 cursor-pointer py-1.5 rounded-md outline-none border md:w-[150px] w-[200px] border-black bg-transparent text-white"
          name="location.district"
          value={formData.location.district}
          onChange={handleFormData}
        >
          <option className="bg-black text-white" value="">
            Select City
          </option>
          {cities.map((city, index) => (
            <option
              className="bg-black text-white"
              key={index}
              value={city.name}
            >
              {city.name}
            </option>
          ))}
        </select>

        {/* gender */}
        <select
          id="gender"
          className="px-2 cursor-pointer py-1.5 rounded-md outline-none md:w-[150px] w-[200px] border border-black bg-transparent text-white"
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

        {/* smoker */}
        <select
          id="smoker"
          className="px-2 cursor-pointer py-1.5 md:w-[150px] w-[200px] rounded-md outline-none border border-black bg-transparent text-white"
          name="roommatePreferences.smoker"
          value={formData.roommatePreferences.smoker}
          onChange={handleFormData}
        >
          <option className="md:w-[150px]  bg-black w-[200px]" value="">
            Select Smoker Preference
          </option>
          <option className="md:w-[150px] bg-black  w-[200px]" value="Allowed">
            Allowed
          </option>
          <option
            className="md:w-[150px] bg-black  w-[200px]"
            value="Not allowed"
          >
            Not Allowed
          </option>
        </select>

        <button
          onClick={handleFilter}
          className="px-3 py-2 md:w-[150px] w-[200px] rounded-md outline-none border  text-white font-bold bg-transparent md:border-black hover:bg-purple-800 hover:border-purple-800 transition-all duration-200 border-white"
        >
          Filter
        </button>
      </div>
    </div>
  );
}
