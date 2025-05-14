from typing import Optional
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    PROJECT_NAME: str = "FastAPI Serverless"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # AWS Settings
    AWS_REGION: str = "us-east-1"
    
    # Cognito Settings
    COGNITO_USER_POOL_ID: Optional[str] = None
    COGNITO_CLIENT_ID: Optional[str] = None
    
    # DynamoDB Settings
    DYNAMODB_TABLE_NAME: str = "app-table"
    
    class Config:
        case_sensitive = True
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    return Settings() 