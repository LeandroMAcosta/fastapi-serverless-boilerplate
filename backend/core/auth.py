from typing import Optional
import json
from aws_lambda_powertools import Logger
import requests
from fastapi import HTTPException, Security, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import jwt, JWTError
from pydantic import BaseModel
from core.config import get_settings
from cryptography.hazmat.primitives.asymmetric.rsa import RSAPublicNumbers
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization
import base64

settings = get_settings()
security = HTTPBearer()

logger = Logger()

class TokenData(BaseModel):
    email: Optional[str] = None
    sub: Optional[str] = None

def get_cognito_public_key():
    """Fetch the Cognito public key from the JWKS endpoint and construct an RSA public key."""
    jwks_url = f"https://cognito-idp.{settings.AWS_REGION}.amazonaws.com/{settings.COGNITO_USER_POOL_ID}/.well-known/jwks.json"
    response = requests.get(jwks_url)
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Could not fetch Cognito public key")
    
    jwks = response.json()
    # Get the first key (usually there's only one)
    key = jwks["keys"][0]
    
    # Convert the base64 encoded modulus and exponent to integers
    modulus = int.from_bytes(base64.urlsafe_b64decode(key["n"] + "=" * (-len(key["n"]) % 4)), byteorder="big")
    exponent = int.from_bytes(base64.urlsafe_b64decode(key["e"] + "=" * (-len(key["e"]) % 4)), byteorder="big")
    
    # Construct the RSA public key
    numbers = RSAPublicNumbers(exponent, modulus)
    public_key = numbers.public_key(backend=default_backend())
    
    # Serialize the public key to PEM format
    pem = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )
    
    return pem

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
        email: str = payload.get("email")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email, sub=payload.get("sub"))
        return token_data
    except JWTError:
        raise credentials_exception

def get_current_active_user(current_user: TokenData = Depends(get_current_user)):
    return current_user 