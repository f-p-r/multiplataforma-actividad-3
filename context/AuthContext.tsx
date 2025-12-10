// context/AuthContext.tsx
import React, { createContext, useContext, useState } from 'react'

interface UserData {
  username: string
  name: string
  surname: string
  email: string
  phone: string
}

interface AuthContextType {
  user: UserData | null
  isLoading: boolean
  login: (userData: UserData) => Promise<boolean>
  logout: () => Promise<void>
  updateUser: (updatedData: Partial<UserData>) => Promise<boolean>
  isSignedIn: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const login = async (userData: UserData): Promise<boolean> => {
    try {
      setIsLoading(true)
      setUser(userData)
      return true
    } catch (e) {
      console.error('[AuthContext] Login error:', e)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true)
      setUser(null)
    } catch (e) {
      console.error('Logout error:', e)
    } finally {
      setIsLoading(false)
    }
  }

  const updateUser = async (updatedData: Partial<UserData>): Promise<boolean> => {
    try {
      setIsLoading(true)
      if (user) {
        const newUserData = { ...user, ...updatedData }
        setUser(newUserData)
        return true
      }
      return false
    } catch (e) {
      console.error('Update user error:', e)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    updateUser,
    isSignedIn: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
