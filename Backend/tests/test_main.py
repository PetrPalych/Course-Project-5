from fastapi.testclient import TestClient
from main import app


client = TestClient(app)


def test_get_specific_weather_forecast():
    response = client.get("/2023/12/22/10")
    assert response.status_code == 404

    mock_forecast_data = {
        "year": 2023,
        "month": 12,
        "day": 22,
        "hour": 10,
        "temperature": 25,
        "relative_humidity": 60,
        "wind_speed": 10,
    }

    response = client.get("/2023/12/22/10")
    assert response.status_code == 200
    assert response.json() == mock_forecast_data


def test_get_next_five_hours_weather_forecast():
    mock_forecasts = [
        {
            "year": 2023,
            "month": 12,
            "day": 22,
            "hour": i,
            "temperature": 25,
            "relative_humidity": 60,
            "wind_speed": 10,
        } for i in range(5)
    ]

    response = client.get("/hourly-forecast")
    assert response.status_code == 200
    assert response.json() == mock_forecasts


def test_get_next_five_days_weather_forecast():
    mock_forecasts = [
        {
            "year": 2023,
            "month": 12,
            "day": 23 + i,
            "temperature": 25,
            "relative_humidity": 60,
            "wind_speed": 10,
        } for i in range(5)
    ]

    response = client.get("/daily-forecast")
    assert response.status_code == 200
    assert response.json() == mock_forecasts
