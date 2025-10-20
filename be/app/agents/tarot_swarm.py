from strands.multiagent import Swarm
from strands.types.content import Messages
from .card_interpreter import create_card_interpreter_agent, card_interpreter_agent
from .spread_reader import create_spread_reader_agent, spread_reader_agent
from .life_advisor import create_life_advisor_agent, life_advisor_agent

def create_tarot_swarm_with_history(messages: Messages = None):
    """
    Create a Tarot Swarm with conversation history
    
    The swarm consists of three specialized agents:
    1. card_interpreter - Expert in card meanings and symbolism
    2. spread_reader - Expert in performing readings and spreads
    3. life_advisor - Expert in practical guidance and advice
    
    Args:
        messages: Conversation history to provide context to agents
    """
    # Create agents (with or without history)
    card_interpreter = create_card_interpreter_agent(messages) if messages else card_interpreter_agent
    spread_reader = create_spread_reader_agent(messages) if messages else spread_reader_agent
    life_advisor = create_life_advisor_agent(messages) if messages else life_advisor_agent
    
    # Create swarm with spread_reader as entry point (most common use case)
    swarm = Swarm(
        [spread_reader, card_interpreter, life_advisor],
        entry_point=spread_reader,  # Start with spread reader for most queries
        max_handoffs=15,  # Allow agents to collaborate
        max_iterations=15,
        execution_timeout=120.0,  # 2 minutes
        node_timeout=20.0,  # 20 seconds per agent
        repetitive_handoff_detection_window=6,
        repetitive_handoff_min_unique_agents=2
    )
    
    return swarm

# Create default swarm instance without history
tarot_swarm = create_tarot_swarm_with_history()
