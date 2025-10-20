import { useState } from 'react'
import WaifuChatInterface from './components/WaifuChatInterface'
import BackgroundEffects from './components/BackgroundEffects'
import ParticleField from './components/ParticleField'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

function App() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <BackgroundEffects />
      <ParticleField />
      
      {/* Animated title */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, type: "spring" }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-30"
      >
        <div className="relative">
          {/* Glow */}
          <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-xl opacity-50" />
          
          {/* Title */}
          <div className="relative px-8 py-4 bg-gradient-to-r from-purple-900/90 to-pink-900/90 backdrop-blur-xl rounded-full border-2 border-white/20 shadow-2xl">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-6 h-6 text-yellow-300" />
              </motion.div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
                Chat Destiny
              </h1>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-6 h-6 text-pink-300" />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
      
      <div className="relative z-10">
        <WaifuChatInterface />
      </div>
    </div>
  )
}

export default App
