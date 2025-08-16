-- Location: supabase/migrations/20250816123917_exam_management_system.sql
-- Schema Analysis: Fresh project - no existing schema
-- Integration Type: Complete new system creation
-- Dependencies: None - creating complete schema from scratch

-- 1. Custom Types
CREATE TYPE public.user_role AS ENUM ('admin', 'student');
CREATE TYPE public.exam_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE public.attempt_status AS ENUM ('in_progress', 'completed', 'abandoned');
CREATE TYPE public.question_type AS ENUM ('multiple_choice', 'true_false', 'short_answer');
CREATE TYPE public.link_type AS ENUM ('zoom', 'meet', 'youtube');

-- 2. Core Tables

-- User profiles table (intermediary for auth.users)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'student'::public.user_role NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    profile_image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Exams table
CREATE TABLE public.exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    total_levels INTEGER DEFAULT 1 NOT NULL CHECK (total_levels >= 1 AND total_levels <= 10),
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
    status public.exam_status DEFAULT 'draft'::public.exam_status NOT NULL,
    scheduled_at TIMESTAMPTZ,
    passing_score DECIMAL(5,2) DEFAULT 60.00 NOT NULL CHECK (passing_score >= 0 AND passing_score <= 100),
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Questions table
CREATE TABLE public.questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE NOT NULL,
    question_text TEXT NOT NULL,
    question_type public.question_type DEFAULT 'multiple_choice'::public.question_type NOT NULL,
    level_number INTEGER NOT NULL CHECK (level_number >= 1 AND level_number <= 10),
    points DECIMAL(5,2) DEFAULT 1.00 NOT NULL CHECK (points > 0),
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    options JSONB, -- For multiple choice options
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Student exam attempts
CREATE TABLE public.exam_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    current_level INTEGER DEFAULT 1 NOT NULL CHECK (current_level >= 1 AND current_level <= 10),
    status public.attempt_status DEFAULT 'in_progress'::public.attempt_status NOT NULL,
    started_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    completed_at TIMESTAMPTZ,
    total_score DECIMAL(5,2) DEFAULT 0.00 NOT NULL,
    passed BOOLEAN DEFAULT false NOT NULL,
    answers JSONB DEFAULT '{}'::jsonb NOT NULL, -- Store all answers
    time_spent_seconds INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Level results for detailed tracking
CREATE TABLE public.level_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID REFERENCES public.exam_attempts(id) ON DELETE CASCADE NOT NULL,
    level_number INTEGER NOT NULL CHECK (level_number >= 1 AND level_number <= 10),
    score DECIMAL(5,2) DEFAULT 0.00 NOT NULL,
    total_questions INTEGER NOT NULL CHECK (total_questions > 0),
    correct_answers INTEGER DEFAULT 0 NOT NULL,
    passed BOOLEAN DEFAULT false NOT NULL,
    completed_at TIMESTAMPTZ,
    time_spent_seconds INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Class links table
CREATE TABLE public.class_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    link_url TEXT NOT NULL,
    link_type public.link_type NOT NULL,
    available_from TIMESTAMPTZ NOT NULL,
    available_until TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 3. Essential Indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_exams_created_by ON public.exams(created_by);
CREATE INDEX idx_exams_status ON public.exams(status);
CREATE INDEX idx_exams_scheduled_at ON public.exams(scheduled_at);
CREATE INDEX idx_questions_exam_id ON public.questions(exam_id);
CREATE INDEX idx_questions_level ON public.questions(exam_id, level_number);
CREATE INDEX idx_exam_attempts_exam_id ON public.exam_attempts(exam_id);
CREATE INDEX idx_exam_attempts_student_id ON public.exam_attempts(student_id);
CREATE INDEX idx_exam_attempts_status ON public.exam_attempts(status);
CREATE INDEX idx_level_results_attempt_id ON public.level_results(attempt_id);
CREATE INDEX idx_level_results_level ON public.level_results(attempt_id, level_number);
CREATE INDEX idx_class_links_availability ON public.class_links(available_from, available_until);
CREATE INDEX idx_class_links_active ON public.class_links(is_active);

