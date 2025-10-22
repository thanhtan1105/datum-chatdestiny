"""
Main entry point for the multi-agent application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
from app.core.config import config
import uvicorn

from app.auth import google_auth_middleware

import logging
import sys

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger(__name__)


def create_app() -> FastAPI:
    """Create and configure FastAPI application"""
    app = FastAPI(
        title="Bedrock Agent Runtime API",
        description="Multi-agent system with tarot swarm, numerology, and welcome agents",
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

# Create app instance
app = create_app()

def main():
    """Main function to start the server"""
    print("🚀 Starting Bedrock Agent Runtime server...")
    uvicorn.run(app, host=config.HOST, port=config.PORT)

def update_agent_runtime():
    import boto3

    import os
    from dotenv import load_dotenv
    load_dotenv()

    client = boto3.client("bedrock-agentcore-control", region_name="us-east-1")

    agent_runtime_id = "chatdestiny-CpdlPd2w1j"

    response = client.update_agent_runtime(
        agentRuntimeId=agent_runtime_id,
        agentRuntimeArtifact={
            'containerConfiguration': {
                'containerUri': '161409283793.dkr.ecr.us-east-1.amazonaws.com/chatdestiny/be:v0.0.7'
            }
        },
        roleArn='arn:aws:iam::161409283793:role/service-role/AmazonBedrockAgentCoreRuntimeDefaultServiceRole-tn742',
        networkConfiguration={
            'networkMode': 'PUBLIC'
        },
        requestHeaderConfiguration={
            'requestHeaderAllowlist': [
                "X-Amzn-Bedrock-AgentCore-Runtime-Custom-App-Auth"
            ]
        },
        environmentVariables={
            'AWS_REGION': os.getenv("AWS_REGION"),
            'CARD_INTERPRETER_PROMPT_ID': os.getenv("CARD_INTERPRETER_PROMPT_ID"),
            'LIFE_ADVISOR_PROMPT_ID': os.getenv("LIFE_ADVISOR_PROMPT_ID"),
            'NUMEROLOGY_PROMPT_ID': os.getenv("NUMEROLOGY_PROMPT_ID"),
            'SPREAD_READER_PROMPT_ID': os.getenv("SPREAD_READER_PROMPT_ID"),
            'WELCOME_PROMPT_ID': os.getenv("WELCOME_PROMPT_ID"),
            'ROUTER_PROMPT_ID': os.getenv("ROUTER_PROMPT_ID"),
            'MCP_SERVER_URI': os.getenv("MCP_SERVER_URI"),
            'MEMORY_ID': os.getenv("MEMORY_ID")
        }
    )
    print(response)


if __name__ == "__main__":
    # main()
    update_agent_runtime()
