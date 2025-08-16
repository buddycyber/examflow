import { supabase } from '../lib/supabase';

export const classLinkService = {
  // Get all class links (available ones for students, all for admins)
  async getClassLinks() {
    try {
      const { data, error } = await supabase?.from('class_links')?.select(`
          *,
          created_by_profile:user_profiles!class_links_created_by_fkey(id, full_name)
        `)?.order('available_from', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      throw new Error(`Failed to fetch class links: ${error.message}`)
    }
  },

  // Get available class links (for students - time-gated)
  async getAvailableClassLinks() {
    try {
      const now = new Date()?.toISOString()
      
      const { data, error } = await supabase?.from('class_links')?.select(`
          *,
          created_by_profile:user_profiles!class_links_created_by_fkey(id, full_name)
        `)?.eq('is_active', true)?.lte('available_from', now)?.gte('available_until', now)?.order('available_from', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      throw new Error(`Failed to fetch available class links: ${error.message}`)
    }
  },

  // Create new class link
  async createClassLink(linkData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase?.from('class_links')?.insert([{
          ...linkData,
          created_by: user?.id
        }])?.select(`
          *,
          created_by_profile:user_profiles!class_links_created_by_fkey(id, full_name)
        `)?.single()

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(`Failed to create class link: ${error.message}`)
    }
  },

  // Update class link
  async updateClassLink(linkId, updates) {
    try {
      const { data, error } = await supabase?.from('class_links')?.update(updates)?.eq('id', linkId)?.select(`
          *,
          created_by_profile:user_profiles!class_links_created_by_fkey(id, full_name)
        `)?.single()

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(`Failed to update class link: ${error.message}`)
    }
  },

  // Delete class link
  async deleteClassLink(linkId) {
    try {
      const { error } = await supabase?.from('class_links')?.delete()?.eq('id', linkId)

      if (error) throw error
      return true
    } catch (error) {
      throw new Error(`Failed to delete class link: ${error.message}`)
    }
  },

  // Get class link by ID
  async getClassLinkById(linkId) {
    try {
      const { data, error } = await supabase?.from('class_links')?.select(`
          *,
          created_by_profile:user_profiles!class_links_created_by_fkey(id, full_name, email)
        `)?.eq('id', linkId)?.single()

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(`Failed to fetch class link: ${error.message}`)
    }
  },

  // Toggle class link active status
  async toggleClassLinkStatus(linkId, isActive) {
    try {
      const { data, error } = await supabase?.from('class_links')?.update({ is_active: isActive })?.eq('id', linkId)?.select()?.single()

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(`Failed to toggle class link status: ${error.message}`)
    }
  }
}