-- 4. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.level_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_links ENABLE ROW LEVEL SECURITY;

-- 5. Helper Functions (before RLS policies)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid() 
    AND (au.raw_user_meta_data->>'role' = 'admin' 
         OR au.raw_app_meta_data->>'role' = 'admin')
)
$$;

CREATE OR REPLACE FUNCTION public.is_exam_creator(exam_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.exams e
    WHERE e.id = exam_uuid AND e.created_by = auth.uid()
)
$$;

CREATE OR REPLACE FUNCTION public.can_access_exam_content(exam_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT (
    public.is_admin() OR
    public.is_exam_creator(exam_uuid) OR
    EXISTS (
        SELECT 1 FROM public.exams e
        WHERE e.id = exam_uuid AND e.status = 'published'::public.exam_status
    )
)
$$;

-- 6. RLS Policies

-- Pattern 1: Core user table - Simple ownership only
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Admin full access to user profiles
CREATE POLICY "admins_manage_all_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Exams policies
CREATE POLICY "admins_manage_all_exams"
ON public.exams
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "creators_manage_own_exams"
ON public.exams
FOR ALL
TO authenticated
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

CREATE POLICY "students_view_published_exams"
ON public.exams
FOR SELECT
TO authenticated
USING (status = 'published'::public.exam_status);

-- Questions policies
CREATE POLICY "admins_manage_all_questions"
ON public.questions
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "creators_manage_exam_questions"
ON public.questions
FOR ALL
TO authenticated
USING (public.is_exam_creator(exam_id))
WITH CHECK (public.is_exam_creator(exam_id));

CREATE POLICY "students_view_published_exam_questions"
ON public.questions
FOR SELECT
TO authenticated
USING (public.can_access_exam_content(exam_id));

-- Exam attempts policies
CREATE POLICY "students_manage_own_attempts"
ON public.exam_attempts
FOR ALL
TO authenticated
USING (student_id = auth.uid())
WITH CHECK (student_id = auth.uid());

CREATE POLICY "admins_view_all_attempts"
ON public.exam_attempts
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "creators_view_exam_attempts"
ON public.exam_attempts
FOR SELECT
TO authenticated
USING (public.is_exam_creator(exam_id));

-- Level results policies
CREATE POLICY "students_view_own_level_results"
ON public.level_results
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.exam_attempts ea
        WHERE ea.id = attempt_id AND ea.student_id = auth.uid()
    )
);

CREATE POLICY "students_create_own_level_results"
ON public.level_results
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.exam_attempts ea
        WHERE ea.id = attempt_id AND ea.student_id = auth.uid()
    )
);

CREATE POLICY "students_update_own_level_results"
ON public.level_results
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.exam_attempts ea
        WHERE ea.id = attempt_id AND ea.student_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.exam_attempts ea
        WHERE ea.id = attempt_id AND ea.student_id = auth.uid()
    )
);

CREATE POLICY "admins_manage_all_level_results"
ON public.level_results
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Class links policies
CREATE POLICY "admins_manage_all_class_links"
ON public.class_links
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "creators_manage_own_class_links"
ON public.class_links
FOR ALL
TO authenticated
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

CREATE POLICY "students_view_available_class_links"
ON public.class_links
FOR SELECT
TO authenticated
USING (
    is_active = true 
    AND available_from <= CURRENT_TIMESTAMP 
    AND available_until >= CURRENT_TIMESTAMP
);

