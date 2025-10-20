from strands import Agent
from strands.models import BedrockModel
from app.core.config import config
from app.core.prompt_manager import prompt_manager

model = BedrockModel(
    model_id=config.MODEL_ID,
    region_name=config.AWS_REGION
)

# Get prompt config with version
prompt_config = prompt_manager.get_prompt_config(
    config.ROUTER_PROMPT_ID,
    config.ROUTER_PROMPT_VERSION
)

router_agent = Agent(
    name="router",
    system_prompt=prompt_config.text,
    model=model
)
