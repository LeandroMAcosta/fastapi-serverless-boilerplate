from fastapi import APIRouter
from api.v1.endpoints import health

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"]) 