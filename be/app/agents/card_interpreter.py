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
    config.CARD_INTERPRETER_PROMPT_ID,
    config.CARD_INTERPRETER_PROMPT_VERSION
)

def create_card_interpreter_agent(messages: Messages = None):
    """Create card interpreter agent with optional conversation history"""
    return Agent(
        name="card_interpreter",
        system_prompt=prompt_config.text,
        model=model,
        messages=messages or []
    )

# Default agent without history
card_interpreter_agent = create_card_interpreter_agent()
