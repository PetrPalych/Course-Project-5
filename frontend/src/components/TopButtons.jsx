import React from "react";
import { getCurrentDate } from "../services/weatherService";

const TopButtons = ({ setQuery, setBaselQuery }) => {
  // const cities = [
  //   {
  //     id: 1,
  //     title: "Osh",
  //   },
  //   {
  //     id: 2,
  //     title: "Bishkek",
  //   },
  //   {
  //     id: 3,
  //     title: "Almaty",
  //   },
  //   {
  //     id: 4,
  //     title: "Astana",
  //   },
  //   {
  //     id: 5,
  //     title: "Moscow",
  //   },
  // ];

  return (
    <div className="flex items-center justify-around my-6">
      {/* {cities.map((city) => (
        <button
          key={city.id}
          className="text-white  text-lg font-medium"
          onClick={() => setQuery({ q: city.title })}
        >
          {city.title}
        </button>
      ))} */}
      <button
        onClick={() => setBaselQuery(true)}
        className="text-white text-lg font-medium"
      >
        Basel
      </button>
    </div>
  );
};

export default TopButtons;
