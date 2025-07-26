-- Location: supabase/migrations/20250126202000_techinterview_platform.sql
-- Schema Analysis: Fresh project - creating complete technical interview platform schema
-- Integration Type: NEW_MODULE - Complete technical interview system
-- Dependencies: None (fresh implementation)

-- 1. Types and Enums
CREATE TYPE public.user_role AS ENUM ('admin', 'interviewer', 'candidate');
CREATE TYPE public.interview_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');
CREATE TYPE public.interview_type AS ENUM ('technical', 'behavioral', 'system_design', 'coding');
CREATE TYPE public.difficulty_level AS ENUM ('junior', 'mid', 'senior', 'principal');

-- 2. Core Tables - User Management
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'candidate'::public.user_role,
    avatar_url TEXT,
    bio TEXT,
    company TEXT,
    position TEXT,
    experience_years INTEGER DEFAULT 0,
    skills JSONB DEFAULT '[]'::jsonb,
    timezone TEXT DEFAULT 'UTC',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Interview Management Tables
CREATE TABLE public.interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    interviewer_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    candidate_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    status public.interview_status DEFAULT 'scheduled'::public.interview_status,
    interview_type public.interview_type DEFAULT 'technical'::public.interview_type,
    difficulty_level public.difficulty_level DEFAULT 'mid'::public.difficulty_level,
    position_title TEXT,
    meeting_url TEXT,
    notes TEXT,
    feedback JSONB DEFAULT '{}'::jsonb,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Code Collaboration Tables
CREATE TABLE public.coding_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    interview_id UUID REFERENCES public.interviews(id) ON DELETE CASCADE,
    language TEXT DEFAULT 'javascript',
    initial_code TEXT DEFAULT '',
    final_code TEXT DEFAULT '',
    session_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Chat and Communication Tables
CREATE TABLE public.interview_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    interview_id UUID REFERENCES public.interviews(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    message_type TEXT DEFAULT 'text',
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Templates and Resources
CREATE TABLE public.interview_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    template_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    interview_type public.interview_type DEFAULT 'technical'::public.interview_type,
    difficulty_level public.difficulty_level DEFAULT 'mid'::public.difficulty_level,
    is_public BOOLEAN DEFAULT false,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. Analytics and Tracking
CREATE TABLE public.interview_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    interview_id UUID REFERENCES public.interviews(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    event_data JSONB DEFAULT '{}'::jsonb,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. Essential Indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_interviews_interviewer_id ON public.interviews(interviewer_id);
CREATE INDEX idx_interviews_candidate_id ON public.interviews(candidate_id);
CREATE INDEX idx_interviews_scheduled_at ON public.interviews(scheduled_at);
CREATE INDEX idx_interviews_status ON public.interviews(status);
CREATE INDEX idx_coding_sessions_interview_id ON public.coding_sessions(interview_id);
CREATE INDEX idx_interview_messages_interview_id ON public.interview_messages(interview_id);
CREATE INDEX idx_interview_templates_created_by ON public.interview_templates(created_by);
CREATE INDEX idx_interview_analytics_interview_id ON public.interview_analytics(interview_id);

-- 9. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coding_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_analytics ENABLE ROW LEVEL SECURITY;

-- 10. Helper Functions for RLS
CREATE OR REPLACE FUNCTION public.is_interview_participant(interview_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.interviews i
    WHERE i.id = interview_uuid 
    AND (i.interviewer_id = auth.uid() OR i.candidate_id = auth.uid())
)
$$;

CREATE OR REPLACE FUNCTION public.has_role(required_role TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role::TEXT = required_role
)
$$;

CREATE OR REPLACE FUNCTION public.is_template_owner(template_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.interview_templates it
    WHERE it.id = template_uuid AND it.created_by = auth.uid()
)
$$;

-- 11. RLS Policies
-- User Profiles Policies
CREATE POLICY "users_own_profile" ON public.user_profiles FOR ALL
USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "public_can_view_basic_profiles" ON public.user_profiles FOR SELECT
USING (true);

-- Interviews Policies
CREATE POLICY "interview_participants_access" ON public.interviews FOR ALL
USING (public.is_interview_participant(id)) WITH CHECK (public.is_interview_participant(id));

CREATE POLICY "interviewers_can_create" ON public.interviews FOR INSERT
WITH CHECK (public.has_role('interviewer') OR public.has_role('admin'));

-- Coding Sessions Policies
CREATE POLICY "session_participants_access" ON public.coding_sessions FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.interviews i
        WHERE i.id = interview_id AND public.is_interview_participant(i.id)
    )
);

-- Interview Messages Policies
CREATE POLICY "message_participants_access" ON public.interview_messages FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.interviews i
        WHERE i.id = interview_id AND public.is_interview_participant(i.id)
    )
);

