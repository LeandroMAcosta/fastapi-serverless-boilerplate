from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
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
    root_path="/dev"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],  # Allow all headers
    expose_headers=["*"],
    max_age=300
)

@app.get("/")
async def root():
    # dynamo
    # guardar cosas
    # cognito_user_id
    return {"message": "Welcome to FastAPI Serverless"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/users/me")
async def get_user_me(current_user: TokenData = Depends(get_current_active_user)):
    return current_user

# Lambda handler
@logger.inject_lambda_context
def handler(event: dict, context: LambdaContext) -> dict:
    logger.info("Received event: %s", event)
    asgi_handler = Mangum(app, lifespan="off")
    return asgi_handler(event, context) 