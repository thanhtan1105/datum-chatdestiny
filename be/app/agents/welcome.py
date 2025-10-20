from strands import Agent
from strands.models import BedrockModel
from strands.types.content import Messages
from app.core.config import config
from app.core.prompt_manager import prompt_manager

model = BedrockModel(
    model_id=config.MODEL_ID,
    region_name=config.AWS_REGION
)

# Get prompt config with version
prompt_config = prompt_manager.get_prompt_config(
    config.WELCOME_PROMPT_ID,
    config.WELCOME_PROMPT_VERSION
)

def create_welcome_agent(messages: Messages = None):
    """Create welcome agent with optional conversation history"""
    return Agent(
        name="welcome",
        system_prompt=prompt_config.text,
        model=model,
        messages=messages or []
    )

# Default agent without history
welcome_agent = create_welcome_agent()
