"""
Google OAuth token verification middleware
"""
import os
import httpx
from fastapi import HTTPException, Request, status
from typing import Optional, Dict, Any
import json
import logging

logger = logging.getLogger(__name__)

GOOGLE_TOKEN_INFO_URL = "https://oauth2.googleapis.com/tokeninfo"

async def verify_google_token(token: str) -> Dict[str, Any]:
    """
    Verify Google OAuth token with Google's tokeninfo endpoint

    Args:
        token: The access token to verify

    Returns:
        Dict containing token information if valid

    Raises:
        HTTPException: If token is invalid or verification fails
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                GOOGLE_TOKEN_INFO_URL,
                params={"access_token": token},
                timeout=10.0
            )

            if response.status_code != 200:
                logger.warning(f"Google token verification failed with status {response.status_code}")
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid or expired Google access token",
                    headers={"WWW-Authenticate": "Bearer"},
                )

            token_info = response.json()

            logger.info(f"Successfully verified Google token for user: {token_info.get('email', 'unknown')}")
            return token_info

    except httpx.TimeoutException:
        logger.error("Timeout while verifying Google token")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Token verification service unavailable"
        )
    except httpx.RequestError as e:
        logger.error(f"Network error during token verification: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Token verification service unavailable"
        )
    except json.JSONDecodeError:
        logger.error("Invalid JSON response from Google token verification")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token verification response",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        logger.error(f"Unexpected error during token verification: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during authentication"
        )

async def google_auth_middleware(request: Request, call_next):
    """
    Middleware to verify Google OAuth tokens for ALL endpoints

    This middleware:
    1. Extracts the Bearer token from Authorization header
    2. Verifies it with Google's OAuth2 tokeninfo endpoint
    3. Adds user info to request state for use in endpoints
    4. Blocks access if token is invalid or missing
    """
    if "/ping" in str(request.url.path):
        return await call_next(request)

    logger.info(f"headers: {request.headers}")
    authorization: Optional[str] = request.headers.get("x-amzn-bedrock-agentcore-runtime-custom-app-auth")

    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing. Please provide a valid Google access token.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        scheme, token = authorization.split(" ", 1)
        if scheme.lower() != "bearer":
            raise ValueError("Invalid scheme")
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format. Expected: Bearer <google_access_token>",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token_info = await verify_google_token(token)

    request.state.user_info = token_info
    request.state.user_email = token_info.get("email")
    request.state.user_id = token_info.get("sub") 

    response = await call_next(request)
    return response
