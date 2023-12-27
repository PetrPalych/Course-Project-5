import { DateTime } from "luxon";
import { format } from "date-fns";

const API_KEY = "25f851fcd1ea106d2cf5b44c87143287";
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const BASEL_BASE_URL = "http://127.0.0.1:8000/api/v1/temperature";

const getWeatherData = (infoType, searchParams) => {
  const url = new URL(BASE_URL + "/" + infoType);
  url.search = new URLSearchParams({ ...searchParams, appid: API_KEY });

  return fetch(url)
    .then((res) => res.json())
    .then((data) => data);
};

const formatCurrentWeather = (data) => {
  const {
    coord: { lat, lon },
    main: { temp, feels_like, temp_min, temp_max, humidity },
    name,
    dt,
    sys: { country, sunrise, sunset },
    weather,
    wind: { speed },
  } = data;

  const { main: details, icon } = weather[0];

  return {
    lat,
    lon,
    temp,
    feels_like,
    temp_min,
    temp_max,
    humidity,
    name,
    dt,
    country,
    sunrise,
    sunset,
    details,
    icon,
    speed,
  };
};

const formatForecastWeather = (data) => {
  let { timezone, daily, hourly } = data;
  daily = daily.slice(1, 6).map((d) => {
    return {
      title: formatToLocalTime(d.dt, timezone, "ccc"),
      temp: d.temp.day,
      icon: d.weather[0].icon,
    };
  });

  hourly = hourly.slice(1, 6).map((d) => {
    return {
      title: formatToLocalTime(d.dt, timezone, "hh:mm a"),
      temp: d.temp,
      icon: d.weather[0].icon,
    };
  });

  return { timezone, daily, hourly };
};

const getFormattedWeatherData = async (searchParams) => {
  const formattedCurrentWeather = await getWeatherData(
    "weather",
    searchParams
  ).then(formatCurrentWeather);

  const { lat, lon } = formattedCurrentWeather;

  const formattedForecastWeather = await getWeatherData("onecall", {
    lat,
    lon,
    exclude: "current,minutely,alerts",
    units: searchParams.units,
  }).then(formatForecastWeather);

  return { ...formattedCurrentWeather, ...formattedForecastWeather };
};

const formatToLocalTime = (
  secs,
  zone,
  format = "cccc, dd LLL yyyy' | Local Time: 'hh:mm a"
) => DateTime.fromSeconds(secs).setZone(zone).toFormat(format);

const iconUrlFromCode = (code) =>
  `http://openweathermap.org/img/wn/${code}@2x.png`;

const kelvinToCelsius = (kelvin) => {
  if (typeof kelvin != "number" || isNaN(kelvin)) {
    return "It's not a number";
  }
  const celsius = kelvin - 273.15;
  return celsius;
};

const getCurrentDate = () => {
  const baselTime = new Date();
  const options = {
    hour12: false,
    timeZone: "Europe/Zurich",
  };

  const formattedTime = baselTime.toLocaleString("en-US", options);
  const formattedDate = format(formattedTime, "yyyy/MM/dd/HH");

  return formattedDate;
};

const fetchBaselWeather = async () => {
  const dailyAndHourly = await fetchBaselForecastData();
  const temperatureAndDetails = await fetchBaselTemperatureData();
  const weather = {
    temperatureAndDetails,
    dailyForecast: dailyAndHourly[0],
    hourlyForecast: dailyAndHourly[1],
  };
  return weather;
};

const fetchBaselTemperatureData = async () => {
  const currentDate = getCurrentDate();
  try {
    const response = await fetch(BASEL_BASE_URL + "/get-temperature", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    });
    const result = response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
};

const fetchBaselForecastData = async () => {
  try {
    const responseHourly = await fetch(BASEL_BASE_URL + "/hourly-forecast", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    });
    const hourlyForecast = await responseHourly.json();

    const responseDaily = await fetch(BASEL_BASE_URL + "/daily-forecast", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    });
    const dailyForecast = await responseDaily.json();

    return [dailyForecast, hourlyForecast];
  } catch (error) {
    console.log(error);
  }
};

export default getFormattedWeatherData;

export {
  formatToLocalTime,
  iconUrlFromCode,
  kelvinToCelsius,
  getCurrentDate,
  fetchBaselWeather,
};
