"""
FastAPI server application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
from app.core.config import config
from app.auth import google_auth_middleware
import uvicorn

def create_app() -> FastAPI:
    """Create and configure FastAPI application"""
    app = FastAPI(
        title="Multi-Agent Graph API",
        description="Multi-agent system with router, welcome, and numerology agents",
        version="1.0.0"
    )

    app.middleware("http")(google_auth_middleware)

    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include routes
    app.include_router(router)

    return app

app = create_app()

def start_server():
    """Start the FastAPI server"""
    uvicorn.run(app, host=config.HOST, port=config.PORT)

if __name__ == "__main__":
    start_server()
