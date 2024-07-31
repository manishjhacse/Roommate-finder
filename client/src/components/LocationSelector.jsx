import React, { useState, useEffect } from "react";
import { Country, State, City } from "country-state-city";

export default function LocationSelector({ formData, handleFormData }) {
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

  return (
    <div className=" rounded-md">
      <div className="w-full flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex flex-col text-white md:w-[150px] w-[200px]">
            <label htmlFor="country">
              Country<span className="text-black">*</span>
            </label>
            <select
              id="country"
              className="px-2 py-1.5 rounded-md outline-none border md:w-[150px] w-[200px] border-black bg-transparent text-white"
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
          </div>
          <div className="flex-1 flex flex-col text-white md:w-[150px] w-[200px]">
            <label htmlFor="state">
              State<span className="text-black">*</span>
            </label>
            <select
              id="state"
              className="px-2 py-1.5 rounded-md outline-none border border-black bg-transparent md:w-[150px] w-[200px] text-white"
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
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex flex-col text-white md:w-[150px] w-[200px]">
            <label htmlFor="city">
              City<span className="text-black">*</span>
            </label>
            <select
              id="city"
              className="px-2 py-1.5 rounded-md outline-none border md:w-[150px] w-[200px] border-black bg-transparent text-white"
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
          </div>
          <div className="flex-1 flex flex-col text-white md:w-[150px] w-[200px]">
            <label htmlFor="landmark">Landmark</label>
            <input
              id="landmark"
              className=" md:w-[150px] w-[200px] px-2 py-1.5 rounded-md outline-none border border-black bg-transparent text-white"
              type="text"
              name="location.landmark"
              placeholder="Landmark"
              value={formData.location.landmark}
              onChange={handleFormData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
