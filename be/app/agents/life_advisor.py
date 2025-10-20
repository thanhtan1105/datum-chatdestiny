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
    config.LIFE_ADVISOR_PROMPT_ID,
    config.LIFE_ADVISOR_PROMPT_VERSION
)

def create_life_advisor_agent(messages: Messages = None):
    """Create life advisor agent with optional conversation history"""
    return Agent(
        name="life_advisor",
        system_prompt=prompt_config.text,
        model=model,
        messages=messages or []
    )

# Default agent without history
life_advisor_agent = create_life_advisor_agent()
