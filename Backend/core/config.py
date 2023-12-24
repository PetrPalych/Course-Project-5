from pydantic.v1 import BaseSettings


class Settings(BaseSettings):
    api_v1_prefix: str = "/api/v1"


settings = Settings()
