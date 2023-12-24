import React, { useEffect, useState } from "react";
import { format } from "date-fns";

const BaselTimeAndLocation = () => {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const fetchBaselTime = () => {
      const baselTime = new Date();
      const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: false,
        timeZone: "Europe/Zurich",
      };

      const formattedTime = baselTime.toLocaleString("en-US", options);
      setCurrentTime(formattedTime);
    };

    fetchBaselTime();

    const intervalId = setInterval(fetchBaselTime, 60000);

    return () => clearInterval(intervalId);
  }, []);
  return (
    <div>
      <div className="flex items-center justify-center my-6">
        <p className="text-white text-xl font-extralight">{currentTime}</p>
      </div>
      <div className="flex items-center justify-center my-3">
        <p className="text-white text-3xl font-medium">Basel, CH</p>
      </div>
    </div>
  );
};

export default BaselTimeAndLocation;
