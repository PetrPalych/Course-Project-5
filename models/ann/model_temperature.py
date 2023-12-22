import os

import pandas as pd
import joblib

from keras.models import load_model
from datetime import datetime, timedelta

from api_v1.temperature.schemas import HourlyForecast, DailyForecast
from core.models.enums import ForecastType

current_dir = os.path.dirname(__file__)
file_path = os.path.join(current_dir, '../../core/db/basel(1940-2023).csv')
keras_temperature_file_path = os.path.join(current_dir, 'keras/best_model_temperature.keras')
keras_relative_humidity_file_path = os.path.join(current_dir, 'keras/best_model_relative_humidity.keras')
keras_wind_speed_file_path = os.path.join(current_dir, 'keras/best_model_wind_speed.keras')


joblib_temperature_file_path = os.path.join(current_dir, 'scalers/scaler_temperature.joblib')
joblib_relative_humidity_file_path = os.path.join(current_dir, 'scalers/scaler_relative_humidity.joblib')
joblib_wind_speed_file_path = os.path.join(current_dir, 'scalers/scaler_wind_speed.joblib')

data = pd.read_csv(file_path)

scaler_temperature = joblib.load(joblib_temperature_file_path)
scaler_relative_humidity = joblib.load(joblib_relative_humidity_file_path)
scaler_wind_speed = joblib.load(joblib_wind_speed_file_path)

model_temperature = load_model(keras_temperature_file_path)
model_relative_humidity = load_model(keras_relative_humidity_file_path)
model_wind_speed = load_model(keras_wind_speed_file_path)


def predict_weather(forecast_type: ForecastType) -> list[HourlyForecast] | list[DailyForecast]:
    current_date_time = datetime.now()

    year = current_date_time.year
    month = current_date_time.month
    day = current_date_time.day
    hour = current_date_time.hour

    current_date = datetime(year, month, day, hour)
    current_hour_data = get_current_hour_data(year, month, day, hour)

    hourly_forecast = []
    daily_forecast = []
    for i in range(5):
        target_hour = current_date + timedelta(hours=i)
        target_day = current_date + timedelta(days=i)

        hourly_weather_variations = get_last_5_hours_data(target_hour.year, target_hour.month, target_hour.day,
                                                          target_hour.hour)
        daily_weather_variations = get_last_5_days_data(target_day.year, target_day.month, target_day.day,
                                                        target_day.hour)

        hourly_temperature_prediction = predict_temperature_next_hour(current_hour_data, hourly_weather_variations)

        hourly_relative_humidity_prediction = predict_relative_humidity_next_hour(current_hour_data,
                                                                                  hourly_weather_variations,
                                                                                  daily_weather_variations)

        hourly_wind_speed_prediction = predict_wind_speed_next_hour(current_hour_data,
                                                                    hourly_weather_variations,
                                                                    daily_weather_variations)

        hourly_forecast.append(HourlyForecast(year=target_hour.year,
                                              month=target_hour.month,
                                              day=target_hour.day,
                                              hour=target_hour.hour,
                                              temperature=hourly_temperature_prediction,
                                              relative_humidity=hourly_relative_humidity_prediction,
                                              wind_speed=hourly_wind_speed_prediction))

        daily_temperature_prediction = predict_temperature_next_day(current_hour_data,
                                                                    hourly_weather_variations,
                                                                    daily_weather_variations)

        daily_forecast.append(DailyForecast(year=target_hour.year,
                                            month=target_hour.month,
                                            day=target_hour.day,
                                            hour=target_hour.hour,
                                            temperature=daily_temperature_prediction))

    if forecast_type == ForecastType.DAILY:
        return daily_forecast
    else:
        return hourly_forecast


def get_current_hour_data(year, month, day, hour):
    current_hour_data = data[(data['Year'] == year) &
                             (data['Month'] == month) &
                             (data['Day'] == day) &
                             (data['Hour'] == hour)]

    while current_hour_data.empty:
        year -= 1

        current_hour_data = data[(data['Year'] == year) &
                                 (data['Month'] == month) &
                                 (data['Day'] == day) &
                                 (data['Hour'] == hour)]

    return current_hour_data


def get_current_hour(year: int, month: int, day: int, hour: int):
    current_hour_data = data[(data['Year'] == year) &
                             (data['Month'] == month) &
                             (data['Day'] == day) &
                             (data['Hour'] == hour)]

    while current_hour_data.empty:
        year -= 1

        current_hour_data = data[(data['Year'] == year) &
                                 (data['Month'] == month) &
                                 (data['Day'] == day) &
                                 (data['Hour'] == hour)]

    return HourlyForecast(year=current_hour_data['Year'], month=current_hour_data['Month'],
                          day=current_hour_data['Day'], hour=current_hour_data['Hour'],
                          temperature=current_hour_data['Temperature [2 m elevation corrected]'],
                          relative_humidity=current_hour_data['Relative Humidity [2 m]'],
                          wind_speed=current_hour_data['Wind Speed [10 m]'])