-- Interview Templates Policies
CREATE POLICY "template_owners_manage" ON public.interview_templates FOR ALL
USING (public.is_template_owner(id)) WITH CHECK (public.is_template_owner(id));

CREATE POLICY "public_templates_viewable" ON public.interview_templates FOR SELECT
USING (is_public = true);

-- Analytics Policies
CREATE POLICY "analytics_participants_access" ON public.interview_analytics FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.interviews i
        WHERE i.id = interview_id AND public.is_interview_participant(i.id)
    )
);

-- 12. Trigger Functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'candidate')::public.user_role
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- 13. Triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_interviews_updated_at
    BEFORE UPDATE ON public.interviews
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_coding_sessions_updated_at
    BEFORE UPDATE ON public.coding_sessions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_interview_templates_updated_at
    BEFORE UPDATE ON public.interview_templates
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 14. Mock Data
DO $$
DECLARE
    interviewer1_id UUID := gen_random_uuid();
    interviewer2_id UUID := gen_random_uuid();
    candidate1_id UUID := gen_random_uuid();
    candidate2_id UUID := gen_random_uuid();
    admin_id UUID := gen_random_uuid();
    interview1_id UUID := gen_random_uuid();
    interview2_id UUID := gen_random_uuid();
    interview3_id UUID := gen_random_uuid();
BEGIN
    -- Create auth users with complete field structure
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (interviewer1_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'interviewer@techinterview.com', crypt('interviewer123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Mike Chen", "role": "interviewer"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (interviewer2_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'emily.davis@techinterview.com', crypt('emily123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Emily Davis", "role": "interviewer"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (candidate1_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'candidate@techinterview.com', crypt('candidate123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Sarah Johnson", "role": "candidate"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (candidate2_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'alex.rodriguez@techinterview.com', crypt('alex123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Alex Rodriguez", "role": "candidate"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (admin_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@techinterview.com', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "John Smith", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create sample interviews
    INSERT INTO public.interviews (id, title, description, interviewer_id, candidate_id, scheduled_at, duration_minutes, status, interview_type, difficulty_level, position_title)
    VALUES
        (interview1_id, 'React Frontend Developer Interview', 'Technical interview focusing on React hooks and component architecture', interviewer1_id, candidate1_id, '2025-01-27T14:00:00Z', 60, 'scheduled'::public.interview_status, 'technical'::public.interview_type, 'mid'::public.difficulty_level, 'Senior Frontend Developer'),
        (interview2_id, 'Full Stack Engineer Assessment', 'Comprehensive technical interview covering frontend and backend development', interviewer2_id, candidate2_id, '2025-01-28T10:30:00Z', 90, 'scheduled'::public.interview_status, 'technical'::public.interview_type, 'senior'::public.difficulty_level, 'Full Stack Engineer'),
        (interview3_id, 'System Design Discussion', 'High-level system design interview for scalable applications', interviewer1_id, candidate1_id, '2025-01-25T16:00:00Z', 75, 'completed'::public.interview_status, 'system_design'::public.interview_type, 'senior'::public.difficulty_level, 'Senior Software Engineer');

    -- Create coding sessions
    INSERT INTO public.coding_sessions (interview_id, language, initial_code, final_code)
    VALUES
        (interview1_id, 'javascript', '// Implement a React component for user authentication', '// Complete React authentication component with hooks'),
        (interview2_id, 'javascript', '// Build a full-stack todo application', '// Complete todo app with React frontend and Node.js backend'),
        (interview3_id, 'javascript', '// Design a chat application architecture', '// Detailed system design with microservices architecture');

    -- Create sample messages
    INSERT INTO public.interview_messages (interview_id, sender_id, message, message_type)
    VALUES
        (interview1_id, interviewer1_id, 'Welcome to the interview! Let us start with a brief introduction.', 'text'),
        (interview1_id, candidate1_id, 'Thank you! I am excited to discuss my React experience.', 'text'),
        (interview2_id, interviewer2_id, 'We will begin with some technical questions about full-stack development.', 'text');

    -- Create sample templates
    INSERT INTO public.interview_templates (created_by, name, description, template_data, interview_type, difficulty_level, is_public)
    VALUES
        (interviewer1_id, 'React Hooks Assessment', 'Template for evaluating React hooks knowledge', '{"questions": ["Explain useState", "Implement useEffect"], "coding_challenges": ["Custom hook implementation"]}'::jsonb, 'technical'::public.interview_type, 'mid'::public.difficulty_level, true),
        (interviewer2_id, 'System Design Template', 'Template for system design interviews', '{"topics": ["Scalability", "Database design", "API architecture"], "duration": 75}'::jsonb, 'system_design'::public.interview_type, 'senior'::public.difficulty_level, true);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;