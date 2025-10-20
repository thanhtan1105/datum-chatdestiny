import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

const Header = () => {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="py-6 px-4"
    >
      <div className="max-w-4xl mx-auto">
        <div className="glass-effect rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-center gap-3">
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <Sparkles className="w-8 h-8 text-purple-400" />
            </motion.div>
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                ChatDestiny
              </h1>
              <p className="text-sm text-gray-300 mt-1">
                Discover the mystical power of numbers
              </p>
            </div>
            <motion.div
              animate={{
                rotate: [360, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <Sparkles className="w-8 h-8 text-blue-400" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header
