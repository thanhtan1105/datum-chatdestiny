"""
API routes for the multi-agent system
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.agents.graph import create_agent_graph_with_history
from app.core.memory import short_term_memory
from strands.types.content import Message, ContentBlock
import re

router = APIRouter()


class ChatRequest(BaseModel):
    prompt: str
    actor_id: str = "default_user"
    session_id: str = "default_session"


class ChatResponse(BaseModel):
    response: str
    agent: str
    session_id: str
    card_list: list[str] = []


@router.post("/invocations", response_model=ChatResponse)
async def invocations(request: ChatRequest):
    """
    Main invocation endpoint for Bedrock Agent Runtime
    """
    try:
        # Load conversation history
        events = short_term_memory.list_events(
            actor_id=request.actor_id,
            session_id=request.session_id,
            max_results=10
        )
        # Convert events to Strands Messages format
        messages = []
        for event in events:
            payload = event.get("payload", [])
            for item in payload:
                if "conversational" in item:
                    conv = item["conversational"]
                    role = conv.get("role", "").lower()
                    text = conv.get("content", {}).get("text", "")
                    if text:
                        messages.append(
                            Message(
                                role="user" if role == "user" else "assistant",
                                content=[ContentBlock(text=text)]
                            )
                        )
        
        # Create and execute graph
        graph = create_agent_graph_with_history(messages)
        result = await graph.invoke_async(request.prompt)
        
        # Extract response
        response_text = ""
        selected_agent = ""
        card_list = []
        
        for node_id, node_result in result.results.items():
            if node_id == "router":
                continue
                
            selected_agent = node_id
            
            if not hasattr(node_result, 'result'):
                continue
                
            inner = node_result.result
            
            # Handle Swarm result (tarot agent)
            if hasattr(inner, 'results') and hasattr(inner, 'node_history'):
                if inner.node_history:
                    # Get the last agent in the swarm (final responder)
                    last_node = inner.node_history[-1]
                    last_node_id = last_node.node_id if hasattr(last_node, 'node_id') else str(last_node)
                    
                    if last_node_id in inner.results:
                        swarm_node_result = inner.results[last_node_id]
                        if hasattr(swarm_node_result, 'result'):
                            agent_res = swarm_node_result.result
                            if hasattr(agent_res, 'message'):
                                msg = agent_res.message
                                if isinstance(msg, dict) and 'content' in msg:
                                    for block in msg['content']:
                                        if isinstance(block, dict) and 'text' in block:
                                            response_text = block['text']
                                            break
            
            # Handle regular agent result (numerology, welcome)
            elif hasattr(inner, 'message'):
                msg = inner.message
                if isinstance(msg, dict) and 'content' in msg:
                    for block in msg['content']:
                        if isinstance(block, dict) and 'text' in block:
                            response_text = block['text']
                            break
            
            break
        
        # Fallback if extraction failed
        if not response_text or 'SwarmResult' in response_text or 'NodeResult' in response_text:
            response_text = "I apologize, but I couldn't generate a proper response. Please try again."
        
        # Clean up response
        response_text = re.sub(r'<thinking>[\s\S]*?</thinking>\s*', '', response_text).strip()
        
        # Extract card list for tarot readings
        if selected_agent == "tarot":
            card_match = re.search(r'CARDS:\s*\[(.*?)\]', response_text)
            if card_match:
                cards_str = card_match.group(1)
                card_list = [card.strip() for card in cards_str.split(',') if card.strip()]
            
            # Remove CARDS: line from response
            response_text = re.sub(r'CARDS:\s*\[.*?\]\s*\n*', '', response_text, count=1).strip()
        
        # Store conversation in memory
        if response_text and response_text.strip():
            short_term_memory.create_event(
                messages=[
                    (request.prompt, "USER"),
                    (response_text, "ASSISTANT")
                ],
                actor_id=request.actor_id,
                session_id=request.session_id
            )
        
        return ChatResponse(
            response=response_text,
            agent=selected_agent,
            session_id=request.session_id,
            card_list=card_list
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/ping")
async def ping():
    """Health check endpoint"""
    return {"status": "healthy", "service": "bedrock-agent-runtime"}
