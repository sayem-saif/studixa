-- Create table for skill video notes
CREATE TABLE public.skill_video_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id TEXT NOT NULL,
  video_index INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id, video_index)
);

-- Create table for tracking watched videos
CREATE TABLE public.skill_watched_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id TEXT NOT NULL,
  video_index INTEGER NOT NULL,
  watched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id, video_index)
);

-- Create table for skill certificates
CREATE TABLE public.skill_certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id TEXT NOT NULL,
  course_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  issued_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  certificate_number TEXT NOT NULL,
  UNIQUE(user_id, course_id)
);

-- Enable RLS on all tables
ALTER TABLE public.skill_video_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_watched_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_certificates ENABLE ROW LEVEL SECURITY;

-- RLS policies for skill_video_notes
CREATE POLICY "Users can view their own notes" ON public.skill_video_notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own notes" ON public.skill_video_notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own notes" ON public.skill_video_notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own notes" ON public.skill_video_notes FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for skill_watched_videos
CREATE POLICY "Users can view their own watched videos" ON public.skill_watched_videos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own watched videos" ON public.skill_watched_videos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own watched videos" ON public.skill_watched_videos FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for skill_certificates
CREATE POLICY "Users can view their own certificates" ON public.skill_certificates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own certificates" ON public.skill_certificates FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Trigger for updating updated_at
CREATE TRIGGER update_skill_video_notes_updated_at
BEFORE UPDATE ON public.skill_video_notes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();