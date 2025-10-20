import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import TypingIndicator from './TypingIndicator'
import SessionManager from './SessionManager'
import { sendMessage } from '../services/api'

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Welcome! I'm your numerology guide. I can help you discover your life path number, analyze your name, and provide mystical insights. What would you like to explore?",
      sender: 'bot',
      agent: 'welcome',
      timestamp: new Date()
    }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [sessionId, setSessionId] = useState(() => `session_${Date.now()}`)
  const [actorId, setActorId] = useState(() => `user_${Math.random().toString(36).substr(2, 9)}`)

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleLoadSession = (newActorId, newSessionId, loadedMessages) => {
    setActorId(newActorId)
    setSessionId(newSessionId)

    // Convert loaded messages to UI format
    const formattedMessages = loadedMessages.map((msg, index) => ({
      id: Date.now() + index,
      text: msg.text,
      sender: msg.sender,
      agent: msg.sender === 'bot' ? 'welcome' : undefined,
      timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date()
    }))

    setMessages(formattedMessages.length > 0 ? formattedMessages : [
      {
        id: 1,
        text: "Session loaded! Continue your conversation.",
        sender: 'bot',
        agent: 'welcome',
        timestamp: new Date()
      }
    ])
  }

  // Remove <thinking> tags and their content from text
  const cleanThinkingTags = (text) => {
    if (!text) return ''
    return text.replace(/<thinking>[\s\S]*?<\/thinking>\s*/gi, '').trim()
  }

  const handleSendMessage = async (text) => {
    // Add user message
    const userMessage = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)

    try {
      // Send to backend
      const response = await sendMessage(text, actorId, sessionId)

      // Add bot response (clean thinking tags)
      const botMessage = {
        id: Date.now() + 1,
        text: cleanThinkingTags(response.response),
        sender: 'bot',
        agent: response.agent,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = {
        id: Date.now() + 1,
        text: "I apologize, but I'm having trouble connecting. Please try again.",
        sender: 'bot',
        agent: 'error',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <>
      <SessionManager
        onLoadSession={handleLoadSession}
        currentActorId={actorId}
        currentSessionId={sessionId}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-4xl mx-auto px-4 pb-8"
      >
        <motion.div
          className="glass-effect rounded-3xl shadow-2xl overflow-hidden relative"
          initial={{ boxShadow: "0 0 0 rgba(168, 85, 247, 0)" }}
          animate={{ boxShadow: "0 20px 60px rgba(168, 85, 247, 0.3)" }}
          transition={{ duration: 1 }}
        >
          {/* Top gradient bar */}
          <div className="h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 animate-shimmer bg-[length:200%_100%]" />
          
          {/* Chat messages area */}
          <div className="h-[600px] overflow-y-auto p-6 space-y-6 relative">
            {/* Scroll gradient overlays */}
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-slate-900/80 to-transparent pointer-events-none z-10" />
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-900/80 to-transparent pointer-events-none z-10" />
            
            <MessageList messages={messages} />
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-white/10 p-6 bg-black/20 backdrop-blur-xl relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <MessageInput onSend={handleSendMessage} disabled={isTyping} />
            </div>
          </div>
        </motion.div>

        {/* Session info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-4 p-4 glass-effect rounded-2xl"
        >
          <div className="text-center space-y-2">
            <div className="text-xs text-gray-400 font-medium">Current Session</div>
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs text-purple-400">User ID:</span>
                <code className="text-xs text-white bg-white/5 px-2 py-1 rounded font-mono">
                  {actorId}
                </code>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs text-purple-400">Session ID:</span>
                <code className="text-xs text-white bg-white/5 px-2 py-1 rounded font-mono">
                  {sessionId}
                </code>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              💡 Save these IDs to resume your conversation later
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  )
}

export default ChatInterface
