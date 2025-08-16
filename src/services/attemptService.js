import { supabase } from '../lib/supabase';

export const attemptService = {
  // Start new exam attempt
  async startExamAttempt(examId) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser()
      if (!user) throw new Error('User not authenticated')

      // Check if there's already an active attempt
      const { data: existingAttempt } = await supabase?.from('exam_attempts')?.select('*')?.eq('exam_id', examId)?.eq('student_id', user?.id)?.eq('status', 'in_progress')?.single()

      if (existingAttempt) {
        return existingAttempt
      }

      // Create new attempt
      const { data, error } = await supabase?.from('exam_attempts')?.insert([{
          exam_id: examId,
          student_id: user?.id,
          current_level: 1,
          status: 'in_progress'
        }])?.select(`
          *,
          exam:exams(*),
          student:user_profiles!exam_attempts_student_id_fkey(*)
        `)?.single()

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(`Failed to start exam attempt: ${error.message}`)
    }
  },

  // Get student's exam attempts
  async getStudentAttempts(studentId = null) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser()
      if (!user) throw new Error('User not authenticated')

      const targetStudentId = studentId || user?.id

      const { data, error } = await supabase?.from('exam_attempts')?.select(`
          *,
          exam:exams(*),
          level_results(*),
          student:user_profiles!exam_attempts_student_id_fkey(id, full_name, email)
        `)?.eq('student_id', targetStudentId)?.order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      throw new Error(`Failed to fetch attempts: ${error.message}`)
    }
  },

  // Get all attempts (admin view)
  async getAllAttempts() {
    try {
      const { data, error } = await supabase?.from('exam_attempts')?.select(`
          *,
          exam:exams(id, title, total_levels),
          student:user_profiles!exam_attempts_student_id_fkey(id, full_name, email),
          level_results(*)
        `)?.order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      throw new Error(`Failed to fetch all attempts: ${error.message}`)
    }
  },

  // Get attempt by ID
  async getAttemptById(attemptId) {
    try {
      const { data, error } = await supabase?.from('exam_attempts')?.select(`
          *,
          exam:exams(*),
          student:user_profiles!exam_attempts_student_id_fkey(*),
          level_results(*)
        `)?.eq('id', attemptId)?.single()

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(`Failed to fetch attempt: ${error.message}`)
    }
  },

  // Update attempt (save answers, update progress)
  async updateAttempt(attemptId, updates) {
    try {
      const { data, error } = await supabase?.from('exam_attempts')?.update(updates)?.eq('id', attemptId)?.select()?.single()

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(`Failed to update attempt: ${error.message}`)
    }
  },

  // Submit level and create level result
  async submitLevel(attemptId, levelNumber, levelResults) {
    try {
      // Create level result
      const { data: levelResult, error: levelError } = await supabase?.from('level_results')?.insert([{
          attempt_id: attemptId,
          level_number: levelNumber,
          score: levelResults?.score,
          total_questions: levelResults?.totalQuestions,
          correct_answers: levelResults?.correctAnswers,
          passed: levelResults?.passed,
          completed_at: new Date()?.toISOString(),
          time_spent_seconds: levelResults?.timeSpent || 0
        }])?.select()?.single()

      if (levelError) throw levelError

      // Update attempt with current level and total score
      const updateData = {
        current_level: levelResults?.isLastLevel ? levelNumber : levelNumber + 1,
        total_score: levelResults?.totalScore || 0,
        time_spent_seconds: levelResults?.totalTimeSpent || 0
      }

      if (levelResults?.isLastLevel) {
        updateData.status = 'completed'
        updateData.completed_at = new Date()?.toISOString()
        updateData.passed = levelResults?.overallPassed || false
      }

      const { data: updatedAttempt, error: attemptError } = await supabase?.from('exam_attempts')?.update(updateData)?.eq('id', attemptId)?.select()?.single()

      if (attemptError) throw attemptError

      return { levelResult, updatedAttempt }
    } catch (error) {
      throw new Error(`Failed to submit level: ${error.message}`)
    }
  },

  // Complete exam attempt
  async completeAttempt(attemptId, finalResults) {
    try {
      const { data, error } = await supabase?.from('exam_attempts')?.update({
          status: 'completed',
          completed_at: new Date()?.toISOString(),
          total_score: finalResults?.totalScore,
          passed: finalResults?.passed,
          time_spent_seconds: finalResults?.totalTimeSpent
        })?.eq('id', attemptId)?.select()?.single()

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(`Failed to complete attempt: ${error.message}`)
    }
  },

  // Get level results for attempt
  async getLevelResults(attemptId) {
    try {
      const { data, error } = await supabase?.from('level_results')?.select('*')?.eq('attempt_id', attemptId)?.order('level_number', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      throw new Error(`Failed to fetch level results: ${error.message}`)
    }
  }
}