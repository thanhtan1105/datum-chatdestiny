import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, RotateCcw } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import CharacterAvatar from './CharacterAvatar'
import SessionManager from './SessionManager'
import TarotCardReveal from './TarotCardReveal'
import { sendMessage } from '../services/api'

const WaifuChatInterface = () => {
  // Generate UUID v4
  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Welcome, dear seeker! ✨ I'm your mystical numerology guide. I can reveal the secrets hidden in your name and birth date. What mysteries shall we uncover together?",
      sender: 'bot',
      agent: 'welcome',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isUserTyping, setIsUserTyping] = useState(false)
  const [sessionId, setSessionId] = useState(() => generateUUID())
  const [actorId, setActorId] = useState(() => generateUUID())
  const messagesEndRef = useRef(null)
  const [headFlying, setHeadFlying] = useState(false)
  const [latestResponse, setLatestResponse] = useState(null)
  const [showTarotReveal, setShowTarotReveal] = useState(false)
  const [tarotCards, setTarotCards] = useState([])
  const [pendingTarotResponse, setPendingTarotResponse] = useState(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleLoadSession = (newActorId, newSessionId, loadedMessages) => {
    // Update both actorId and sessionId to match loaded session
    setActorId(newActorId)
    setSessionId(newSessionId)
    
    const formattedMessages = loadedMessages.map((msg, index) => ({
      id: Date.now() + index,
      text: msg.text,
      sender: msg.sender,
      agent: msg.sender === 'bot' ? (msg.agent || 'welcome') : undefined,
      timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date()
    }))
    
    setMessages(formattedMessages.length > 0 ? formattedMessages : [
      {
        id: 1,
        text: "Welcome back! Let's continue our mystical journey together! ✨",
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

  const handleSendMessage = async () => {
    if (!input.trim() || isTyping) return

    const userMessage = {
      id: Date.now(),
      text: input.trim(),
      sender: 'user',
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    try {
      const response = await sendMessage(input.trim(), actorId, sessionId)
      
      // Prepare the response (clean thinking tags)
      const botMessage = {
        id: Date.now() + 1,
        text: cleanThinkingTags(response.response),
        sender: 'bot',
        agent: response.agent,
        timestamp: new Date(),
        cardList: response.card_list || []
      }
      
      // Check if this is a tarot reading with cards
      if (response.agent === 'tarot' && response.card_list && response.card_list.length > 0) {
        // Stop thinking
        setIsTyping(false)
        
        // Show tarot card reveal
        setTarotCards(response.card_list)
        setPendingTarotResponse(botMessage)
        setShowTarotReveal(true)
      } else {
        // Normal flow - stop thinking, start head flying animation
        setIsTyping(false)
        setLatestResponse(botMessage)
        setHeadFlying(true)
        
        // After head flies to chatbox (1.5s animation), add message and reset
        setTimeout(() => {
          setMessages(prev => [...prev, botMessage])
          setHeadFlying(false)
          setLatestResponse(null)
        }, 1500)
      }
      
    } catch (error) {
      console.error('Error:', error)
      const errorMessage = {
        id: Date.now() + 1,
        text: "Oh my! Something went wrong... Please try again! 💫",
        sender: 'bot',
        agent: 'error',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleTarotRevealComplete = () => {
    // Hide tarot reveal
    setShowTarotReveal(false)
    
    // Show head flying animation with the response
    setLatestResponse(pendingTarotResponse)
    setHeadFlying(true)
    
    // After head flies to chatbox, add message and reset
    setTimeout(() => {
      setMessages(prev => [...prev, pendingTarotResponse])
      setHeadFlying(false)
      setLatestResponse(null)
      setPendingTarotResponse(null)
      setTarotCards([])
    }, 1500)
  }

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Tarot Card Reveal Overlay */}
      <AnimatePresence>
        {showTarotReveal && (
          <TarotCardReveal
            cards={tarotCards}
            onComplete={handleTarotRevealComplete}
            responseText={pendingTarotResponse?.text}
          />
        )}
      </AnimatePresence>

      {/* Character Avatar */}
      <CharacterAvatar isTyping={isTyping} headFlying={headFlying} latestResponse={latestResponse} isUserTyping={isUserTyping} />

      {/* Session Manager */}
      <SessionManager 
        onLoadSession={handleLoadSession}
        currentActorId={actorId}
        currentSessionId={sessionId}
      />

      {/* Messages Container */}
      <div className="absolute inset-0 flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 pt-20 pb-28 md:ml-[45%] md:mr-4">
          <div className="max-w-3xl mx-auto space-y-4">
            <AnimatePresence mode="popLayout">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 50, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                    delay: index * 0.05
                  }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    className={`max-w-[85%] md:max-w-[80%] relative group`}
                  >
                    {/* Message bubble */}
                    <div
                      className={`rounded-2xl px-5 py-4 shadow-lg relative overflow-hidden ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600'
                          : 'bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl border border-purple-200/50'
                      }`}
                    >
                      {/* Content */}
                      <div className={`${message.sender === 'user' ? 'text-white' : 'text-gray-800'} text-sm md:text-base leading-relaxed relative z-10 prose prose-sm md:prose-base max-w-none ${message.sender === 'user' ? 'prose-invert' : ''}`}>
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            // Style markdown elements
                            p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                            em: ({node, ...props}) => <em className="italic" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />,
                            li: ({node, ...props}) => <li className="ml-2" {...props} />,
                            code: ({node, inline, ...props}) => 
                              inline 
                                ? <code className={`px-1.5 py-0.5 rounded ${message.sender === 'user' ? 'bg-white/20' : 'bg-purple-100'} font-mono text-sm`} {...props} />
                                : <code className={`block p-3 rounded-lg ${message.sender === 'user' ? 'bg-white/20' : 'bg-purple-100'} font-mono text-sm overflow-x-auto my-2`} {...props} />,
                            h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-2" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-2" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-base font-bold mb-1" {...props} />,
                            blockquote: ({node, ...props}) => <blockquote className={`border-l-4 ${message.sender === 'user' ? 'border-white/40' : 'border-purple-400'} pl-3 italic my-2`} {...props} />,
                            a: ({node, ...props}) => <a className="underline hover:opacity-80" target="_blank" rel="noopener noreferrer" {...props} />,
                          }}
                        >
                          {message.text}
                        </ReactMarkdown>
                      </div>

                      {/* Agent badge */}
                      {message.agent && message.sender === 'bot' && (
                        <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-purple-100 rounded-full">
                          <Sparkles className="w-3 h-3 text-purple-600" />
                          <span className="text-xs text-purple-700 font-medium">
                            {message.agent === 'numerology' ? 'Numerology' : 
                             message.agent === 'tarot' ? 'Tarot Reading' : 'Guide'}
                          </span>
                        </div>
                      )}
                      
                      {/* Tarot cards indicator */}
                      {message.cardList && message.cardList.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {message.cardList.map((card, idx) => (
                            <div key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 rounded-full text-xs text-amber-800">
                              🔮 {card}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Timestamp */}
                    <div className={`text-xs text-gray-400 mt-1 px-1 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="absolute bottom-0 left-0 right-0 p-3 md:p-4 md:ml-[45%] md:mr-2"
        >
          <div className="w-full">
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="relative"
            >
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-full blur-xl opacity-75" />
              
              {/* Input container */}
              <div className="relative bg-gradient-to-r from-purple-900/90 to-pink-900/90 backdrop-blur-2xl rounded-full p-2 border-2 border-white/20 shadow-2xl">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value)
                      setIsUserTyping(e.target.value.length > 0)
                    }}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsUserTyping(input.length > 0)}
                    onBlur={() => setIsUserTyping(false)}
                    disabled={isTyping}
                    placeholder="Share your thoughts with me... ✨"
                    className="flex-1 px-4 py-3 bg-transparent text-white placeholder-purple-200/50 focus:outline-none text-base"
                  />
                  
                  <motion.button
                    onClick={handleSendMessage}
                    disabled={isTyping || !input.trim()}
                    whileHover={{ scale: 1.1, rotate: 15 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-xl disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                  >
                    {/* Shine effect */}
                    <motion.div
                      animate={{
                        x: ['-100%', '200%'],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                      className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                    />
                    <Send className="w-5 h-5 text-white relative z-10" />
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Session info - Smaller */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-2 text-center"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black/30 backdrop-blur-xl rounded-full border border-white/10">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-purple-300">User:</span>
                  <code className="text-[10px] text-white font-mono">{actorId.slice(0, 8)}...</code>
                </div>
                <div className="w-px h-3 bg-white/20" />
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-purple-300">Session:</span>
                  <code className="text-[10px] text-white font-mono">{sessionId.slice(0, 8)}...</code>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default WaifuChatInterface
