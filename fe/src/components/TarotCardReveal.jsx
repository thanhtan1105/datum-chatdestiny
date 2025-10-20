import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'

const TarotCardReveal = ({ cards, onComplete, responseText }) => {
  const [phase, setPhase] = useState('picking') // 'picking' or 'revealing'
  const [pickedIndices, setPickedIndices] = useState([])
  const [revealedCards, setRevealedCards] = useState([])
  const [currentRevealIndex, setCurrentRevealIndex] = useState(0)
  const [showResponse, setShowResponse] = useState(false)
  const [isRevealingAll, setIsRevealingAll] = useState(false)
  
  const totalDeckCards = 78 // Full tarot deck
  
  // Calculate fan/arc position for each card (spread across bottom in an arc)
  const getFanPosition = (index, total) => {
    const progress = index / (total - 1) // 0 to 1
    const angle = (progress - 0.5) * 180 // -90 to +90 degrees spread
    const rotation = angle * 0.6 // Card rotation follows the arc
    
    // Create an arc shape
    const x = progress * 100 // Spread horizontally 0-100%
    const arcHeight = Math.sin(progress * Math.PI) * 15 // Arc up in the middle
    const y = 50 + arcHeight // Y position with arc
    
    return { x, y, rotation }
  }

  // Convert card name to filename
  const getCardImagePath = (cardName) => {
    // Remove "(Reversed)" suffix if present
    const cleanName = cardName.replace(/\s*\(Reversed\)\s*/gi, '').trim()
    
    // Convert to lowercase and replace spaces with underscores
    const filename = cleanName
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '')
    
    return `/cards/${filename}.png`
  }

  // Check if card is reversed
  const isReversed = (cardName) => {
    return /\(Reversed\)/i.test(cardName)
  }

  const handlePickCard = (index) => {
    if (phase === 'picking' && pickedIndices.length < cards.length && !pickedIndices.includes(index)) {
      const newPicked = [...pickedIndices, index]
      setPickedIndices(newPicked)
      
      // If all cards picked, move to revealing phase
      if (newPicked.length === cards.length) {
        setTimeout(() => {
          setPhase('revealing')
        }, 1500) // Give time for the last card animation
      }
    }
  }

  const handleRevealCard = () => {
    if (phase === 'revealing' && currentRevealIndex < cards.length && !isRevealingAll) {
      setRevealedCards(prev => [...prev, cards[currentRevealIndex]])
      
      if (currentRevealIndex === cards.length - 1) {
        // Last card - show response after a delay
        setTimeout(() => {
          setShowResponse(true)
          setTimeout(() => {
            onComplete()
          }, 500)
        }, 1000)
      } else {
        setCurrentRevealIndex(prev => prev + 1)
      }
    }
  }
  
  const handleRevealAll = () => {
    setIsRevealingAll(true)
    // Reveal all cards with a cascading effect
    cards.forEach((card, index) => {
      setTimeout(() => {
        setRevealedCards(prev => [...prev, card])
        if (index === cards.length - 1) {
          setTimeout(() => {
            setShowResponse(true)
            setTimeout(() => {
              onComplete()
            }, 500)
          }, 1000)
        }
      }, index * 150) // 150ms delay between each card
    })
  }

  if (showResponse) {
    return null // Response will be shown by parent component
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="max-w-7xl w-full px-4">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
            {phase === 'picking' ? 'Pick Your Cards' : 'Your Tarot Reading'}
          </h2>
          <p className="text-purple-300 text-sm">
            {phase === 'picking' 
              ? `Choose ${cards.length} cards • ${pickedIndices.length} of ${cards.length} selected`
              : `Click each card to reveal • ${revealedCards.length} of ${cards.length} revealed`
            }
          </p>
        </motion.div>

        {/* Picking Phase - Show deck of cards in fan/arc */}
        {phase === 'picking' && (
          <div className="relative w-full h-[700px] max-w-full mx-auto overflow-visible px-4">
            {/* Mystical background glow */}
            <motion.div
              animate={{
                opacity: [0.2, 0.4, 0.2],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-purple-500/30 via-pink-500/30 to-blue-500/30 blur-3xl"
            />
            
            {/* Cards in fan layout */}
            <div className="absolute inset-0">
              {Array.from({ length: totalDeckCards }).map((_, index) => {
                const isPicked = pickedIndices.includes(index)
                const pickOrder = pickedIndices.indexOf(index)
                const pos = getFanPosition(index, totalDeckCards)
                
                return (
                  <motion.div
                    key={index}
                    initial={{ 
                      opacity: 0, 
                      y: -200, 
                      x: (index - totalDeckCards / 2) * 5,
                      scale: 0.3,
                      rotate: (Math.random() - 0.5) * 180
                    }}
                    animate={isPicked ? {
                      // Spiral tornado animation when picked
                      opacity: [1, 1, 1, 0.8, 1],
                      scale: [1, 1.5, 1.8, 1.5, 1.3],
                      y: [0, -100, -200, -300, -400],
                      x: [
                        0,
                        Math.cos(pickOrder * 0.5) * 100,
                        Math.cos(pickOrder * 0.5 + Math.PI) * 80,
                        Math.cos(pickOrder * 0.5 + Math.PI * 2) * 60,
                        0
                      ],
                      rotate: [pos.rotation, pos.rotation + 180, pos.rotation + 360, pos.rotation + 540, 0],
                      transition: {
                        duration: 1.2,
                        ease: [0.34, 1.56, 0.64, 1],
                        times: [0, 0.25, 0.5, 0.75, 1]
                      }
                    } : {
                      opacity: 1,
                      scale: 1,
                      y: 0,
                      x: 0,
                      rotate: pos.rotation,
                      transition: { 
                        delay: index * 0.015,
                        duration: 0.8 + (index % 10) * 0.05,
                        type: "spring",
                        stiffness: 80,
                        damping: 12,
                        mass: 0.8
                      }
                    }}
                    whileHover={!isPicked ? {
                      filter: [
                        'brightness(1) saturate(1)',
                        'brightness(1.3) saturate(1.5)',
                        'brightness(1) saturate(1)'
                      ]
                    } : {}}
                    style={{
                      position: 'absolute',
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                      transform: `translate(-50%, -50%)`,
                      zIndex: isPicked ? 100 + pickOrder : 10 + index
                    }}
                    className="origin-center"
                  >
                    <motion.div
                      onClick={() => handlePickCard(index)}
                      whileHover={!isPicked ? { 
                        scale: 1.8,
                        y: -60,
                        rotate: 0,
                        zIndex: 100,
                        transition: { duration: 0.3, type: "spring", stiffness: 300 }
                      } : {}}
                      whileTap={!isPicked ? { scale: 1.5 } : {}}
                      className={`relative ${!isPicked ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                      style={{ width: '100px', height: '157px' }}
                    >
                      <div className="absolute inset-0 rounded-lg overflow-hidden shadow-2xl">
                        <img
                          src="/cards/back.png"
                          alt="Card Back"
                          className="w-full h-full object-contain bg-gray-900"
                        />
                        
                        {/* Hover sparkle particles */}
                        {!isPicked && (
                          <motion.div className="absolute inset-0 pointer-events-none">
                            {[...Array(6)].map((_, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0 }}
                                whileHover={{
                                  opacity: [0, 1, 0],
                                  scale: [0, 1.5, 0],
                                  x: [0, Math.cos(i * Math.PI / 3) * 40],
                                  y: [0, Math.sin(i * Math.PI / 3) * 40],
                                }}
                                transition={{
                                  duration: 0.8,
                                  repeat: Infinity,
                                  delay: i * 0.1
                                }}
                                className="absolute top-1/2 left-1/2 w-3 h-3 bg-yellow-300 rounded-full"
                                style={{ transform: 'translate(-50%, -50%)' }}
                              />
                            ))}
                          </motion.div>
                        )}
                        
                        {/* Mystical glow effect for unpicked cards */}
                        {!isPicked && (
                          <>
                            <motion.div
                              animate={{
                                opacity: [0.3, 0.7, 0.3],
                              }}
                              transition={{
                                duration: 2 + (index % 10) * 0.1,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                              className="absolute inset-0 bg-gradient-to-br from-purple-400/50 via-pink-400/50 to-blue-400/50 mix-blend-overlay"
                            />
                            {/* Edge glow */}
                            <motion.div 
                              className="absolute inset-0 shadow-[0_0_20px_rgba(168,85,247,0.6)]"
                              animate={{
                                boxShadow: [
                                  '0_0_20px_rgba(168,85,247,0.6)',
                                  '0_0_35px_rgba(236,72,153,0.8)',
                                  '0_0_20px_rgba(168,85,247,0.6)'
                                ]
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            />
                          </>
                        )}
                        
                        {/* Pick order number with glow */}
                        {isPicked && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 1.2 }}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            {/* Glowing background */}
                            <motion.div
                              animate={{
                                opacity: [0.6, 1, 0.6],
                                scale: [1, 1.2, 1]
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                              className="absolute inset-0 bg-gradient-to-br from-yellow-400/80 via-orange-400/80 to-pink-500/80 blur-md"
                            />
                            {/* Number badge */}
                            <motion.div
                              animate={{
                                boxShadow: [
                                  '0 0 20px rgba(251, 191, 36, 0.8)',
                                  '0 0 40px rgba(251, 191, 36, 1)',
                                  '0 0 20px rgba(251, 191, 36, 0.8)'
                                ]
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                              className="relative bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-2xl shadow-2xl border-4 border-white"
                            >
                              {pickOrder + 1}
                            </motion.div>
                            
                            {/* Spiral trail particles */}
                            {[...Array(8)].map((_, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{
                                  opacity: [0, 1, 0],
                                  scale: [0, 1, 0],
                                  x: Math.cos(i * Math.PI / 4) * 60,
                                  y: Math.sin(i * Math.PI / 4) * 60,
                                }}
                                transition={{
                                  duration: 1,
                                  delay: 1.2 + i * 0.05,
                                  ease: "easeOut"
                                }}
                                className="absolute w-3 h-3 bg-yellow-300 rounded-full"
                                style={{ left: '50%', top: '50%' }}
                              />
                            ))}
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                )
              })}
            </div>
            
            {/* Instruction text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <p className="text-purple-300 text-lg font-semibold">
                  ✨ Hover and click to pick your cards ✨
                </p>
              </motion.div>
            </motion.div>
          </div>
        )}

        {/* Revealing Phase - Show picked cards */}
        {phase === 'revealing' && (
          <>
            <div className="flex justify-center items-center gap-4 md:gap-8 flex-wrap mb-8">
              <AnimatePresence mode="popLayout">
                {cards.map((card, index) => {
                  const isRevealed = revealedCards.includes(card)
                  const isCurrent = index === currentRevealIndex && !isRevealingAll
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.5, y: 100 }}
                    animate={{ 
                      opacity: 1, 
                      scale: isCurrent ? 1.1 : 1,
                      y: 0
                    }}
                    transition={{ 
                      delay: index * 0.2,
                      duration: 0.6,
                      type: "spring",
                      stiffness: 100
                    }}
                    className="relative"
                  >
                    <motion.div
                      onClick={isCurrent ? handleRevealCard : undefined}
                      whileHover={isCurrent ? { scale: 1.15, y: -10 } : {}}
                      whileTap={isCurrent ? { scale: 1.05 } : {}}
                      className={`relative w-32 h-48 md:w-40 md:h-60 ${isCurrent ? 'cursor-pointer' : 'cursor-default'}`}
                    >
                      {/* Show back when not revealed */}
                      {!isRevealed && (
                        <motion.div 
                          className="absolute inset-0 rounded-xl overflow-hidden shadow-2xl"
                          animate={isCurrent ? { 
                            rotateY: [0, 5, -5, 0],
                            rotateZ: [0, 2, -2, 0]
                          } : {}}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <img
                            src="/cards/back.png"
                            alt="Card Back"
                            className="w-full h-full object-contain"
                          />
                          
                          {/* Enhanced glow effect for current card */}
                          {isCurrent && (
                            <>
                              <motion.div
                                animate={{
                                  opacity: [0.5, 1, 0.5],
                                  scale: [1, 1.3, 1]
                                }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                                className="absolute inset-0 bg-gradient-to-r from-purple-500/60 to-pink-500/60 blur-xl -z-10"
                              />
                              {/* Rotating ring effect */}
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 -z-10"
                              >
                                <div className="absolute top-0 left-1/2 w-2 h-2 bg-yellow-300 rounded-full -translate-x-1/2" />
                                <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-blue-300 rounded-full -translate-x-1/2" />
                                <div className="absolute left-0 top-1/2 w-2 h-2 bg-pink-300 rounded-full -translate-y-1/2" />
                                <div className="absolute right-0 top-1/2 w-2 h-2 bg-purple-300 rounded-full -translate-y-1/2" />
                              </motion.div>
                            </>
                          )}
                        </motion.div>
                      )}

                      {/* Show front when revealed */}
                      {isRevealed && (
                        <motion.div 
                          className="absolute inset-0 rounded-xl overflow-hidden shadow-2xl"
                          initial={{ rotateY: 90, scale: 0.8 }}
                          animate={{ rotateY: 0, scale: 1 }}
                          transition={{ duration: 0.6, type: "spring" }}
                        >
                          <img
                            src={getCardImagePath(card)}
                            alt={card}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.target.style.display = 'none'
                              e.target.nextSibling.style.display = 'flex'
                            }}
                          />
                          {/* Fallback content if image fails to load */}
                          <div className="w-full h-full bg-gradient-to-br from-amber-50 to-amber-100 p-4 flex-col items-center justify-center border-4 border-amber-400 hidden">
                            <div className="text-center">
                              <div className="text-4xl mb-3">🔮</div>
                              <div className="text-gray-800 text-sm md:text-base font-serif font-bold leading-tight px-2">
                                {card}
                              </div>
                            </div>
                          </div>
                          
                          {/* Reversed indicator overlay */}
                          {isReversed(card) && (
                            <div className="absolute top-2 right-2 bg-red-500/90 text-white text-xs px-2 py-1 rounded-full font-bold">
                              Reversed
                            </div>
                          )}
                          
                          {/* Enhanced sparkle effect on reveal */}
                          <motion.div
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 0 }}
                            transition={{ duration: 1.5, delay: 0.2 }}
                            className="absolute inset-0 pointer-events-none"
                          >
                            {/* Sparkles radiating out */}
                            {[...Array(12)].map((_, i) => (
                              <motion.div
                                key={i}
                                initial={{ 
                                  x: '50%', 
                                  y: '50%',
                                  scale: 0,
                                  opacity: 1
                                }}
                                animate={{ 
                                  x: `${50 + Math.cos(i * Math.PI / 6) * 120}%`,
                                  y: `${50 + Math.sin(i * Math.PI / 6) * 120}%`,
                                  scale: [0, 1.5, 0],
                                  opacity: [1, 1, 0]
                                }}
                                transition={{ duration: 1, delay: i * 0.03 }}
                                className="absolute w-3 h-3 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-full shadow-lg"
                              />
                            ))}
                            {/* Center flash */}
                            <motion.div
                              initial={{ scale: 0, opacity: 1 }}
                              animate={{ scale: 3, opacity: 0 }}
                              transition={{ duration: 0.6 }}
                              className="absolute inset-0 bg-white/50 rounded-xl"
                            />
                          </motion.div>
                          
                          {/* Golden border flash */}
                          <motion.div
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                            className="absolute inset-0 border-4 border-yellow-400 rounded-xl"
                          />
                        </motion.div>
                      )}
                    </motion.div>

                    {/* Card position label */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isRevealed ? 1 : 0.5 }}
                      className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-purple-300 whitespace-nowrap"
                    >
                      {index === 0 && 'Past'}
                      {index === 1 && cards.length === 3 && 'Present'}
                      {index === 2 && cards.length === 3 && 'Future'}
                      {cards.length > 3 && `Card ${index + 1}`}
                    </motion.div>
                  </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
            
            {/* Reveal All Button */}
            {!isRevealingAll && revealedCards.length < cards.length && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="flex justify-center"
              >
                <motion.button
                  onClick={handleRevealAll}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-shadow"
                >
                  <motion.span
                    animate={{ opacity: [1, 0.7, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ✨ Reveal All Cards ✨
                  </motion.span>
                </motion.button>
              </motion.div>
            )}
          </>
        )}

        {/* Instruction */}
        {((phase === 'picking' && pickedIndices.length < cards.length) || 
          (phase === 'revealing' && currentRevealIndex < cards.length)) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-16"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="inline-block"
            >
              <div className="text-purple-300 text-sm">
                {phase === 'picking' 
                  ? '✨ Click to pick your cards ✨'
                  : '✨ Click the glowing card to reveal ✨'
                }
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default TarotCardReveal
