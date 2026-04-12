-- Create performance_logs table - THE FOUNDATION FOR PERFORMANCE INTELLIGENCE SYSTEM
-- Every learning interaction (quiz, practice, etc.) must log data here

CREATE TABLE IF NOT EXISTS public.performance_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type TEXT NOT NULL CHECK (user_type IN ('school', 'college')), -- school or college
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE SET NULL,
  topic_name TEXT, -- e.g., "Electrostatics", "Dynamic Programming"
  quiz_id UUID REFERENCES public.quiz_questions(id) ON DELETE SET NULL,
  
  -- Performance metrics
  score INTEGER NOT NULL, -- points scored
  total_questions INTEGER NOT NULL, -- total questions attempted
  accuracy DECIMAL(5, 2) NOT NULL, -- percentage (0-100)
  time_taken INTEGER, -- seconds
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')), -- question difficulty level
  
  -- Attempt tracking
  attempt_number INTEGER DEFAULT 1, -- 1st attempt, 2nd attempt, etc.
  
  -- Performance classification
  performance_level TEXT GENERATED ALWAYS AS (
    CASE
      WHEN accuracy < 50 THEN 'weak'
      WHEN accuracy >= 50 AND accuracy <= 75 THEN 'medium'
      WHEN accuracy > 75 THEN 'strong'
    END
  ) STORED,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Indices for fast querying
  CONSTRAINT performance_logs_user_subject_idx UNIQUE (user_id, subject_id, quiz_id, created_at)
);

-- Add indexes for common queries
CREATE INDEX idx_performance_logs_user_id ON public.performance_logs(user_id);
CREATE INDEX idx_performance_logs_subject_id ON public.performance_logs(subject_id);
CREATE INDEX idx_performance_logs_user_type ON public.performance_logs(user_type);
CREATE INDEX idx_performance_logs_chapter_id ON public.performance_logs(chapter_id);
CREATE INDEX idx_performance_logs_created_at ON public.performance_logs(created_at DESC);
CREATE INDEX idx_performance_logs_performance_level ON public.performance_logs(performance_level);
CREATE INDEX idx_performance_logs_user_subject_date ON public.performance_logs(user_id, subject_id, created_at DESC);

-- Enable RLS
ALTER TABLE public.performance_logs ENABLE ROW LEVEL SECURITY;

-- RLS policy: Users can only view their own performance logs
CREATE POLICY "Users can view their own performance logs"
  ON public.performance_logs
  FOR SELECT
  USING (auth.uid() = user_id);

-- RLS policy: Users can only insert their own performance logs
CREATE POLICY "Users can insert their own performance logs"
  ON public.performance_logs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS policy: Users can update their own performance logs
CREATE POLICY "Users can update their own performance logs"
  ON public.performance_logs
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create view for quick performance statistics
CREATE OR REPLACE VIEW public.user_performance_summary AS
SELECT
  pl.user_id,
  pl.subject_id,
  ROUND(AVG(pl.accuracy), 2) as avg_accuracy,
  ROUND(AVG(CASE WHEN pl.performance_level = 'weak' THEN 1 ELSE 0 END) * 100, 1) as weak_percentage,
  ROUND(AVG(CASE WHEN pl.performance_level = 'medium' THEN 1 ELSE 0 END) * 100, 1) as medium_percentage,
  ROUND(AVG(CASE WHEN pl.performance_level = 'strong' THEN 1 ELSE 0 END) * 100, 1) as strong_percentage,
  COUNT(*) as total_attempts,
  MAX(pl.created_at) as last_activity,
  MIN(pl.created_at) as first_activity
FROM public.performance_logs pl
GROUP BY pl.user_id, pl.subject_id;

-- Create view for weak topics detection
CREATE OR REPLACE VIEW public.user_weak_topics AS
SELECT
  pl.user_id,
  pl.subject_id,
  pl.topic_name,
  COUNT(*) as attempts,
  ROUND(AVG(pl.accuracy), 2) as avg_accuracy,
  pl.performance_level
FROM public.performance_logs pl
WHERE pl.performance_level = 'weak'
GROUP BY pl.user_id, pl.subject_id, pl.topic_name, pl.performance_level
ORDER BY pl.user_id, pl.subject_id, ROUND(AVG(pl.accuracy), 2) ASC;
