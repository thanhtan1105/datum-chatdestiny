"""
Tarot card drawing tool for agents
"""
import random
from typing import List, Dict

# Complete 78-card tarot deck
MAJOR_ARCANA = [
    "The Fool",
    "The Magician",
    "The High Priestess",
    "The Empress",
    "The Emperor",
    "The Hierophant",
    "The Lovers",
    "The Chariot",
    "Strength",
    "The Hermit",
    "Wheel of Fortune",
    "Justice",
    "The Hanged Man",
    "Death",
    "Temperance",
    "The Devil",
    "The Tower",
    "The Star",
    "The Moon",
    "The Sun",
    "Judgement",
    "The World"
]

MINOR_ARCANA = {
    "Wands": ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Page", "Knight", "Queen", "King"],
    "Cups": ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Page", "Knight", "Queen", "King"],
    "Swords": ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Page", "Knight", "Queen", "King"],
    "Pentacles": ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Page", "Knight", "Queen", "King"]
}

def get_full_deck() -> List[str]:
    """Get the complete 78-card tarot deck"""
    deck = MAJOR_ARCANA.copy()
    for suit, ranks in MINOR_ARCANA.items():
        for rank in ranks:
            deck.append(f"{rank} of {suit}")
    return deck

def draw_cards(num_cards: int = 1, allow_reversed: bool = False) -> Dict:
    """
    Draw random tarot cards from the deck
    
    Args:
        num_cards: Number of cards to draw (1-10)
        allow_reversed: Whether cards can be drawn in reversed position
        
    Returns:
        Dictionary with card names and formatted string
    """
    if num_cards < 1:
        num_cards = 1
    if num_cards > 10:
        num_cards = 10
    
    deck = get_full_deck()
    drawn = random.sample(deck, num_cards)
    
    # Randomly reverse some cards if allowed
    cards = []
    for card in drawn:
        if allow_reversed and random.random() < 0.3:  # 30% chance of reversed
            cards.append(f"{card} (Reversed)")
        else:
            cards.append(card)
    
    return {
        "cards": cards,
        "count": len(cards),
        "formatted": f"CARDS: [{', '.join(cards)}]"
    }
