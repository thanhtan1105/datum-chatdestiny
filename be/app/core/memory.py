"""
Short-term memory using Bedrock AgentCore Memory
"""
from bedrock_agentcore.memory import MemoryClient
from typing import List, Tuple, Optional
from app.core.config import config

class ShortTermMemory:
    """
    Short-term memory using Bedrock AgentCore Memory.
    Stores conversation context without long-term persistence.
    """
    
    def __init__(self, region_name: str = None):
        self.region_name = region_name or config.AWS_REGION
        self.client = MemoryClient(region_name=self.region_name)
        self._memory_id: Optional[str] = None
    
    def _find_existing_memory(self) -> Optional[str]:
        """Find existing memory by name"""
        try:
            memories = list(self.client.list_memories())
            print(f"📋 Found {len(memories)} memories")
            for memory in memories:
                # The API might return id in different fields
                memory_id = memory.get("id")
                memory_name = memory.get("name")
                print(f"  - Name: {memory_name}, ID: {memory_id}")
                # Fallback: check if ID contains our memory name
                if memory_id and "StrandAgentShortTermMemory" in str(memory_id):
                    return memory_id
        except Exception as e:
            print(f"⚠️  Could not list memories: {e}")
        return None
    
    def _ensure_memory(self):
        """Create memory resource if it doesn't exist"""
        if self._memory_id is not None:
            return
        
        # 1. Check for existing memory in config
        if config.MEMORY_ID:
            self._memory_id = config.MEMORY_ID
            print(f"✅ Using memory from config: {self._memory_id}")
            return
        
        # 2. Check if memory already exists by listing
        existing_id = self._find_existing_memory()
        if existing_id:
            self._memory_id = existing_id
            print(f"✅ Found existing memory: {self._memory_id}")
            print(f"💡 Add to .env: MEMORY_ID={self._memory_id}")
            return
        
        # 3. Create new memory only if not found
        try:
            print("📝 Creating new memory...")
            memory = self.client.create_memory_and_wait(
                name="StrandAgentShortTermMemory",
                strategies=[]
            )
            self._memory_id = memory.get("id")
            print(f"✅ Created short-term memory: {self._memory_id}")
            print(f"💡 Add to .env: MEMORY_ID={self._memory_id}")
        except Exception as e:
            # If creation fails due to existing memory, try to find it again
            if "already exists" in str(e):
                print("⚠️  Memory already exists, searching again...")
                existing_id = self._find_existing_memory()
                if existing_id:
                    self._memory_id = existing_id
                    print(f"✅ Found existing memory: {self._memory_id}")
                else:
                    print(f"❌ Failed to find existing memory: {e}")
                    raise
            else:
                print(f"❌ Failed to create memory: {e}")
                raise
    
    def create_event(
        self,
        messages: List[Tuple[str, str]],
        actor_id: str = "default_user",
        session_id: str = "default_session"
    ):
        """
        Store conversation in short-term memory
        
        Args:
            messages: List of (message, role) tuples where role is USER, ASSISTANT, or TOOL
            actor_id: User identifier
            session_id: Session identifier
        """
        self._ensure_memory()
        
        self.client.create_event(
            memory_id=self._memory_id,
            actor_id=actor_id,
            session_id=session_id,
            messages=messages
        )
    
    def list_events(
        self,
        actor_id: str = "default_user",
        session_id: str = "default_session",
        max_results: int = 20
    ):
        """
        Load conversations from short-term memory
        
        Args:
            actor_id: User identifier
            session_id: Session identifier
            max_results: Maximum number of events to return
            
        Returns:
            List of conversation events
        """
        self._ensure_memory()
        
        return self.client.list_events(
            memory_id=self._memory_id,
            actor_id=actor_id,
            session_id=session_id,
            max_results=max_results
        )
    
    def clear_session(self, actor_id: str = "default_user", session_id: str = "default_session"):
        """Clear conversation history for a session"""
        # Note: AgentCore Memory doesn't have a direct delete event API
        # Events expire automatically based on retention policy
        pass

# Global short-term memory instance
short_term_memory = ShortTermMemory()
