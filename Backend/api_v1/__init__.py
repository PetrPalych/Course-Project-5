from fastapi import APIRouter

from .temperature.views import router as temperature_router


router = APIRouter()
router.include_router(router=temperature_router, prefix="/temperature")
