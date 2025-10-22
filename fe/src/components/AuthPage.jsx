import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Star, Moon, Sun } from 'lucide-react'
import BackgroundEffects from './BackgroundEffects'
import ParticleField from './ParticleField'
import { useAuth } from '../contexts/AuthContext'

const AuthPage = () => {
  const { loginWithGoogle, isLoading } = useAuth()
  const [error, setError] = useState('')

  const handleGoogleLogin = async () => {
    try {
      setError('')
      const result = await loginWithGoogle()
      if (!result.success) {
        setError(result.error || 'Google authentication failed')
      }
    } catch (error) {
      console.error('Google login error:', error)
      setError('Failed to connect with Google. Please try again.')
    }
  }



  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <BackgroundEffects />
      <ParticleField />

      {/* Floating mystical elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 left-20 text-purple-300/30"
      >
        <Star className="w-8 h-8" />
      </motion.div>

      <motion.div
        animate={{
          y: [0, 15, 0],
          rotate: [0, -10, 10, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute top-40 right-32 text-pink-300/30"
      >
        <Moon className="w-6 h-6" />
      </motion.div>

      <motion.div
        animate={{
          y: [0, -10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-32 left-32 text-yellow-300/30"
      >
        <Sun className="w-7 h-7" />
      </motion.div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <div className="relative inline-block">
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-xl opacity-50" />

              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="relative"
              >
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
              </motion.div>
            </div>

            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 bg-clip-text text-transparent mb-2">
              Numerology Oracle
            </h1>
            <p className="text-purple-200/70">
              Begin your mystical journey
            </p>
          </motion.div>

          {/* Social Auth Card */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            {/* Glow background */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-2xl blur-xl opacity-30" />

            <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-8">
              {/* Error message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-center"
                >
                  {error}
                </motion.div>
              )}

              {/* Welcome message */}
              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold text-white mb-2">
                  Welcome to the Oracle
                </h2>
                <p className="text-purple-200/80 text-sm">
                  Sign in with Google to continue your mystical journey
                </p>
              </div>

              {/* Google login button */}
              <motion.button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className="w-full py-4 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl text-gray-700 font-medium transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full"
                  />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                <span>Continue with Google</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-6 text-sm text-purple-200/70"
          >
            By continuing, you agree to our mystical{' '}
            <button className="text-pink-300 hover:text-pink-200 underline">
              Terms of Service
            </button>{' '}
            and{' '}
            <button className="text-pink-300 hover:text-pink-200 underline">
              Privacy Policy
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default AuthPage
