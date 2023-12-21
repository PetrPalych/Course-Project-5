from fastapi import FastAPI

from core.config import settings
from api_v1 import router as router_v1

from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
app.include_router(router=router_v1, prefix=settings.api_v1_prefix)

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost*",
    "http://localhost:*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
