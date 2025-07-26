import { supabase } from './supabase';

class CodingSessionService {
  // Get coding session for an interview
  async getCodingSession(interviewId) {
    try {
      const { data, error } = await supabase
        .from('coding_sessions')
        .select('*')
        .eq('interview_id', interviewId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
        return { success: false, error: error.message };
      }

      return { success: true, data: data || null };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError') ||
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to load coding session' };
    }
  }

  // Create or update coding session
  async upsertCodingSession(interviewId, sessionData) {
    try {
      const { data, error } = await supabase
        .from('coding_sessions')
        .upsert({
          interview_id: interviewId,
          language: sessionData?.language || 'javascript',
          initial_code: sessionData?.initialCode || '',
          final_code: sessionData?.finalCode || '',
          session_data: sessionData?.sessionData || {},
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'interview_id'
        })
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
      return { success: false, error: 'Failed to save coding session' };
    }
  }

  // Update code in real-time
  async updateCode(interviewId, code, language = 'javascript') {
    try {
      const { data, error } = await supabase
        .from('coding_sessions')
        .upsert({
          interview_id: interviewId,
          language,
          final_code: code,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'interview_id'
        })
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
      return { success: false, error: 'Failed to update code' };
    }
  }

  // Save session data (cursor position, selections, etc.)
  async saveSessionData(interviewId, sessionData) {
    try {
      const { data, error } = await supabase
        .from('coding_sessions')
        .upsert({
          interview_id: interviewId,
          session_data: sessionData,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'interview_id'
        })
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
      return { success: false, error: 'Failed to save session data' };
    }
  }

  // Subscribe to real-time code changes
  subscribeToCodingSession(interviewId, callback) {
    const channel = supabase
      .channel(`coding_session_${interviewId}`)
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'coding_sessions',
          filter: `interview_id=eq.${interviewId}`
        },
        (payload) => {
          callback?.(payload);
        }
      )
      .subscribe();

    return channel;
  }

  // Unsubscribe from real-time updates
  unsubscribeFromCodingSession(channel) {
    if (channel) {
      supabase.removeChannel(channel);
    }
  }

  // Get all coding sessions for a user (for history/review)
  async getUserCodingSessions(userId, role = 'candidate') {
    try {
      const roleField = role === 'interviewer' ? 'interviewer_id' : 'candidate_id';
      
      const { data, error } = await supabase
        .from('coding_sessions')
        .select(`
          *,
          interview:interview_id(
            id, title, scheduled_at, status, position_title,
            interviewer:interviewer_id(full_name),
            candidate:candidate_id(full_name)
          )
        `)
        .eq(`interview.${roleField}`, userId)
        .order('updated_at', { ascending: false });

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
      return { success: false, error: 'Failed to load coding sessions' };
    }
  }
}

export default new CodingSessionService();