-- 7. Triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_exams_updated_at BEFORE UPDATE ON public.exams
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON public.questions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_exam_attempts_updated_at BEFORE UPDATE ON public.exam_attempts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_class_links_updated_at BEFORE UPDATE ON public.class_links
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 8. Function for automatic profile creation
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
        COALESCE(NEW.raw_user_meta_data->>'role', 'student')::public.user_role
    );
    RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. Mock Data
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    student1_uuid UUID := gen_random_uuid();
    student2_uuid UUID := gen_random_uuid();
    exam1_uuid UUID := gen_random_uuid();
    exam2_uuid UUID := gen_random_uuid();
    attempt1_uuid UUID := gen_random_uuid();
    attempt2_uuid UUID := gen_random_uuid();
    question1_uuid UUID := gen_random_uuid();
    question2_uuid UUID := gen_random_uuid();
    question3_uuid UUID := gen_random_uuid();
    question4_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@examflow.com', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "System Admin", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (student1_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'student1@examflow.com', crypt('student123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "John Doe", "role": "student"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (student2_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'student2@examflow.com', crypt('student123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Jane Smith", "role": "student"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create exams
    INSERT INTO public.exams (id, title, description, total_levels, duration_minutes, status, scheduled_at, passing_score, created_by)
    VALUES
        (exam1_uuid, 'JavaScript Fundamentals', 'Comprehensive test on JavaScript basics', 3, 90, 'published'::public.exam_status, 
         CURRENT_TIMESTAMP + INTERVAL '1 day', 70.00, admin_uuid),
        (exam2_uuid, 'React Development', 'Advanced React concepts and patterns', 2, 60, 'published'::public.exam_status,
         CURRENT_TIMESTAMP + INTERVAL '3 days', 75.00, admin_uuid);

    -- Create questions for exam 1
    INSERT INTO public.questions (id, exam_id, question_text, question_type, level_number, points, correct_answer, explanation, options)
    VALUES
        (question1_uuid, exam1_uuid, 'What is the correct way to declare a variable in JavaScript?', 
         'multiple_choice'::public.question_type, 1, 2.00, 'let variableName;',
         'The let keyword is the modern way to declare variables in JavaScript.',
         '{"options": ["var variableName;", "let variableName;", "const variableName;", "variableName;"]}'::jsonb),
        (question2_uuid, exam1_uuid, 'JavaScript is a compiled language.', 
         'true_false'::public.question_type, 1, 1.00, 'false',
         'JavaScript is an interpreted language, not compiled.',
         '{"options": ["true", "false"]}'::jsonb);

    -- Create questions for exam 2  
    INSERT INTO public.questions (id, exam_id, question_text, question_type, level_number, points, correct_answer, explanation, options)
    VALUES
        (question3_uuid, exam2_uuid, 'What hook is used for side effects in React?', 
         'multiple_choice'::public.question_type, 1, 2.00, 'useEffect',
         'useEffect is the primary hook for handling side effects in functional components.',
         '{"options": ["useState", "useEffect", "useContext", "useReducer"]}'::jsonb),
        (question4_uuid, exam2_uuid, 'What is JSX?', 
         'short_answer'::public.question_type, 1, 3.00, 'JavaScript XML',
         'JSX stands for JavaScript XML, a syntax extension for JavaScript.',
         null);

    -- Create exam attempts
    INSERT INTO public.exam_attempts (id, exam_id, student_id, current_level, status, total_score, passed, time_spent_seconds)
    VALUES
        (attempt1_uuid, exam1_uuid, student1_uuid, 1, 'completed'::public.attempt_status, 85.50, true, 2400),
        (attempt2_uuid, exam2_uuid, student2_uuid, 1, 'in_progress'::public.attempt_status, 0.00, false, 900);

    -- Create level results
    INSERT INTO public.level_results (attempt_id, level_number, score, total_questions, correct_answers, passed, completed_at, time_spent_seconds)
    VALUES
        (attempt1_uuid, 1, 85.50, 2, 2, true, CURRENT_TIMESTAMP - INTERVAL '1 hour', 1200);

    -- Create class links
    INSERT INTO public.class_links (title, description, link_url, link_type, available_from, available_until, created_by)
    VALUES
        ('JavaScript Basics Session', 'Introduction to JavaScript programming', 
         'https://meet.google.com/abc-def-ghi', 'meet'::public.link_type, 
         CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '2 hours', admin_uuid),
        ('React Workshop', 'Hands-on React development workshop',
         'https://zoom.us/j/123456789', 'zoom'::public.link_type,
         CURRENT_TIMESTAMP + INTERVAL '1 day', CURRENT_TIMESTAMP + INTERVAL '1 day' + INTERVAL '3 hours', admin_uuid);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;