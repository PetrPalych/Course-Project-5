import React, { useState } from "react";
import { UilSearch, UilLocationPoint } from "@iconscout/react-unicons";

const Inputs = ({ setQuery, units, setUnits }) => {
  const [city, setCity] = useState("");
  const [unitName, setUnitName] = useState("");
  const handleSearchClick = () => {
    if (city !== "") {
      setQuery({ q: city });
      setCity("");
    }
  };
  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        setQuery({
          lat,
          lon,
        });
      });
    }
  };

  // const handleUnitsChange = (e) => {
  //   // const selectedUnit = ;
  //   setUnitName(e.currentTarget.name);
  //   if (units !== unitName) setUnits(unitName);
  // };

  return (
    <div className="flex flex-row justify-center my-6">
      <div className="flex flex-row w-3/4 items-center justify-center space-x-4">
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          type="text"
          placeholder="Search for city..."
          className="text-xl font-light p-2 w-full shadow-xl focus:outline-none capitalize "
        />
        <UilSearch
          size={30}
          className="text-white cursor-pointer transition ease-out hover:scale-125"
          onClick={handleSearchClick}
        />
        <UilLocationPoint
          size={30}
          className="text-white cursor-pointer transition ease-out hover:scale-125"
          onClick={handleLocationClick}
        />
      </div>
      <div className="flex flex-row w-1/4 items-center justify-center">
        {/* <button
          name="metric"
          className={`text-2xl text-white font-light transition ease-out hover:scale-125 ${
            unitName === "metric" ? "text-black" : ""
          }`}
          onClick={handleUnitsChange}
        >
          °C
        </button> */}
        {/* <p className="text-white mx-1 text-2xl px-3">|</p>
        <button
          name="imperial"
          className={`text-2xl text-white font-light transition ease-out hover:scale-125 ${
            unitName === "imperial" ? "text-black" : ""
          }`}
          onClick={handleUnitsChange}
        >
          °F
        </button> */}
      </div>
    </div>
  );
};

export default Inputs;
