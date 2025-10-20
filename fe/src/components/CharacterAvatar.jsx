import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Heart, Star } from 'lucide-react'
import { Suspense } from 'react'
import Character3D from './Character3D'

const CharacterAvatar = ({ isTyping, headFlying, latestResponse, isUserTyping }) => {
  return (
    <div className="fixed bottom-0 left-0 w-full md:w-[43%] h-[50vh] md:h-[75vh] pointer-events-none z-20">
      <div className="relative w-full h-full flex items-end justify-center">
        {/* Ambient glow */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-cyan-500/40 via-pink-500/30 to-transparent blur-3xl"
        />

        {/* Enhanced Thinking Effects */}
        <AnimatePresence>
          {isTyping && (
            <>
              {/* Main thinking indicator with glow */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.8 }}
                className="absolute left-1/2 -translate-x-1/2 top-[5%] md:top-[10%] pointer-events-none z-50"
              >
                {/* Outer glow ring */}
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-xl"
                />
                
                {/* Main bubble */}
                <motion.div
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(168, 85, 247, 0.5)',
                      '0 0 40px rgba(236, 72, 153, 0.7)',
                      '0 0 20px rgba(168, 85, 247, 0.5)',
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="relative bg-white/95 backdrop-blur-xl border-2 border-purple-300/50 rounded-2xl px-6 py-4 shadow-2xl"
                >
                  <div className="flex gap-2 items-center">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{
                          y: [0, -12, 0],
                          scale: [1, 1.3, 1],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay: i * 0.2,
                          ease: "easeInOut"
                        }}
                        className="w-3 h-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"
                      />
                    ))}
                  </div>
                </motion.div>
              </motion.div>

              {/* Orbiting sparkles around character */}
              {[...Array(12)].map((_, i) => {
                const angle = (i / 12) * Math.PI * 2
                const radius = 120
                return (
                  <motion.div
                    key={`orbit-${i}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1.5, 0],
                      x: [0, Math.cos(angle) * radius, 0],
                      y: [0, Math.sin(angle) * radius, 0],
                      rotate: [0, 360],
                    }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.25,
                      ease: "easeInOut"
                    }}
                    className="absolute left-1/2 top-1/2 pointer-events-none"
                  >
                    <Sparkles className="w-4 h-4 text-purple-400" />
                  </motion.div>
                )
              })}

              {/* Pulsing rings */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={`ring-${i}`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{
                    opacity: [0.6, 0, 0],
                    scale: [0.5, 2, 2.5],
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.7,
                    ease: "easeOut"
                  }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-purple-400 rounded-full pointer-events-none"
                />
              ))}

              {/* Energy waves from bottom */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={`wave-${i}`}
                  initial={{ opacity: 0, y: 0 }}
                  animate={{
                    opacity: [0, 0.8, 0],
                    y: [0, -150],
                    scale: [1, 1.5],
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeOut"
                  }}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-20 bg-gradient-to-t from-cyan-400 to-transparent rounded-full pointer-events-none"
                  style={{ left: `${40 + i * 5}%` }}
                />
              ))}

              {/* Floating runes/symbols */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={`rune-${i}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 0.7, 0],
                    scale: [0, 1, 0],
                    y: [0, -100, -200],
                    x: [0, Math.sin(i) * 30, Math.sin(i) * 60],
                    rotate: [0, 180, 360],
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeInOut"
                  }}
                  className="absolute bottom-[20%] pointer-events-none"
                  style={{ left: `${20 + i * 8}%` }}
                >
                  {i % 4 === 0 ? (
                    <Star className="w-5 h-5 text-purple-400" />
                  ) : i % 4 === 1 ? (
                    <Sparkles className="w-5 h-5 text-pink-400" />
                  ) : i % 4 === 2 ? (
                    <Heart className="w-5 h-5 text-cyan-400" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-400 to-pink-400" />
                  )}
                </motion.div>
              ))}

              {/* Spiral particles */}
              {[...Array(6)].map((_, i) => {
                const spiralAngle = (i / 6) * Math.PI * 2
                return (
                  <motion.div
                    key={`spiral-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0.5, 1.2, 0.5],
                      x: [
                        Math.cos(spiralAngle) * 50,
                        Math.cos(spiralAngle + Math.PI) * 100,
                        Math.cos(spiralAngle + Math.PI * 2) * 50,
                      ],
                      y: [
                        Math.sin(spiralAngle) * 50,
                        Math.sin(spiralAngle + Math.PI) * 100,
                        Math.sin(spiralAngle + Math.PI * 2) * 50,
                      ],
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.5,
                      ease: "linear"
                    }}
                    className="absolute left-1/2 top-1/3 pointer-events-none"
                  >
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400" />
                  </motion.div>
                )
              })}

              {/* Lightning bolts */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={`lightning-${i}`}
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scaleY: [0, 1, 0],
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    delay: i * 1.2,
                    ease: "easeInOut"
                  }}
                  className="absolute top-[15%] w-1 h-24 bg-gradient-to-b from-purple-400 via-pink-400 to-transparent pointer-events-none"
                  style={{ 
                    left: `${30 + i * 15}%`,
                    filter: 'blur(1px)',
                    boxShadow: '0 0 10px rgba(168, 85, 247, 0.8)'
                  }}
                />
              ))}

              {/* Glowing orbs */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={`orb-${i}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 0.8, 0],
                    scale: [0, 1.5, 0],
                    x: [0, Math.cos(i * 60) * 80, Math.cos(i * 60) * 120],
                    y: [0, Math.sin(i * 60) * 80, Math.sin(i * 60) * 120],
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.4,
                    ease: "easeOut"
                  }}
                  className="absolute left-1/2 top-1/2 w-3 h-3 rounded-full pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${i % 2 === 0 ? 'rgba(168, 85, 247, 0.8)' : 'rgba(236, 72, 153, 0.8)'}, transparent)`,
                    boxShadow: `0 0 20px ${i % 2 === 0 ? 'rgba(168, 85, 247, 0.6)' : 'rgba(236, 72, 153, 0.6)'}`
                  }}
                />
              ))}

              {/* Constellation lines */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={`line-${i}`}
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{
                    opacity: [0, 0.5, 0],
                    scaleX: [0, 1, 0],
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.8,
                    ease: "easeInOut"
                  }}
                  className="absolute top-[30%] h-0.5 w-32 bg-gradient-to-r from-transparent via-purple-400 to-transparent pointer-events-none"
                  style={{ 
                    left: `${25 + i * 15}%`,
                    transform: `rotate(${i * 45}deg)`
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>



        {/* Super Big Head Animation */}
        <AnimatePresence>
          {headFlying && latestResponse && (
            <>
              {/* Initial Big Bang Explosion */}
              <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ 
                  scale: [0, 3, 5],
                  opacity: [1, 0.6, 0]
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut"
                }}
                className="absolute left-[20%] top-[20%] pointer-events-none z-[99]"
              >
                {/* Explosion ring */}
                <div className="relative w-40 h-40 -translate-x-1/2 -translate-y-1/2">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400 via-yellow-300 to-red-500 blur-2xl" />
                  <div className="absolute inset-4 rounded-full bg-gradient-to-r from-white via-yellow-200 to-orange-300 blur-xl" />
                </div>
              </motion.div>

              {/* Explosion particles */}
              {[...Array(20)].map((_, i) => {
                const angle = (i / 20) * Math.PI * 2
                const distance = 80 + Math.random() * 40
                return (
                  <motion.div
                    key={`explosion-${i}`}
                    initial={{ 
                      x: 0, 
                      y: 0,
                      scale: 1,
                      opacity: 1
                    }}
                    animate={{ 
                      x: Math.cos(angle) * distance,
                      y: Math.sin(angle) * distance,
                      scale: [1, 0.5, 0],
                      opacity: [1, 0.8, 0]
                    }}
                    transition={{
                      duration: 0.8,
                      ease: "easeOut"
                    }}
                    className="absolute left-[20%] top-[20%] pointer-events-none z-[99]"
                  >
                    <div className={`w-3 h-3 rounded-full ${i % 3 === 0 ? 'bg-orange-400' : i % 3 === 1 ? 'bg-yellow-300' : 'bg-red-400'}`} />
                  </motion.div>
                )
              })}

              {/* Flying Rocket Head */}
              <motion.div
                initial={{ 
                  x: 0, 
                  y: 0,
                  scale: 1,
                  opacity: 0,
                  rotate: 0
                }}
                animate={{ 
                  x: [0, 150, 350, 550, 750],
                  y: [0, -100, -150, -120, -80],
                  scale: [1, 1.1, 0.9, 0.7, 0.3],
                  rotate: [0, -15, -25, -35, -45],
                  opacity: [0, 1, 1, 1, 0]
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1.8,
                  ease: [0.34, 1.56, 0.64, 1],
                  times: [0, 0.2, 0.5, 0.8, 1]
                }}
                className="absolute left-[20%] top-[20%] pointer-events-none z-[100]"
              >
                <div className="relative">
                  {/* Rocket smoke trail */}
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={`smoke-${i}`}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 0.7, 0.4, 0],
                        scale: [0, 1, 1.5, 2],
                        x: [-i * 25, -i * 35, -i * 45],
                        y: [i * 8, i * 12, i * 18],
                      }}
                      transition={{
                        duration: 1.2,
                        delay: i * 0.08,
                        repeat: Infinity,
                      }}
                      className="absolute w-6 h-6 rounded-full bg-gray-400/60 blur-md"
                      style={{ left: -i * 20, top: i * 6 }}
                    />
                  ))}

                  {/* Rocket fire trail */}
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={`fire-${i}`}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 1, 0.6, 0],
                        scale: [0, 1.2, 1.5, 0],
                        x: [-i * 15, -i * 20],
                        y: [i * 5, i * 8],
                      }}
                      transition={{
                        duration: 0.6,
                        delay: i * 0.05,
                        repeat: Infinity,
                      }}
                      className="absolute w-4 h-4 rounded-full bg-gradient-to-r from-orange-500 via-yellow-400 to-red-500"
                      style={{ left: -i * 12, top: i * 4 }}
                    />
                  ))}
                  
                  {/* The rocket head */}
                  <motion.div
                    animate={{
                      boxShadow: [
                        '0 0 30px rgba(255, 165, 0, 1)',
                        '0 0 50px rgba(255, 69, 0, 1)',
                        '0 0 30px rgba(255, 165, 0, 1)',
                      ]
                    }}
                    transition={{ duration: 0.3, repeat: Infinity }}
                    className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-orange-400 bg-gradient-to-br from-yellow-100 to-orange-100"
                    style={{
                      boxShadow: '0 0 40px rgba(255, 165, 0, 0.8), inset 0 0 20px rgba(255, 255, 255, 0.5)'
                    }}
                  >
                    <img
                      src="https://png.pngtree.com/png-clipart/20220705/ourmid/pngtree-anime-character-face-happy-smile-expression-png-image_5687460.png"
                      alt="Flying head"
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Speed lines */}
                    <motion.div
                      animate={{
                        x: [0, -100],
                        opacity: [0.8, 0]
                      }}
                      transition={{
                        duration: 0.3,
                        repeat: Infinity,
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                      style={{ width: '200%' }}
                    />
                  </motion.div>

                  {/* Rocket flames at bottom */}
                  <motion.div
                    animate={{
                      scaleY: [1, 1.5, 1.2, 1],
                      scaleX: [1, 0.8, 1.2, 1],
                      opacity: [1, 0.8, 1, 0.9],
                    }}
                    transition={{
                      duration: 0.15,
                      repeat: Infinity,
                    }}
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-12 h-16"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-yellow-300 via-orange-400 to-red-500 rounded-full blur-sm" />
                    <div className="absolute inset-2 bg-gradient-to-b from-white via-yellow-200 to-orange-300 rounded-full blur-xs" />
                  </motion.div>

                  {/* Side flames */}
                  <motion.div
                    animate={{
                      scaleX: [1, 1.3, 1],
                      opacity: [0.8, 1, 0.8],
                    }}
                    transition={{
                      duration: 0.2,
                      repeat: Infinity,
                    }}
                    className="absolute -bottom-4 -left-2 w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full blur-md"
                  />
                  <motion.div
                    animate={{
                      scaleX: [1, 1.3, 1],
                      opacity: [0.8, 1, 0.8],
                    }}
                    transition={{
                      duration: 0.2,
                      repeat: Infinity,
                      delay: 0.1
                    }}
                    className="absolute -bottom-4 -right-2 w-8 h-8 bg-gradient-to-bl from-orange-400 to-red-500 rounded-full blur-md"
                  />

                  {/* Sparkles around rocket */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={`sparkle-${i}`}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                        rotate: [0, 180, 360],
                      }}
                      transition={{
                        duration: 0.8,
                        delay: i * 0.15,
                        repeat: Infinity,
                      }}
                      className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                      style={{
                        left: `${Math.cos(i * 60) * 40}px`,
                        top: `${Math.sin(i * 60) * 40}px`,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* 3D Character */}
        <div className="relative w-full h-full">
          <Suspense fallback={
            <div className="flex items-center justify-center h-full">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-12 h-12 text-cyan-400" />
              </motion.div>
            </div>
          }>
            <Character3D isTyping={isTyping} headFlying={headFlying} isUserTyping={isUserTyping} />
          </Suspense>

          {/* Floating particles overlay */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -80, 0],
                x: [0, Math.sin(i) * 50, 0],
                opacity: [0, 0.8, 0],
                scale: [0, 1.3, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: 5 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut"
              }}
              className="absolute pointer-events-none"
              style={{
                left: `${15 + (i * 10)}%`,
                bottom: `${25 + Math.sin(i) * 35}%`,
              }}
            >
              {i % 3 === 0 ? (
                <Sparkles className="w-5 h-5 text-cyan-300" />
              ) : i % 3 === 1 ? (
                <Heart className="w-5 h-5 text-pink-400" />
              ) : (
                <Star className="w-5 h-5 text-purple-400" />
              )}
            </motion.div>
          ))}
        </div>


      </div>
    </div>
  )
}

export default CharacterAvatar