def get_last_5_hours_data(year, month, day, hour):
    target_date = datetime(year, month, day, hour)
    target_dates = [target_date - timedelta(hours=i) for i in range(1, 6)]

    last_5_hours_data = pd.concat([data[(data['Year'] == date.year) &
                                        (data['Month'] == date.month) &
                                        (data['Day'] == date.day) &
                                        (data['Hour'] == date.hour)] for date in target_dates], ignore_index=True)

    while last_5_hours_data.empty:
        target_date -= timedelta(days=365)
        target_dates = [target_date - timedelta(hours=i) for i in range(1, 6)]

        last_5_hours_data = pd.concat([data[(data['Year'] == date.year) &
                                            (data['Month'] == date.month) &
                                            (data['Day'] == date.day) &
                                            (data['Hour'] == date.hour)] for date in target_dates], ignore_index=True)

    return last_5_hours_data


def get_last_5_days_data(year, month, day, hour):
    target_date = datetime(year, month, day, hour)
    target_dates = [target_date - timedelta(days=i) for i in range(1, 6)]

    last_5_days_data = pd.concat([data[(data['Year'] == date.year) &
                                       (data['Month'] == date.month) &
                                       (data['Day'] == date.day)] for date in target_dates], ignore_index=True)

    while last_5_days_data.empty:
        target_date -= timedelta(days=365)
        target_dates = [target_date - timedelta(days=i) for i in range(1, 6)]

        last_5_days_data = pd.concat([data[(data['Year'] == date.year) &
                                           (data['Month'] == date.month) &
                                           (data['Day'] == date.day)] for date in target_dates], ignore_index=True)

    return last_5_days_data


def predict_temperature_next_hour(current_hour_data, last_5_hours_data):
    current_hour_data = current_hour_data.drop(['Temperature [2 m elevation corrected]'], axis=1)
    last_5_hours_data = last_5_hours_data.drop(['Temperature [2 m elevation corrected]'], axis=1)

    middle_point = (current_hour_data + last_5_hours_data.mean()) / 2
    middle_point_scaled = scaler_temperature.transform(middle_point)

    prediction = model_temperature.predict(middle_point_scaled)
    return prediction


def predict_temperature_next_day(current_hour_data, last_5_hours_data, last_5_days_data):
    current_hour_data = current_hour_data.drop(['Temperature [2 m elevation corrected]'], axis=1)
    last_5_hours_data = last_5_hours_data.drop(['Temperature [2 m elevation corrected]'], axis=1)
    last_5_days_data = last_5_days_data.drop(['Temperature [2 m elevation corrected]'], axis=1)

    middle_point = (current_hour_data + last_5_hours_data.mean() + last_5_days_data.mean()) / 3
    middle_point_scaled = scaler_temperature.transform(middle_point)

    prediction = model_temperature.predict(middle_point_scaled)
    return prediction


def predict_relative_humidity_next_hour(current_hour_data, last_5_hours_data, last_5_days_data):
    current_hour_data = current_hour_data.drop(['Relative Humidity [2 m]'], axis=1)
    last_5_hours_data = last_5_hours_data.drop(['Relative Humidity [2 m]'], axis=1)
    last_5_days_data = last_5_days_data.drop(['Relative Humidity [2 m]'], axis=1)

    middle_point = (current_hour_data + last_5_hours_data.mean() + last_5_days_data.mean()) / 3
    middle_point_scaled = scaler_relative_humidity.transform(middle_point)

    prediction = model_relative_humidity.predict(middle_point_scaled)
    return prediction


def predict_wind_speed_next_hour(current_hour_data, last_5_hours_data, last_5_days_data):
    current_hour_data = current_hour_data.drop(['Wind Speed [10 m]'], axis=1)
    last_5_hours_data = last_5_hours_data.drop(['Wind Speed [10 m]'], axis=1)
    last_5_days_data = last_5_days_data.drop(['Wind Speed [10 m]'], axis=1)

    middle_point = (current_hour_data + last_5_hours_data.mean() + last_5_days_data.mean()) / 3
    middle_point_scaled = scaler_wind_speed.transform(middle_point)

    prediction = model_wind_speed.predict(middle_point_scaled)
    return prediction
