"""
Main entry point for the multi-agent application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
from app.core.config import config
import uvicorn

def create_app() -> FastAPI:
    """Create and configure FastAPI application"""
    app = FastAPI(
        title="Bedrock Agent Runtime API",
        description="Multi-agent system with tarot swarm, numerology, and welcome agents",
        version="1.0.0"
    )
    
    # # Configure CORS
    # app.add_middleware(
    #     CORSMiddleware,
    #     allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    #     allow_credentials=True,
    #     allow_methods=["*"],
    #     allow_headers=["*"],
    # )
    
    # Include routes
    app.include_router(router)
    
    return app

# Create app instance
app = create_app()

def main():
    """Main function to start the server"""
    print("🚀 Starting Bedrock Agent Runtime server...")
    uvicorn.run(app, host=config.HOST, port=config.PORT)

if __name__ == "__main__":
    main()
