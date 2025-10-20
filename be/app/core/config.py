"""
Configuration management for the application
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
env_path = Path(__file__).parent.parent.parent / ".env"
load_dotenv(env_path)

class Config:
    """Application configuration"""
    
    # AWS Configuration
    AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
    AWS_PROFILE = os.getenv("AWS_PROFILE", "default")
    
    # Model Configuration
    MODEL_ID = os.getenv("MODEL_ID", "amazon.nova-micro-v1:0")
    
    # Memory Configuration
    MEMORY_ID = os.getenv("MEMORY_ID")
    
    # MCP Configuration
    MCP_SERVER_URI = os.getenv("MCP_SERVER_URI", "http://152.42.161.137:8001/sse")
    
    # Prompt Management Configuration (Required)
    ROUTER_PROMPT_ID = os.getenv("ROUTER_PROMPT_ID")
    WELCOME_PROMPT_ID = os.getenv("WELCOME_PROMPT_ID")
    NUMEROLOGY_PROMPT_ID = os.getenv("NUMEROLOGY_PROMPT_ID")
    
    # Tarot Prompt IDs
    CARD_INTERPRETER_PROMPT_ID = os.getenv("CARD_INTERPRETER_PROMPT_ID")
    SPREAD_READER_PROMPT_ID = os.getenv("SPREAD_READER_PROMPT_ID")
    LIFE_ADVISOR_PROMPT_ID = os.getenv("LIFE_ADVISOR_PROMPT_ID")
    
    # Prompt Versions (Optional - defaults to latest)
    ROUTER_PROMPT_VERSION = os.getenv("ROUTER_PROMPT_VERSION")
    WELCOME_PROMPT_VERSION = os.getenv("WELCOME_PROMPT_VERSION")
    NUMEROLOGY_PROMPT_VERSION = os.getenv("NUMEROLOGY_PROMPT_VERSION")
    
    # Tarot Prompt Versions
    CARD_INTERPRETER_PROMPT_VERSION = os.getenv("CARD_INTERPRETER_PROMPT_VERSION")
    SPREAD_READER_PROMPT_VERSION = os.getenv("SPREAD_READER_PROMPT_VERSION")
    LIFE_ADVISOR_PROMPT_VERSION = os.getenv("LIFE_ADVISOR_PROMPT_VERSION")
    
    # Server Configuration
    HOST = os.getenv("HOST", "0.0.0.0")
    PORT = int(os.getenv("PORT", "8000"))
    
    @classmethod
    def validate(cls):
        """Validate required configuration"""
        if not cls.MCP_SERVER_URI:
            raise ValueError("MCP_SERVER_URI is required")
        if not cls.ROUTER_PROMPT_ID:
            raise ValueError("ROUTER_PROMPT_ID is required")
        if not cls.WELCOME_PROMPT_ID:
            raise ValueError("WELCOME_PROMPT_ID is required")
        if not cls.NUMEROLOGY_PROMPT_ID:
            raise ValueError("NUMEROLOGY_PROMPT_ID is required")
        if not cls.CARD_INTERPRETER_PROMPT_ID:
            raise ValueError("CARD_INTERPRETER_PROMPT_ID is required")
        if not cls.SPREAD_READER_PROMPT_ID:
            raise ValueError("SPREAD_READER_PROMPT_ID is required")
        if not cls.LIFE_ADVISOR_PROMPT_ID:
            raise ValueError("LIFE_ADVISOR_PROMPT_ID is required")
        return True

config = Config()
