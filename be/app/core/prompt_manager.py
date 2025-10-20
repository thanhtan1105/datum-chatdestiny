"""
AWS Bedrock Prompt Management integration
"""
import boto3
from typing import Optional, Dict, Any
from app.core.config import config

class PromptConfig:
    """Prompt configuration including text and inference settings"""
    def __init__(
        self,
        text: str,
        temperature: Optional[float] = None,
        top_p: Optional[float] = None,
        max_tokens: Optional[int] = None
    ):
        self.text = text
        self.temperature = temperature
        self.top_p = top_p
        self.max_tokens = max_tokens

class PromptManager:
    """Manage prompts using AWS Bedrock Prompt Management"""
    
    def __init__(self, region_name: str = None):
        self.region_name = region_name or config.AWS_REGION
        self.client = boto3.client(service_name='bedrock-agent', region_name="us-east-1")
        self._prompt_cache: Dict[str, PromptConfig] = {}  # Cache by version
    
    def get_prompt(
        self,
        prompt_identifier: str,
        prompt_version: Optional[str] = None
    ) -> str:
        """
        Get prompt text from AWS Bedrock Prompt Management
        
        Args:
            prompt_identifier: Prompt ARN or ID
            prompt_version: Optional version (defaults to latest)
            
        Returns:
            Prompt text
        """
        config = self.get_prompt_config(prompt_identifier, prompt_version)
        return config.text
    
    def get_prompt_config(
        self,
        prompt_identifier: str,
        prompt_version: Optional[str] = None
    ) -> PromptConfig:
        """
        Get prompt configuration including text and inference settings.
        Caches by version - if version is specified, it's cached permanently.
        If no version specified, uses DRAFT and fetches every time.
        
        Args:
            prompt_identifier: Prompt ARN or ID
            prompt_version: Optional version (defaults to DRAFT)
            
        Returns:
            PromptConfig with text and inference settings
            
        Raises:
            Exception: If prompt cannot be retrieved
        """
        # Default to DRAFT if no version specified
        version = prompt_version if prompt_version else 'DRAFT'
        
        # Create cache key with version
        cache_key = f"{prompt_identifier}:{version}"
        
        # If version is specified (not DRAFT), check cache
        if prompt_version and cache_key in self._prompt_cache:
            print(f"📦 Using cached prompt: {cache_key}")
            return self._prompt_cache[cache_key]
        
        # Fetch from AWS
        print(f"🔄 Fetching prompt from AWS: {cache_key}")
        
        # Build request parameters
        request_params = {
            'promptIdentifier': prompt_identifier,
            'promptVersion': version
        }
        
        response = self.client.get_prompt(**request_params)
        
        # Extract prompt text and config from variants
        variants = response.get('variants', [])
        if not variants:
            raise ValueError(f"No variants found for prompt: {prompt_identifier}")
        
        variant = variants[0]
        
        # Get template text - handle both TEXT and CHAT template types
        template_config = variant.get('templateConfiguration', {})
        template_type = variant.get('templateType', 'TEXT')
        
        prompt_text = ''
        if template_type == 'CHAT':
            # For CHAT templates, extract system messages
            chat_config = template_config.get('chat', {})
            system_messages = chat_config.get('system', [])
            # Combine all system message texts
            system_texts = []
            for msg in system_messages:
                if isinstance(msg, dict) and 'text' in msg:
                    system_texts.append(msg['text'])
            
            if system_texts:
                prompt_text = '\n\n'.join(system_texts)
            else:
                # If no system messages, use a default prompt or extract from user messages
                user_messages = chat_config.get('messages', [])
                if user_messages:
                    # Use first user message as fallback
                    first_msg = user_messages[0]
                    content = first_msg.get('content', [])
                    if content and isinstance(content[0], dict):
                        prompt_text = content[0].get('text', '')
                
                # If still empty, provide a minimal default
                if not prompt_text:
                    prompt_text = "You are a helpful assistant."
        else:
            # For TEXT templates
            text_config = template_config.get('text', {})
            prompt_text = text_config.get('text', '')
        
        if not prompt_text:
            raise ValueError(f"No text found in prompt: {prompt_identifier}")
        
        # Get inference configuration
        inference_config = variant.get('inferenceConfiguration', {})
        temperature = inference_config.get('temperature')
        top_p = inference_config.get('topP')
        max_tokens = inference_config.get('maxTokens')
        
        # Create config object
        prompt_config = PromptConfig(
            text=prompt_text,
            temperature=temperature,
            top_p=top_p,
            max_tokens=max_tokens
        )
        
        # Cache only if version is specified (not DRAFT)
        # DRAFT prompts are not cached so changes are reflected immediately
        if prompt_version:
            self._prompt_cache[cache_key] = prompt_config
            print(f"💾 Cached prompt version: {cache_key}")
        
        return prompt_config
    
# Global prompt manager instance
prompt_manager = PromptManager()
