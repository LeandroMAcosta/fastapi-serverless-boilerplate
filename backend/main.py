from fastapi import FastAPI, Depends
from mangum import Mangum
from aws_lambda_powertools import Logger
from aws_lambda_powertools.utilities.typing import LambdaContext

from core.config import get_settings
from core.auth import get_current_active_user, TokenData

settings = get_settings()
logger = Logger()
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    # openapi_url=f"{settings.API_V1_STR}/openapi.json",
    # docs_url=f"{settings.API_V1_STR}/docs",
    # redoc_url=f"{settings.API_V1_STR}/redoc",
)

@app.get("/")
async def root():
    return {"message": "Welcome to FastAPI Serverless"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/protected")
async def protected_route(current_user: TokenData = Depends(get_current_active_user)):
    return {
        "message": "This is a protected route",
        "user": current_user.username
    }

# Lambda handler
@logger.inject_lambda_context
def handler(event: dict, context: LambdaContext) -> dict:
    asgi_handler = Mangum(app)
    return asgi_handler(event, context) 