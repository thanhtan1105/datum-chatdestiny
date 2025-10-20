"""
Strands tools for tarot card drawing
"""
from strands.tools import tool
from app.tools.tarot_deck import draw_cards as draw_cards_func

@tool
def draw_tarot_cards(num_cards: int = 1) -> str:
    """
    Draw random tarot cards from a 78-card deck.
    
    Use this tool to draw cards for tarot readings. The tool will randomly select
    cards from the complete tarot deck (22 Major Arcana + 56 Minor Arcana).
    Some cards may be drawn in reversed position.
    
    Args:
        num_cards: Number of cards to draw (1-10). Use 1 for single card readings,
                  3 for past-present-future, 5 for Celtic Cross, etc.
    
    Returns:
        A formatted string with the drawn cards in the format:
        CARDS: [Card Name 1, Card Name 2, Card Name 3]
        
    Examples:
        - draw_tarot_cards(1) -> "CARDS: [The Fool]"
        - draw_tarot_cards(3) -> "CARDS: [The Tower (Reversed), Two of Cups, The Sun]"
    """
    result = draw_cards_func(num_cards=num_cards, allow_reversed=False)
    return result["formatted"]
