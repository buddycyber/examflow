import { supabase } from '../lib/supabase';

export const userService = {
  // Get all users (admin only)
  async getAllUsers() {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.select('*')?.order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error.message}`)
    }
  },

  // Get user by ID
  async getUserById(userId) {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.select('*')?.eq('id', userId)?.single()

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(`Failed to fetch user: ${error.message}`)
    }
  },

  // Create new user account (admin only)
  async createUserAccount(userData) {
    try {
      // Create auth user first
      const { data: authData, error: authError } = await supabase?.auth?.admin?.createUser({
        email: userData?.email,
        password: userData?.password || 'TempPassword123!',
        email_confirm: true,
        user_metadata: {
          full_name: userData?.full_name,
          role: userData?.role || 'student'
        }
      })

      if (authError) throw authError

      return authData?.user;
    } catch (error) {
      throw new Error(`Failed to create user account: ${error.message}`)
    }
  },

  // Update user profile
  async updateUser(userId, updates) {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.update(updates)?.eq('id', userId)?.select()?.single()

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`)
    }
  },

  // Delete user (admin only)
  async deleteUser(userId) {
    try {
      // Delete from auth.users (cascade will handle user_profiles)
      const { error: authError } = await supabase?.auth?.admin?.deleteUser(userId)
      if (authError) throw authError

      return true
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`)
    }
  },

  // Reset user password (admin only)
  async resetUserPassword(userId, newPassword) {
    try {
      const { data, error } = await supabase?.auth?.admin?.updateUserById(userId, {
        password: newPassword
      })

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(`Failed to reset password: ${error.message}`)
    }
  },

  // Get students only
  async getStudents() {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.select('*')?.eq('role', 'student')?.order('full_name', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      throw new Error(`Failed to fetch students: ${error.message}`)
    }
  },

  // Get user statistics
  async getUserStats(userId) {
    try {
      const { data: attempts, error: attemptsError } = await supabase?.from('exam_attempts')?.select(`
          *,
          exam:exams(title),
          level_results(*)
        `)?.eq('student_id', userId)

      if (attemptsError) throw attemptsError

      const stats = {
        totalAttempts: attempts?.length || 0,
        completedAttempts: attempts?.filter(a => a?.status === 'completed')?.length || 0,
        inProgressAttempts: attempts?.filter(a => a?.status === 'in_progress')?.length || 0,
        averageScore: 0,
        passedExams: 0
      }

      if (stats?.completedAttempts > 0) {
        const completedAttempts = attempts?.filter(a => a?.status === 'completed')
        stats.averageScore = completedAttempts?.reduce((sum, attempt) => sum + attempt?.total_score, 0) / completedAttempts?.length
        stats.passedExams = completedAttempts?.filter(a => a?.passed)?.length
      }

      return stats
    } catch (error) {
      throw new Error(`Failed to fetch user stats: ${error.message}`)
    }
  }
}