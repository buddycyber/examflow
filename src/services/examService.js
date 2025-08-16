import { supabase } from '../lib/supabase';

export const examService = {
  // Get all exams (admin/creator view or published exams for students)
  async getExams() {
    try {
      const { data, error } = await supabase?.from('exams')?.select(`
          *,
          created_by_profile:user_profiles!exams_created_by_fkey(id, full_name),
          questions(id),
          exam_attempts(id, status, student_id)
        `)?.order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      throw new Error(`Failed to fetch exams: ${error.message}`)
    }
  },

  // Get exam by ID with questions
  async getExamById(examId) {
    try {
      const { data, error } = await supabase?.from('exams')?.select(`
          *,
          created_by_profile:user_profiles!exams_created_by_fkey(id, full_name, email),
          questions(*),
          exam_attempts(*)
        `)?.eq('id', examId)?.single()

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(`Failed to fetch exam: ${error.message}`)
    }
  },

  // Create new exam
  async createExam(examData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase?.from('exams')?.insert([{
          ...examData,
          created_by: user?.id
        }])?.select()?.single()

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(`Failed to create exam: ${error.message}`)
    }
  },

  // Update exam
  async updateExam(examId, updates) {
    try {
      const { data, error } = await supabase?.from('exams')?.update(updates)?.eq('id', examId)?.select()?.single()

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(`Failed to update exam: ${error.message}`)
    }
  },

  // Delete exam
  async deleteExam(examId) {
    try {
      const { error } = await supabase?.from('exams')?.delete()?.eq('id', examId)

      if (error) throw error
      return true
    } catch (error) {
      throw new Error(`Failed to delete exam: ${error.message}`)
    }
  },

  // Get questions for specific exam and level
  async getExamQuestions(examId, level = null) {
    try {
      let query = supabase?.from('questions')?.select('*')?.eq('exam_id', examId)?.order('level_number', { ascending: true })

      if (level) {
        query = query?.eq('level_number', level)
      }

      const { data, error } = await query
      if (error) throw error
      return data || []
    } catch (error) {
      throw new Error(`Failed to fetch questions: ${error.message}`)
    }
  },

  // Create question
  async createQuestion(questionData) {
    try {
      const { data, error } = await supabase?.from('questions')?.insert([questionData])?.select()?.single()

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(`Failed to create question: ${error.message}`)
    }
  },

  // Update question
  async updateQuestion(questionId, updates) {
    try {
      const { data, error } = await supabase?.from('questions')?.update(updates)?.eq('id', questionId)?.select()?.single()

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(`Failed to update question: ${error.message}`)
    }
  },

  // Delete question
  async deleteQuestion(questionId) {
    try {
      const { error } = await supabase?.from('questions')?.delete()?.eq('id', questionId)

      if (error) throw error
      return true
    } catch (error) {
      throw new Error(`Failed to delete question: ${error.message}`)
    }
  }
}