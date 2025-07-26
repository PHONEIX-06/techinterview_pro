import { supabase } from './supabase';

class MessageService {
  // Get messages for an interview
  async getInterviewMessages(interviewId) {
    try {
      const { data, error } = await supabase
        .from('interview_messages')
        .select(`
          *,
          sender:sender_id(id, full_name, avatar_url, role)
        `)
        .eq('interview_id', interviewId)
        .order('timestamp', { ascending: true });

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
      return { success: false, error: 'Failed to load messages' };
    }
  }

  // Send a message
  async sendMessage(interviewId, senderId, message, messageType = 'text') {
    try {
      const { data, error } = await supabase
        .from('interview_messages')
        .insert([{
          interview_id: interviewId,
          sender_id: senderId,
          message,
          message_type: messageType,
          timestamp: new Date().toISOString()
        }])
        .select(`
          *,
          sender:sender_id(id, full_name, avatar_url, role)
        `)
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
      return { success: false, error: 'Failed to send message' };
    }
  }

  // Update message (for editing)
  async updateMessage(messageId, newMessage) {
    try {
      const { data, error } = await supabase
        .from('interview_messages')
        .update({ 
          message: newMessage,
          updated_at: new Date().toISOString()
        })
        .eq('id', messageId)
        .select(`
          *,
          sender:sender_id(id, full_name, avatar_url, role)
        `)
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
      return { success: false, error: 'Failed to update message' };
    }
  }

  // Delete message
  async deleteMessage(messageId) {
    try {
      const { error } = await supabase
        .from('interview_messages')
        .delete()
        .eq('id', messageId);

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
      return { success: false, error: 'Failed to delete message' };
    }
  }

  // Subscribe to real-time messages
  subscribeToMessages(interviewId, callback) {
    const channel = supabase
      .channel(`messages_${interviewId}`)
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'interview_messages',
          filter: `interview_id=eq.${interviewId}`
        },
        async (payload) => {
          // If it's a new message, fetch the complete data with sender info
          if (payload.eventType === 'INSERT') {
            try {
              const { data, error } = await supabase
                .from('interview_messages')
                .select(`
                  *,
                  sender:sender_id(id, full_name, avatar_url, role)
                `)
                .eq('id', payload.new.id)
                .single();

              if (!error && data) {
                callback?.({ ...payload, new: data });
                return;
              }
            } catch (error) {
              console.log('Error fetching complete message data:', error);
            }
          }
          
          callback?.(payload);
        }
      )
      .subscribe();

    return channel;
  }

  // Unsubscribe from real-time updates
  unsubscribeFromMessages(channel) {
    if (channel) {
      supabase.removeChannel(channel);
    }
  }

  // Get recent messages for multiple interviews (for dashboard)
  async getRecentMessages(userId, limit = 10) {
    try {
      const { data, error } = await supabase
        .from('interview_messages')
        .select(`
          *,
          sender:sender_id(id, full_name, avatar_url),
          interview:interview_id(
            id, title, status,
            interviewer:interviewer_id(id, full_name),
            candidate:candidate_id(id, full_name)
          )
        `)
        .or(`interview.interviewer_id.eq.${userId},interview.candidate_id.eq.${userId}`)
        .order('timestamp', { ascending: false })
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
      return { success: false, error: 'Failed to load recent messages' };
    }
  }
}

export default new MessageService();