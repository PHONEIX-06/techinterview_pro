import { supabase } from './supabase';

class InterviewService {
  // Get all interviews for the current user
  async getInterviews(filters = {}) {
    try {
      let query = supabase
        .from('interviews')
        .select(`
          *,
          interviewer:interviewer_id(id, full_name, email, role),
          candidate:candidate_id(id, full_name, email, role)
        `)
        .order('scheduled_at', { ascending: false });

      // Apply filters
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.type) {
        query = query.eq('interview_type', filters.type);
      }
      if (filters?.dateFrom) {
        query = query.gte('scheduled_at', filters.dateFrom);
      }
      if (filters?.dateTo) {
        query = query.lte('scheduled_at', filters.dateTo);
      }

      const { data, error } = await query;

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError') ||
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to load interviews' };
    }
  }

  // Get a specific interview by ID
  async getInterview(interviewId) {
    try {
      const { data, error } = await supabase
        .from('interviews')
        .select(`
          *,
          interviewer:interviewer_id(id, full_name, email, role, avatar_url),
          candidate:candidate_id(id, full_name, email, role, avatar_url),
          coding_sessions(*),
          interview_messages(*, sender:sender_id(id, full_name, avatar_url))
        `)
        .eq('id', interviewId)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError') ||
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to load interview details' };
    }
  }

  // Create a new interview
  async createInterview(interviewData) {
    try {
      const { data, error } = await supabase
        .from('interviews')
        .insert([{
          title: interviewData.title,
          description: interviewData.description,
          interviewer_id: interviewData.interviewerId,
          candidate_id: interviewData.candidateId,
          scheduled_at: interviewData.scheduledAt,
          duration_minutes: interviewData.durationMinutes || 60,
          interview_type: interviewData.type || 'technical',
          difficulty_level: interviewData.difficulty || 'mid',
          position_title: interviewData.positionTitle,
          meeting_url: interviewData.meetingUrl
        }])
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError') ||
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to create interview' };
    }
  }

  // Update interview
  async updateInterview(interviewId, updates) {
    try {
      const { data, error } = await supabase
        .from('interviews')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', interviewId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError') ||
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to update interview' };
    }
  }

  // Delete interview
  async deleteInterview(interviewId) {
    try {
      const { error } = await supabase
        .from('interviews')
        .delete()
        .eq('id', interviewId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError') ||
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to delete interview' };
    }
  }

  // Get upcoming interviews
  async getUpcomingInterviews(limit = 5) {
    try {
      const { data, error } = await supabase
        .from('interviews')
        .select(`
          *,
          interviewer:interviewer_id(id, full_name, email),
          candidate:candidate_id(id, full_name, email)
        `)
        .eq('status', 'scheduled')
        .gte('scheduled_at', new Date().toISOString())
        .order('scheduled_at', { ascending: true })
        .limit(limit);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError') ||
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to load upcoming interviews' };
    }
  }

  // Get interview analytics/metrics
  async getInterviewMetrics(userId, role) {
    try {
      const currentDate = new Date().toISOString();
      const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

      // Build query based on user role
      const roleFilter = role === 'interviewer' ? 'interviewer_id' : 'candidate_id';
      
      const [upcomingResult, completedResult, recentResult] = await Promise.all([
        // Upcoming interviews
        supabase
          .from('interviews')
          .select('id')
          .eq(roleFilter, userId)
          .eq('status', 'scheduled')
          .gte('scheduled_at', currentDate),
        
        // Completed interviews
        supabase
          .from('interviews')
          .select('id, rating')
          .eq(roleFilter, userId)
          .eq('status', 'completed'),
        
        // Recent interviews (last week)
        supabase
          .from('interviews')
          .select('id')
          .eq(roleFilter, userId)
          .gte('created_at', lastWeek)
      ]);

      const metrics = {
        upcomingCount: upcomingResult?.data?.length || 0,
        completedCount: completedResult?.data?.length || 0,
        recentCount: recentResult?.data?.length || 0,
        averageRating: 0,
        successRate: 0
      };

      // Calculate average rating if there are completed interviews
      if (completedResult?.data?.length > 0) {
        const ratingsSum = completedResult.data
          .filter(interview => interview.rating)
          .reduce((sum, interview) => sum + interview.rating, 0);
        const ratingsCount = completedResult.data.filter(interview => interview.rating).length;
        
        if (ratingsCount > 0) {
          metrics.averageRating = (ratingsSum / ratingsCount).toFixed(1);
        }
      }

      // Calculate success rate (assuming ratings >= 4 are successful)
      if (completedResult?.data?.length > 0) {
        const successfulInterviews = completedResult.data
          .filter(interview => interview.rating && interview.rating >= 4).length;
        metrics.successRate = Math.round((successfulInterviews / completedResult.data.length) * 100);
      }

      return { success: true, data: metrics };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError') ||
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to load interview metrics' };
    }
  }

  // Subscribe to real-time updates for interviews
  subscribeToInterviews(callback) {
    const channel = supabase
      .channel('interviews')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'interviews' },
        (payload) => {
          callback?.(payload);
        }
      )
      .subscribe();

    return channel;
  }

  // Unsubscribe from real-time updates
  unsubscribeFromInterviews(channel) {
    if (channel) {
      supabase.removeChannel(channel);
    }
  }
}

export default new InterviewService();