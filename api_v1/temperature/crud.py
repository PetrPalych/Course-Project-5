from core.models.enums import ForecastType
from models.ann.model_temperature import get_current_hour as prediction
from models.ann.model_temperature import predict_weather

from .schemas import HourlyForecast, DailyForecast


async def get_current_forecast(
        year: int,
        month: int,
        day: int,
        hour: int
) -> HourlyForecast:
    return prediction(year=year, month=month, day=day, hour=hour)


async def get_hourly_forecast() -> list[HourlyForecast]:
    return predict_weather(forecast_type=ForecastType.HOURLY)


async def get_daily_forecast() -> list[DailyForecast]:
    return predict_weather(forecast_type=ForecastType.DAILY)
