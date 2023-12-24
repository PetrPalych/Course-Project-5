import React, { useState } from "react";
import {
  iconUrlFromCode,
  kelvinToCelsius,
} from "../../services/weatherService";

const BaselForecast = ({ title, items, moreDetails }) => {
  const [isDaily, setisDaily] = useState(
    title == "daily forecast" ? true : false
  );
  const combinedArray = items.map((dailyItem, index) => {
    const moreDetailsItem = isDaily
      ? moreDetails.daily[index]
      : moreDetails.hourly[index];
    return {
      year: dailyItem.year,
      month: dailyItem.month,
      day: dailyItem.day,
      hour: dailyItem.hour,
      temperature: dailyItem.temperature,
      title: moreDetailsItem.title,
      icon: moreDetailsItem.icon,
    };
  });

  return (
    <div>
      <div className="flex items-center justify-start mt-6">
        <p className="text-white font-medium uppercase">{title}</p>
      </div>
      <hr className="my-2" />
      <div className="flex flex-row items-center justify-between text-white">
        {combinedArray.map((item) => (
          <div
            key={item.title}
            className="flex flex-col items-center justify-center"
          >
            <p className="font-light text-sm">
              {isDaily ? item.title : item.hour}
            </p>
            <img
              src={iconUrlFromCode(item.icon)}
              className="w-12 my-1"
              alt=""
            />
            <p className="font-medium">{`${item.temperature.toFixed()}°`}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BaselForecast;
