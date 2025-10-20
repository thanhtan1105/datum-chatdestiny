import { motion, AnimatePresence } from 'framer-motion'
import Message from './Message'

const MessageList = ({ messages }) => {
  return (
    <AnimatePresence>
      {messages.map((message, index) => (
        <Message key={message.id} message={message} index={index} />
      ))}
    </AnimatePresence>
  )
}

export default MessageList
