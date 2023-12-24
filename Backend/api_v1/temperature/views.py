from typing import Annotated

from fastapi import APIRouter, Path

from . import crud
from .schemas import HourlyForecast, DailyForecast

router = APIRouter(tags=["Weather Forecast"])


@router.get(
    path="/{year}/{month}/{day}/{hour}",
    response_model=HourlyForecast,
    summary="Get forecasts the weather for a specific date",
    description="Retrieve the weather forecast for a specific date and hour. "
                "Provide the year, month, day, and hour as path parameters to get the detailed hourly forecast data.",
)
async def get_specific_weather_forecast(
    year: Annotated[int, Path],
    month: Annotated[int, Path],
    day: Annotated[int, Path],
    hour: Annotated[int, Path]
) -> HourlyForecast:
    prediction = await crud.get_current_forecast(year=year, month=month, day=day, hour=hour)
    return prediction


@router.get(
    path="/hourly-forecast",
    response_model=list[HourlyForecast],
    summary="Get forecasts the weather for the next 5 hours",
    description="Returns a list of hourly weather forecasts for the next 5 hours from the current date."
)
async def get_next_five_hours_weather_forecast() -> list[HourlyForecast]:
    return await crud.get_hourly_forecast()


@router.get(
    path="/daily-forecast",
    response_model=list[DailyForecast],
    summary="Get forecasts the weather for the next 5 days",
    description="Returns a list of daily weather forecasts for the next 5 days from the current date."
)
async def get_next_five_days_weather_forecast() -> list[DailyForecast]:
    return await crud.get_daily_forecast()
