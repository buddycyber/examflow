import { supabase } from '../lib/supabase';

export const analyticsService = {
  // Get dashboard stats for admin
  async getDashboardStats() {
    try {
      // Get total counts
      const [examsResult, studentsResult, attemptsResult, questionsResult] = await Promise.all([
        supabase?.from('exams')?.select('id', { count: 'exact' }),
        supabase?.from('user_profiles')?.select('id', { count: 'exact' })?.eq('role', 'student'),
        supabase?.from('exam_attempts')?.select('id', { count: 'exact' }),
        supabase?.from('questions')?.select('id', { count: 'exact' })
      ])

      // Get recent activity
      const { data: recentAttempts } = await supabase?.from('exam_attempts')?.select(`
          *,
          exam:exams(title),
          student:user_profiles!exam_attempts_student_id_fkey(full_name)
        `)?.order('created_at', { ascending: false })?.limit(10)

      // Get upcoming exams
      const { data: upcomingExams } = await supabase?.from('exams')?.select('*')?.eq('status', 'published')?.gte('scheduled_at', new Date()?.toISOString())?.order('scheduled_at', { ascending: true })?.limit(5)

      return {
        totalExams: examsResult?.count || 0,
        totalStudents: studentsResult?.count || 0,
        totalAttempts: attemptsResult?.count || 0,
        totalQuestions: questionsResult?.count || 0,
        recentActivity: recentAttempts || [],
        upcomingExams: upcomingExams || []
      };
    } catch (error) {
      throw new Error(`Failed to fetch dashboard stats: ${error.message}`)
    }
  },

  // Get performance analytics for student
  async getStudentAnalytics(studentId) {
    try {
      const { data: attempts, error } = await supabase?.from('exam_attempts')?.select(`
          *,
          exam:exams(title, total_levels),
          level_results(*)
        `)?.eq('student_id', studentId)?.order('created_at', { ascending: false })

      if (error) throw error

      const completedAttempts = attempts?.filter(a => a?.status === 'completed') || []
      
      const analytics = {
        totalAttempts: attempts?.length || 0,
        completedAttempts: completedAttempts?.length,
        inProgressAttempts: attempts?.filter(a => a?.status === 'in_progress')?.length || 0,
        averageScore: 0,
        passRate: 0,
        totalTimeSpent: 0,
        performanceByExam: [],
        progressOverTime: [],
        levelPerformance: {}
      }

      if (completedAttempts?.length > 0) {
        // Calculate averages
        analytics.averageScore = completedAttempts?.reduce((sum, a) => sum + a?.total_score, 0) / completedAttempts?.length
        analytics.passRate = (completedAttempts?.filter(a => a?.passed)?.length / completedAttempts?.length) * 100
        analytics.totalTimeSpent = completedAttempts?.reduce((sum, a) => sum + (a?.time_spent_seconds || 0), 0)

        // Performance by exam
        analytics.performanceByExam = completedAttempts?.map(attempt => ({
          examTitle: attempt?.exam?.title,
          score: attempt?.total_score,
          passed: attempt?.passed,
          completedAt: attempt?.completed_at,
          timeSpent: attempt?.time_spent_seconds
        }))

        // Progress over time
        analytics.progressOverTime = completedAttempts?.map(attempt => ({
          date: new Date(attempt.completed_at)?.toISOString()?.split('T')?.[0],
          score: attempt?.total_score,
          passed: attempt?.passed
        }))

        // Level performance analysis
        const allLevelResults = completedAttempts?.flatMap(a => a?.level_results || [])
        const levelGroups = {}
        
        allLevelResults?.forEach(result => {
          const level = result?.level_number
          if (!levelGroups?.[level]) {
            levelGroups[level] = {
              attempts: 0,
              totalScore: 0,
              passes: 0,
              totalTime: 0
            }
          }
          levelGroups[level].attempts++
          levelGroups[level].totalScore += result?.score
          levelGroups[level].passes += result?.passed ? 1 : 0
          levelGroups[level].totalTime += result?.time_spent_seconds || 0
        })

        analytics.levelPerformance = Object.keys(levelGroups)?.map(level => ({
          level: parseInt(level),
          averageScore: levelGroups?.[level]?.totalScore / levelGroups?.[level]?.attempts,
          passRate: (levelGroups?.[level]?.passes / levelGroups?.[level]?.attempts) * 100,
          averageTime: levelGroups?.[level]?.totalTime / levelGroups?.[level]?.attempts,
          attempts: levelGroups?.[level]?.attempts
        }))
      }

      return analytics
    } catch (error) {
      throw new Error(`Failed to fetch student analytics: ${error.message}`)
    }
  },

  // Get system-wide analytics for admin
  async getSystemAnalytics() {
    try {
      // Get all attempts with exam and student data
      const { data: attempts, error: attemptsError } = await supabase?.from('exam_attempts')?.select(`
          *,
          exam:exams(title, total_levels, created_by),
          student:user_profiles!exam_attempts_student_id_fkey(full_name),
          level_results(*)
        `)

      if (attemptsError) throw attemptsError

      const completedAttempts = attempts?.filter(a => a?.status === 'completed') || []

      const analytics = {
        overview: {
          totalAttempts: attempts?.length || 0,
          completedAttempts: completedAttempts?.length,
          overallPassRate: completedAttempts?.length > 0 
            ? (completedAttempts?.filter(a => a?.passed)?.length / completedAttempts?.length) * 100 
            : 0,
          averageScore: completedAttempts?.length > 0 
            ? completedAttempts?.reduce((sum, a) => sum + a?.total_score, 0) / completedAttempts?.length 
            : 0
        },
        examPerformance: [],
        studentPerformance: [],
        timeAnalytics: {
          averageCompletionTime: completedAttempts?.length > 0 
            ? completedAttempts?.reduce((sum, a) => sum + (a?.time_spent_seconds || 0), 0) / completedAttempts?.length 
            : 0
        },
        trendsOverTime: []
      }

      // Exam performance breakdown
      const examGroups = {}
      completedAttempts?.forEach(attempt => {
        const examId = attempt?.exam_id
        const examTitle = attempt?.exam?.title || 'Unknown Exam'
        
        if (!examGroups?.[examId]) {
          examGroups[examId] = {
            title: examTitle,
            attempts: 0,
            totalScore: 0,
            passes: 0,
            totalTime: 0
          }
        }
        
        examGroups[examId].attempts++
        examGroups[examId].totalScore += attempt?.total_score
        examGroups[examId].passes += attempt?.passed ? 1 : 0
        examGroups[examId].totalTime += attempt?.time_spent_seconds || 0
      })

      analytics.examPerformance = Object.values(examGroups)?.map(exam => ({
        examTitle: exam?.title,
        totalAttempts: exam?.attempts,
        averageScore: exam?.totalScore / exam?.attempts,
        passRate: (exam?.passes / exam?.attempts) * 100,
        averageTime: exam?.totalTime / exam?.attempts
      }))

      // Student performance summary
      const studentGroups = {}
      completedAttempts?.forEach(attempt => {
        const studentId = attempt?.student_id
        const studentName = attempt?.student?.full_name || 'Unknown Student'
        
        if (!studentGroups?.[studentId]) {
          studentGroups[studentId] = {
            name: studentName,
            attempts: 0,
            totalScore: 0,
            passes: 0
          }
        }
        
        studentGroups[studentId].attempts++
        studentGroups[studentId].totalScore += attempt?.total_score
        studentGroups[studentId].passes += attempt?.passed ? 1 : 0
      })

      analytics.studentPerformance = Object.values(studentGroups)?.map(student => ({
        studentName: student?.name,
        totalAttempts: student?.attempts,
        averageScore: student?.totalScore / student?.attempts,
        passRate: (student?.passes / student?.attempts) * 100
      }))?.sort((a, b) => b?.averageScore - a?.averageScore)

      // Trends over time (last 30 days)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo?.setDate(thirtyDaysAgo?.getDate() - 30)

      const recentAttempts = completedAttempts?.filter(a => 
        new Date(a.completed_at) >= thirtyDaysAgo
      )

      const dailyStats = {}
      recentAttempts?.forEach(attempt => {
        const date = new Date(attempt.completed_at)?.toISOString()?.split('T')?.[0]
        
        if (!dailyStats?.[date]) {
          dailyStats[date] = {
            date,
            attempts: 0,
            totalScore: 0,
            passes: 0
          }
        }
        
        dailyStats[date].attempts++
        dailyStats[date].totalScore += attempt?.total_score
        dailyStats[date].passes += attempt?.passed ? 1 : 0
      })

      analytics.trendsOverTime = Object.values(dailyStats)?.map(day => ({
        date: day?.date,
        attempts: day?.attempts,
        averageScore: day?.totalScore / day?.attempts,
        passRate: (day?.passes / day?.attempts) * 100
      }))?.sort((a, b) => new Date(a.date) - new Date(b.date))

      return analytics
    } catch (error) {
      throw new Error(`Failed to fetch system analytics: ${error.message}`)
    }
  }
}