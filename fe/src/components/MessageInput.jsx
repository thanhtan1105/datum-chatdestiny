import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles } from 'lucide-react'

const MessageInput = ({ onSend, disabled }) => {
  const [input, setInput] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim() && !disabled) {
      onSend(input.trim())
      setInput('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex gap-3">
        <div className="flex-1 relative">
          {/* Animated border glow */}
          <AnimatePresence>
            {isFocused && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-2xl blur opacity-75"
              />
            )}
          </AnimatePresence>

          {/* Input container */}
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={disabled}
              placeholder="Ask about your numerology..."
              className="w-full px-6 py-4 pr-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative z-10"
            />
            
            {/* Sparkle icon */}
            <motion.div
              animate={{
                opacity: input.length > 0 ? [0.5, 1, 0.5] : 0.3,
                rotate: input.length > 0 ? [0, 10, -10, 0] : 0,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none z-20"
            >
              <Sparkles className="w-5 h-5 text-purple-400" />
            </motion.div>

            {/* Character count indicator */}
            <AnimatePresence>
              {input.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute -bottom-6 right-2 text-xs text-gray-500"
                >
                  {input.length} characters
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Send button */}
        <motion.button
          type="submit"
          disabled={disabled || !input.trim()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative px-6 py-4 rounded-2xl text-white font-medium shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2 overflow-hidden group"
        >
          {/* Animated gradient background */}
          <motion.div
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-[length:200%_100%]"
          />
          
          {/* Shine effect */}
          <motion.div
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
              ease: "easeInOut"
            }}
            className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
          />

          {/* Button content */}
          <div className="relative z-10 flex items-center gap-2">
            <motion.div
              animate={disabled ? { rotate: 360 } : {}}
              transition={{ duration: 1, repeat: disabled ? Infinity : 0, ease: "linear" }}
            >
              <Send className="w-5 h-5" />
            </motion.div>
            <span className="hidden sm:inline font-semibold">Send</span>
          </div>

          {/* Glow effect on hover */}
          <motion.div
            className="absolute inset-0 bg-purple-500/50 blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"
          />
        </motion.button>
      </div>
    </form>
  )
}

export default MessageInput
