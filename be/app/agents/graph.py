from strands.multiagent import GraphBuilder
from strands.types.content import Messages
from .router import router_agent
from .welcome import create_welcome_agent, welcome_agent
from .numerology import create_numerology_agent, numerology_agent
from .tarot_swarm import create_tarot_swarm_with_history, tarot_swarm

def route_to_welcome(state):
    """Route to welcome agent if router decides on welcome."""
    router_result = state.results.get("router")
    if not router_result or not router_result.result:
        return False
    result_text = str(router_result.result).lower().strip()
    return "welcome" in result_text

def route_to_numerology(state):
    """Route to numerology agent if router decides on numerology."""
    router_result = state.results.get("router")
    if not router_result or not router_result.result:
        return False
    result_text = str(router_result.result).lower().strip()
    return "numerology" in result_text

def route_to_tarot(state):
    """Route to tarot swarm if router decides on tarot."""
    router_result = state.results.get("router")
    if not router_result or not router_result.result:
        return False
    result_text = str(router_result.result).lower().strip()
    return "tarot" in result_text

def create_agent_graph_with_history(messages: Messages = None):
    """
    Create a multi-agent graph with conversation history
    
    The graph routes to:
    - welcome: General greetings and introductions
    - numerology: Numerology calculations and readings
    - tarot: Tarot readings (uses a Swarm of 3 specialized agents)
    
    Args:
        messages: Conversation history to provide context to agents
    """
    builder = GraphBuilder()
    
    # Create agents and swarm (with or without history)
    welcome = create_welcome_agent(messages) if messages else welcome_agent
    numerology = create_numerology_agent(messages) if messages else numerology_agent
    tarot = create_tarot_swarm_with_history(messages) if messages else tarot_swarm
    
    # Add nodes
    builder.add_node(router_agent, "router")
    builder.add_node(welcome, "welcome")
    builder.add_node(numerology, "numerology")
    builder.add_node(tarot, "tarot")  # Tarot is a Swarm!
    
    # Add conditional edges
    builder.add_edge("router", "welcome", condition=route_to_welcome)
    builder.add_edge("router", "numerology", condition=route_to_numerology)
    builder.add_edge("router", "tarot", condition=route_to_tarot)
    
    # Set entry point
    builder.set_entry_point("router")
    
    # Configure timeouts
    builder.set_execution_timeout(600)  # 10 minutes (tarot swarm needs more time)
    builder.set_node_timeout(180)  # 3 minutes per node
    
    return builder.build()

# Create default graph instance without history
agent_graph = create_agent_graph_with_history()
