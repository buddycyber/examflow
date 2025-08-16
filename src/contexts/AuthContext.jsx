import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session - Use Promise chain
    supabase?.auth?.getSession()?.then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session?.user)
          fetchUserProfile(session?.user?.id)
        }
        setLoading(false)
      })

    // Listen for auth changes - NEVER ASYNC callback
    const { data: { subscription } } = supabase?.auth?.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session?.user)
          fetchUserProfile(session?.user?.id)  // Fire-and-forget, NO AWAIT
        } else {
          setUser(null)
          setUserProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  const fetchUserProfile = (userId) => {
    supabase?.from('user_profiles')?.select('*')?.eq('id', userId)?.single()?.then(({ data, error }) => {
        if (error && error?.code !== 'PGRST116') {
          console.error('Error fetching user profile:', error)
        } else {
          setUserProfile(data)
        }
      })
  }

  const signUp = async (email, password, userData = {}) => {
    try {
      const { data, error } = await supabase?.auth?.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData?.full_name || '',
            role: userData?.role || 'student'
          }
        }
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error?.message };
    }
  }

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase?.auth?.signInWithPassword({
        email,
        password
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error?.message };
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase?.auth?.signOut()
      if (error) throw error
      
      setUser(null)
      setUserProfile(null)
      return { error: null }
    } catch (error) {
      return { error: error?.message };
    }
  }

  const resetPassword = async (email) => {
    try {
      const { data, error } = await supabase?.auth?.resetPasswordForEmail(email, {
        redirectTo: `${window.location?.origin}/reset-password`
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error?.message };
    }
  }

  const updateProfile = async (updates) => {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.update(updates)?.eq('id', user?.id)?.select()?.single()

      if (error) throw error
      setUserProfile(data)
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error?.message };
    }
  }

  const value = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    isAdmin: userProfile?.role === 'admin',
    isStudent: userProfile?.role === 'student'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}