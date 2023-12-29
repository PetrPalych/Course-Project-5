import React, { useEffect, useState } from "react";
import {
  UilArrowUp,
  UilArrowDown,
  UilTemperature,
  UilTear,
  UilWind,
  UilSun,
  UilSunset,
} from "@iconscout/react-unicons";
import {
  formatToLocalTime,
  iconUrlFromCode,
  kelvinToCelsius,
} from "../../services/weatherService";
const BaselTemperature = ({ baselWeather }) => {
  const moreDetails = baselWeather.moreDetails;
  const temperatureAndDetails = baselWeather.temperatureAndDetails;
  const { relative_humidity, wind_speed, temperature, low, high } =
    temperatureAndDetails;
  const {
    details,
    icon,
    temp_min,
    temp_max,
    sunrise,
    sunset,
    feels_like,
    timezone,
  } = moreDetails;
  return (
    <div>
      <div className="flex items-center justify-center py-6 text-2xl text-cyan-300">
        <p>{details}</p>
      </div>
      <div className="flex flex-row items-center justify-between text-white py-3">
        <img src={iconUrlFromCode(icon)} className="w-20" alt="" />
        <p className="text-5xl">{`${temperature.toFixed()}°`}</p>
        <div className="flex flex-col space-y-2">
          <div className="flex font-light text-sm items-center justify-center">
            <UilTemperature size={18} className="mr-1" />
            Real fell:
            <span className="font-meduim ml-1">{`${kelvinToCelsius(
              feels_like + 3
            ).toFixed()}°`}</span>
          </div>
          <div className="flex font-light text-sm items-center justify-center">
            <UilTear size={18} className="mr-1" />
            Humidity:
            <span className="font-meduim ml-1">{`${relative_humidity.toFixed()}%`}</span>
          </div>
          <div className="flex font-light text-sm items-center justify-center">
            <UilWind size={18} className="mr-1" />
            Wind:
            <span className="font-meduim ml-1">{`${wind_speed.toFixed()} km/h`}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center justify-center space-x-2 text-white text-sm py-3">
        <UilSun />
        <p className="font-light">
          Rise:{" "}
          <span className="font-medium ml-1">
            {formatToLocalTime(sunrise, timezone, "hh:mm a")}
          </span>
        </p>
        <p className="font-light">|</p>
        <UilSunset />
        <p className="font-light">
          Set:{" "}
          <span className="font-medium ml-1">
            {formatToLocalTime(sunset, timezone, "hh:mm a")}
          </span>
        </p>
        <p className="font-light">|</p>
        <UilSun />
        <p className="font-light">
          High: <span className="font-medium ml-1">{`${high.toFixed()}°`}</span>
        </p>
        <p className="font-light">|</p>
        <UilSun />
        <p className="font-light">
          Low: <span className="font-medium ml-1">{`${Math.floor(low)}°`}</span>
        </p>
      </div>
    </div>
  );
};

export default BaselTemperature;
