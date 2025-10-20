import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, History, X, LogIn } from 'lucide-react'
import { getSessionMessages } from '../services/api'

const SessionManager = ({ onLoadSession, currentActorId, currentSessionId }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [actorId, setActorId] = useState(currentActorId || '')
    const [sessionId, setSessionId] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const handleLoadSession = async () => {
        if (!actorId || !sessionId) {
            setError('Please enter both User ID and Session ID')
            return
        }

        setIsLoading(true)
        setError('')

        try {
            const data = await getSessionMessages(actorId, sessionId)
            // Pass the entered IDs to parent to update state
            onLoadSession(actorId, sessionId, data.messages || [])
            setIsOpen(false)
            setError('')
        } catch (err) {
            console.error('Session load error:', err)
            setError('Failed to load session. Please check your IDs.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            {/* Trigger Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="fixed top-24 right-6 z-20 p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg hover:shadow-purple-500/50 transition-all"
            >
                <History className="w-6 h-6 text-white" />
            </motion.button>

            {/* Modal */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
                        >
                            <div className="glass-effect rounded-3xl p-6 shadow-2xl">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                            <User className="w-5 h-5 text-white" />
                                        </div>
                                        <h2 className="text-xl font-bold text-white">Load Session</h2>
                                    </div>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                    >
                                        <X className="w-5 h-5 text-gray-400" />
                                    </button>
                                </div>

                                {/* Current Session Info */}
                                {currentActorId && currentSessionId && (
                                    <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                        <p className="text-xs text-blue-300 mb-2 font-medium">Current Session</p>
                                        <div className="space-y-1">
                                            <div>
                                                <p className="text-xs text-blue-200">User ID:</p>
                                                <p className="text-xs text-white font-mono break-all">{currentActorId}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-blue-200">Session ID:</p>
                                                <p className="text-xs text-white font-mono break-all">{currentSessionId}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Form */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            User ID
                                        </label>
                                        <input
                                            type="text"
                                            value={actorId}
                                            onChange={(e) => setActorId(e.target.value)}
                                            placeholder="e.g., user_abc123"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Session ID
                                        </label>
                                        <input
                                            type="text"
                                            value={sessionId}
                                            onChange={(e) => setSessionId(e.target.value)}
                                            placeholder="e.g., session_1234567890"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl"
                                        >
                                            <p className="text-sm text-red-300">{error}</p>
                                        </motion.div>
                                    )}

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleLoadSession}
                                        disabled={isLoading}
                                        className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-medium shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Loading...
                                            </>
                                        ) : (
                                            <>
                                                <LogIn className="w-5 h-5" />
                                                Load Session
                                            </>
                                        )}
                                    </motion.button>
                                </div>

                                {/* Help Text */}
                                <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                                    <p className="text-xs text-purple-300">
                                        💡 Enter your User ID and Session ID to load previous conversations
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}

export default SessionManager
