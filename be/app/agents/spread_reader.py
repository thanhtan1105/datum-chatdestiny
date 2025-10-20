from strands import Agent
from strands.models import BedrockModel
from strands.types.content import Messages
from app.core.config import config
from app.core.prompt_manager import prompt_manager
from app.tools.tarot_tools import draw_tarot_cards

model = BedrockModel(
    model_id=config.MODEL_ID,
    region_name=config.AWS_REGION
)

# Get prompt config with version
prompt_config = prompt_manager.get_prompt_config(
    config.SPREAD_READER_PROMPT_ID,
    config.SPREAD_READER_PROMPT_VERSION
)

def create_spread_reader_agent(messages: Messages = None):
    """Create spread reader agent with optional conversation history"""
    return Agent(
        name="spread_reader",
        system_prompt=prompt_config.text,
        model=model,
        tools=[draw_tarot_cards],  # Add tarot card drawing tool
        messages=messages or []
    )

# Default agent without history
spread_reader_agent = create_spread_reader_agent()
