from mcp.client.sse import sse_client
from strands import Agent
from strands.models import BedrockModel
from strands.tools.mcp import MCPClient
from strands.types.content import Messages
from app.core.config import config
from app.core.prompt_manager import prompt_manager

# Connect to MCP server using SSE transport
sse_mcp_client = MCPClient(lambda: sse_client(config.MCP_SERVER_URI))

model = BedrockModel(
    model_id=config.MODEL_ID,
    region_name=config.AWS_REGION
)

# Start the MCP client session
sse_mcp_client.__enter__()

# Get tools from MCP server
mcp_tools = sse_mcp_client.list_tools_sync()

# Get prompt config with version
prompt_config = prompt_manager.get_prompt_config(
    config.NUMEROLOGY_PROMPT_ID,
    config.NUMEROLOGY_PROMPT_VERSION
)

def create_numerology_agent(messages: Messages = None):
    """Create numerology agent with optional conversation history"""
    return Agent(
        name="numerology",
        system_prompt=prompt_config.text,
        model=model,
        tools=mcp_tools,
        messages=messages or []
    )

# Default agent without history
numerology_agent = create_numerology_agent()
