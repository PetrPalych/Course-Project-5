import React, { useEffect, useState } from "react";
import UilReact from "@iconscout/react-unicons/icons/uil-react";
import TopButtons from "./components/TopButtons";
import Inputs from "./components/Inputs";
import TimeAndLocation from "./components/TimeAndLocation";
import TemperatureAndDetails from "./components/TemperatureAndDetails";
import Forecast from "./components/Forecast";
import getFormattedWeatherData, {
  kelvinToCelsius,
  fetchBaselWeather,
} from "./services/weatherService";
import BaselTimeAndLocation from "./components/Basel/BaselTimeAndLocation";
import BaselTemperature from "./components/Basel/BaselTemperature";
import BaselForecast from "./components/Basel/BaselForecast";
import Loader from "./components/Loader/Loader";

const App = () => {
  const [query, setQuery] = useState({ q: "" });
  const [baselQuery, setBaselQuery] = useState(true);
  const [units, setUnits] = useState("metric");
  const [weather, setWeather] = useState(null);
  const [baselWeather, setBaselWeather] = useState(null);
  const [moreBaselDetails, setMoreBaselDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!query.q == "" || (query.lat && query.lon)) {
      setBaselQuery(false);
      const fetchWeather = async () => {
        setIsLoading(true);

        await getFormattedWeatherData({ ...query, ...units })
          .then((data) => {
            setWeather(data);
          })
          .then(() => setBaselWeather(null));
        setIsLoading(false);
      };

      fetchWeather();
    }
  }, [query]);

  useEffect(() => {
    if (baselQuery) {
      const fetchBasel = async () => {
        setIsLoading(true);

        await getFormattedWeatherData({ q: "basel", ...units }).then((data) => {
          setBaselWeather({ moreDetails: data });
        });

        await fetchBaselWeather()
          .then((res) =>
            setBaselWeather((prevValue) => ({ ...prevValue, ...res }))
          )
          .then(() => setWeather(null));

        setIsLoading(false);
      };
      fetchBasel();
    }
  }, [baselQuery]);

  const formatBackground = () => {
    if (!weather) return "from-cyan-700 to-blue-700";
    const threshold = units === "metric" ? 20 : 60;
    if (kelvinToCelsius(weather.temp) < threshold)
      return "from-cyan-700 to-blue-700";
    return "from-yellow-700 to-orange-700";
  };
  return (
    <div
      className={`mx-auto max-w-screen-md mt-12 py-10 px-28 bg-gradient-to-br from-cyan-700 to-blue-700 h-fit shadow-xl shadow-gray-400 rounded-lg ${formatBackground()}`}
    >
      <TopButtons setQuery={setQuery} setBaselQuery={setBaselQuery} />
      <Inputs
        setQuery={setQuery}
        units={units}
        setUnits={setUnits}
        setBaselQuery={setBaselQuery}
      />
      {isLoading ? (
        <div>
          <Loader />
        </div>
      ) : (
        <>
          {weather && (
            <div>
              <TimeAndLocation weather={weather} />
              <TemperatureAndDetails weather={weather} />
              <Forecast title="hourly forecast" items={weather.hourly} />
              <Forecast title="daily forecast" items={weather.daily} />
            </div>
          )}

          {baselWeather && (
            <div>
              <BaselTimeAndLocation />
              <BaselTemperature baselWeather={baselWeather} />
              <BaselForecast
                title="hourly forecast"
                items={baselWeather.hourlyForecast}
                moreDetails={baselWeather.moreDetails}
              />
              <BaselForecast
                title="daily forecast"
                items={baselWeather.dailyForecast}
                moreDetails={baselWeather.moreDetails}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;
