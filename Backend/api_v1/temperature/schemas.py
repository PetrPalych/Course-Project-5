from pydantic import BaseModel, ConfigDict


class ForecastBase(BaseModel):
    year: int
    month: int
    day: int
    hour: int
    temperature: float


class HourlyForecast(ForecastBase):
    model_config = ConfigDict(from_attributes=True)
    relative_humidity: float
    wind_speed: float


class DailyForecast(ForecastBase):
    model_config = ConfigDict(from_attributes=True)
