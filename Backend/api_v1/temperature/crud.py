from core.models.enums import ForecastType
from models.ann.model_temperature import predict_current_hour_weather as prediction
from models.ann.model_temperature import predict_weather

from .schemas import CurrentForecast, HourlyForecast, DailyForecast


async def get_current_forecast() -> CurrentForecast:
    return prediction()

async def get_hourly_forecast() -> list[HourlyForecast]:
    return predict_weather(forecast_type=ForecastType.HOURLY)


async def get_daily_forecast() -> list[DailyForecast]:
    return predict_weather(forecast_type=ForecastType.DAILY)

