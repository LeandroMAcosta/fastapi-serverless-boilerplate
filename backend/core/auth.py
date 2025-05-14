from typing import Optional
import json
import requests
from fastapi import HTTPException, Security, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import jwt, JWTError
from pydantic import BaseModel
from core.config import get_settings

settings = get_settings()
security = HTTPBearer()

class TokenData(BaseModel):
    username: Optional[str] = None
    sub: Optional[str] = None

def get_cognito_public_key():
    """Fetch the Cognito public key from the JWKS endpoint."""
    jwks_url = f"https://cognito-idp.{settings.AWS_REGION}.amazonaws.com/{settings.COGNITO_USER_POOL_ID}/.well-known/jwks.json"
    response = requests.get(jwks_url)
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Could not fetch Cognito public key")
    
    jwks = response.json()
    # Get the first key (usually there's only one)
    return jwks["keys"][0]["n"]

async def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        token = credentials.credentials
        public_key = get_cognito_public_key()
        payload = jwt.decode(
            token,
            public_key,
            algorithms=["RS256"],
            audience=settings.COGNITO_CLIENT_ID
        )
        username: str = payload.get("username")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username, sub=payload.get("sub"))
        return token_data
    except JWTError:
        raise credentials_exception

def get_current_active_user(current_user: TokenData = Depends(get_current_user)):
    return current_user 