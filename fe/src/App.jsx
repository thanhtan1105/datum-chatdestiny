import WaifuChatInterface from './components/WaifuChatInterface'
import AuthPage from './components/AuthPage'
import BackgroundEffects from './components/BackgroundEffects'
import ParticleField from './components/ParticleField'
import { motion } from 'framer-motion'
import { Sparkles, LogOut } from 'lucide-react'
import { useAuth } from './contexts/AuthContext'

function App() {
  const { user, logout, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <BackgroundEffects />
        <ParticleField />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="relative z-10"
        >
          <Sparkles className="w-12 h-12 text-purple-400" />
        </motion.div>
      </div>
    )
  }

  if (!user) {
    return <AuthPage />
  }

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

      {/* User info and logout */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5 }}
        className="fixed top-6 right-6 z-30 flex items-center gap-3"
      >
        <div className="px-4 py-2 bg-gradient-to-r from-purple-900/90 to-pink-900/90 backdrop-blur-xl rounded-full border border-white/20 shadow-lg">
          <span className="text-sm text-purple-200">Welcome, {user.name}!</span>
        </div>
        <button
          onClick={logout}
          className="p-3 bg-gradient-to-r from-red-500/80 to-pink-500/80 backdrop-blur-xl rounded-full border border-white/20 shadow-lg hover:scale-110 transition-all duration-300 group"
          title="Logout"
        >
          <LogOut className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
        </button>
      </motion.div>

      <div className="relative z-10">
        <WaifuChatInterface />
      </div>
    </div>
  )
}

export default App
