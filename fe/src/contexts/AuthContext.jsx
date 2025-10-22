import { createContext, useContext, useState, useEffect } from 'react'
import { initializeGoogleAuth, signInWithGooglePopup } from '../utils/googleAuth'
import { clearStoredTokens } from '../services/tokenService'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      // Check for stored auth token on app load
      const storedUser = localStorage.getItem('numerology_user')
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser))
        } catch (error) {
          console.error('Error parsing stored user:', error)
          localStorage.removeItem('numerology_user')
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const loginWithGoogle = async () => {
    setIsLoading(true)
    try {
      // Use real Google OAuth
      const googleUserData = await signInWithGooglePopup()
      const userData = {
        id: googleUserData.id,
        username: googleUserData.email.split('@')[0], // Use email prefix as username
        email: googleUserData.email,
        name: googleUserData.name,
        avatar: googleUserData.avatar,
        birthday: googleUserData.birthday,
        provider: 'google',
        joinDate: new Date().toISOString()
      }

      setUser(userData)
      localStorage.setItem('numerology_user', JSON.stringify(userData))
      return { success: true }
    } catch (error) {
      console.error('Google login error:', error)
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }



  const logout = () => {
    setUser(null)
    localStorage.removeItem('numerology_user')
    clearStoredTokens() // Clear OAuth tokens
  }

  const value = {
    user,
    isLoading,
    loginWithGoogle,
    logout,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
