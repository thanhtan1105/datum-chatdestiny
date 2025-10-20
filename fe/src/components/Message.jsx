import { motion } from 'framer-motion'
import { User, Bot, Sparkles, Zap } from 'lucide-react'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const Message = ({ message, index }) => {
  const isBot = message.sender === 'bot'
  const [isHovered, setIsHovered] = useState(false)

  // Remove <thinking> tags and their content from the message
  const cleanMessageText = (text) => {
    if (!text) return ''
    // Remove <thinking>...</thinking> tags and everything inside them
    return text.replace(/<thinking>[\s\S]*?<\/thinking>\s*/gi, '').trim()
  }

  const getAgentColor = (agent) => {
    switch (agent) {
      case 'welcome':
        return 'from-blue-500/30 to-purple-500/30'
      case 'numerology':
        return 'from-purple-500/30 to-pink-500/30'
      default:
        return 'from-gray-500/30 to-gray-600/30'
    }
  }

  const getAgentIcon = (agent) => {
    if (agent === 'numerology') {
      return <Sparkles className="w-5 h-5 text-white" />
    }
    return <Bot className="w-5 h-5 text-white" />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        type: "spring",
        stiffness: 100
      }}
      className={`flex gap-3 ${isBot ? 'justify-start' : 'justify-end'} group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isBot && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex-shrink-0 relative"
        >
          <motion.div
            animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 flex items-center justify-center shadow-xl relative overflow-hidden"
          >
            {/* Animated ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-white/20 border-t-white/60"
            />
            {getAgentIcon(message.agent)}
          </motion.div>
          {/* Glow effect */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-purple-500/30 blur-xl -z-10"
          />
        </motion.div>
      )}

      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ type: "spring", stiffness: 300 }}
        className={`max-w-[70%] ${isBot ? '' : 'order-first'} relative`}
      >
        {/* Message bubble */}
        <motion.div
          className={`rounded-2xl p-4 shadow-2xl relative overflow-hidden ${isBot
            ? `bg-gradient-to-br ${getAgentColor(message.agent)} backdrop-blur-xl border border-white/20`
            : 'bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700'
            }`}
        >
          {/* Shimmer effect */}
          <motion.div
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 5,
              ease: "easeInOut"
            }}
            className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
          />

          {/* Content */}
          <div className="relative z-10 prose prose-sm max-w-none prose-invert">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({node, ...props}) => <p className="mb-2 last:mb-0 text-white" {...props} />,
                strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
                em: ({node, ...props}) => <em className="italic text-white" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2 space-y-1 text-white" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-2 space-y-1 text-white" {...props} />,
                li: ({node, ...props}) => <li className="ml-2 text-white" {...props} />,
                code: ({node, inline, ...props}) => 
                  inline 
                    ? <code className="px-1.5 py-0.5 rounded bg-white/20 font-mono text-sm text-white" {...props} />
                    : <code className="block p-3 rounded-lg bg-white/20 font-mono text-sm overflow-x-auto my-2 text-white" {...props} />,
                h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-2 text-white" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-2 text-white" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-base font-bold mb-1 text-white" {...props} />,
                blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-white/40 pl-3 italic my-2 text-white" {...props} />,
                a: ({node, ...props}) => <a className="underline hover:opacity-80 text-white" target="_blank" rel="noopener noreferrer" {...props} />,
              }}
            >
              {cleanMessageText(message.text)}
            </ReactMarkdown>
            {message.agent && isBot && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-3 flex items-center gap-2 pt-2 border-t border-white/10"
              >
                <Zap className="w-3 h-3 text-purple-300" />
                <span className="text-xs text-purple-300 font-medium">
                  {message.agent === 'numerology' ? '✨ Numerology Oracle' : '👋 Welcome Guide'}
                </span>
              </motion.div>
            )}
          </div>

          {/* Corner decoration */}
          <div className={`absolute ${isBot ? 'top-0 left-0' : 'top-0 right-0'} w-20 h-20 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl`} />
        </motion.div>

        {/* Timestamp */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`text-xs text-gray-400 mt-2 flex items-center gap-2 ${isBot ? 'justify-start' : 'justify-end'}`}
        >
          <span className="opacity-0 group-hover:opacity-100 transition-opacity">
            {message.timestamp.toLocaleDateString()}
          </span>
          <span>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </motion.div>
      </motion.div>

      {!isBot && (
        <motion.div
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex-shrink-0 relative"
        >
          <motion.div
            animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 flex items-center justify-center shadow-xl relative overflow-hidden"
          >
            {/* Animated ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-white/20 border-t-white/60"
            />
            <User className="w-5 h-5 text-white" />
          </motion.div>
          {/* Glow effect */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-blue-500/30 blur-xl -z-10"
          />
        </motion.div>
      )}
    </motion.div>
  )
}

export default Message
