import React from "react";
import { UilSearch, UilLocationPoint } from "@iconscout/react-unicons";

const Inputs = () => {
  return (
    <div className="flex flex-row justify-center my-6">
      <div className="flex flex-row w-3/4 items-center justify-center space-x-4">
        <input
          type="text"
          placeholder="Search for city..."
          className="text-xl font-light p-2 w-full shadow-xl focus:outline-none capitalize "
        />
        <UilSearch
          size={30}
          className="text-white cursor-pointer transition ease-out hover:scale-125"
        />
        <UilLocationPoint
          size={30}
          className="text-white cursor-pointer transition ease-out hover:scale-125"
        />
      </div>
      <div className="flex flex-row w-1/4 items-center justify-center">
        <button name="metric" className="text-2xl text-white font-light">
          °C
        </button>
        <p className="text-white mx-1 text-2xl px-3">|</p>
        <button name="imperial" className="text-2xl text-white font-light">
          °F
        </button>
      </div>
    </div>
  );
};

export default Inputs;
