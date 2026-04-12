-- Seed core Class 9/10 content so onboarding, subjects, and quiz work for general stream.
-- Safe to run multiple times (idempotent inserts).

-- 1) Subjects for Class 9 and 10 (general stream)
INSERT INTO public.subjects (name, class_level, stream, icon, color)
SELECT v.name, v.class_level, 'general'::public.school_stream, v.icon, v.color
FROM (
  VALUES
    ('Science', 9, 'BookOpen', '#10B981'),
    ('Mathematics', 9, 'Calculator', '#3B82F6'),
    ('English', 9, 'Languages', '#F59E0B'),
    ('Social Science', 9, 'Globe', '#8B5CF6'),
    ('Science', 10, 'BookOpen', '#10B981'),
    ('Mathematics', 10, 'Calculator', '#3B82F6'),
    ('English', 10, 'Languages', '#F59E0B'),
    ('Social Science', 10, 'Globe', '#8B5CF6')
) AS v(name, class_level, icon, color)
WHERE NOT EXISTS (
  SELECT 1
  FROM public.subjects s
  WHERE s.name = v.name
    AND s.class_level = v.class_level
    AND s.stream = 'general'::public.school_stream
);

-- 2) Chapters for those subjects
DO $$
DECLARE
  subj_id UUID;
BEGIN
  -- Class 9 Science
  SELECT id INTO subj_id
  FROM public.subjects
  WHERE name = 'Science' AND class_level = 9 AND stream = 'general'
  LIMIT 1;

  IF subj_id IS NOT NULL THEN
    INSERT INTO public.chapters (subject_id, name, chapter_number, summary, content)
    SELECT subj_id, c.name, c.chapter_number, c.summary, c.content
    FROM (
      VALUES
        ('Matter in Our Surroundings', 1, 'States and properties of matter.', 'NCERT Class 9 Science chapter on matter and particle behavior.'),
        ('Is Matter Around Us Pure', 2, 'Mixtures, solutions, and separation techniques.', 'NCERT Class 9 Science chapter on pure substances and mixtures.'),
        ('Atoms and Molecules', 3, 'Atomic mass, molecules, and chemical formulae.', 'NCERT Class 9 Science chapter introducing atomic theory and molecular concepts.')
    ) AS c(name, chapter_number, summary, content)
    WHERE NOT EXISTS (
      SELECT 1 FROM public.chapters ch
      WHERE ch.subject_id = subj_id AND ch.chapter_number = c.chapter_number
    );
  END IF;

  -- Class 9 Mathematics
  SELECT id INTO subj_id
  FROM public.subjects
  WHERE name = 'Mathematics' AND class_level = 9 AND stream = 'general'
  LIMIT 1;

  IF subj_id IS NOT NULL THEN
    INSERT INTO public.chapters (subject_id, name, chapter_number, summary, content)
    SELECT subj_id, c.name, c.chapter_number, c.summary, c.content
    FROM (
      VALUES
        ('Number Systems', 1, 'Irrational numbers and real numbers.', 'NCERT Class 9 Mathematics chapter on number systems.'),
        ('Polynomials', 2, 'Polynomial expressions and identities.', 'NCERT Class 9 Mathematics chapter on polynomials.'),
        ('Coordinate Geometry', 3, 'Cartesian plane and plotting points.', 'NCERT Class 9 Mathematics chapter on coordinate geometry basics.')
    ) AS c(name, chapter_number, summary, content)
    WHERE NOT EXISTS (
      SELECT 1 FROM public.chapters ch
      WHERE ch.subject_id = subj_id AND ch.chapter_number = c.chapter_number
    );
  END IF;

  -- Class 10 Science
  SELECT id INTO subj_id
  FROM public.subjects
  WHERE name = 'Science' AND class_level = 10 AND stream = 'general'
  LIMIT 1;

  IF subj_id IS NOT NULL THEN
    INSERT INTO public.chapters (subject_id, name, chapter_number, summary, content)
    SELECT subj_id, c.name, c.chapter_number, c.summary, c.content
    FROM (
      VALUES
        ('Chemical Reactions and Equations', 1, 'Types of reactions and balancing equations.', 'NCERT Class 10 Science chapter on chemical changes and equations.'),
        ('Acids, Bases and Salts', 2, 'Properties and reactions of acids, bases, and salts.', 'NCERT Class 10 Science chapter on pH and salt formation.'),
        ('Life Processes', 3, 'Nutrition, respiration, transportation, and excretion.', 'NCERT Class 10 Science chapter on basic life processes.')
    ) AS c(name, chapter_number, summary, content)
    WHERE NOT EXISTS (
      SELECT 1 FROM public.chapters ch
      WHERE ch.subject_id = subj_id AND ch.chapter_number = c.chapter_number
    );
  END IF;

  -- Class 10 Mathematics
  SELECT id INTO subj_id
  FROM public.subjects
  WHERE name = 'Mathematics' AND class_level = 10 AND stream = 'general'
  LIMIT 1;

  IF subj_id IS NOT NULL THEN
    INSERT INTO public.chapters (subject_id, name, chapter_number, summary, content)
    SELECT subj_id, c.name, c.chapter_number, c.summary, c.content
    FROM (
      VALUES
        ('Real Numbers', 1, 'Euclid division lemma and irrational numbers.', 'NCERT Class 10 Mathematics chapter on real numbers.'),
        ('Polynomials', 2, 'Zeroes and relationship with coefficients.', 'NCERT Class 10 Mathematics chapter on polynomial properties.'),
        ('Pair of Linear Equations in Two Variables', 3, 'Algebraic and graphical solutions.', 'NCERT Class 10 Mathematics chapter on solving linear equations.')
    ) AS c(name, chapter_number, summary, content)
    WHERE NOT EXISTS (
      SELECT 1 FROM public.chapters ch
      WHERE ch.subject_id = subj_id AND ch.chapter_number = c.chapter_number
    );
  END IF;

  -- Class 9 English
  SELECT id INTO subj_id
  FROM public.subjects
  WHERE name = 'English' AND class_level = 9 AND stream = 'general'
  LIMIT 1;

  IF subj_id IS NOT NULL THEN
    INSERT INTO public.chapters (subject_id, name, chapter_number, summary, content)
    SELECT subj_id, c.name, c.chapter_number, c.summary, c.content
    FROM (
      VALUES
        ('The Fun They Had', 1, 'A story about future schooling and technology.', 'NCERT Class 9 English chapter from Beehive.'),
        ('The Sound of Music', 2, 'Inspirational accounts of musicians.', 'NCERT Class 9 English prose chapter.'),
        ('The Little Girl', 3, 'A child''s changing perception of her father.', 'NCERT Class 9 English narrative chapter.')
    ) AS c(name, chapter_number, summary, content)
    WHERE NOT EXISTS (
      SELECT 1 FROM public.chapters ch
      WHERE ch.subject_id = subj_id AND ch.chapter_number = c.chapter_number
    );
  END IF;

  -- Class 10 English
  SELECT id INTO subj_id
  FROM public.subjects
  WHERE name = 'English' AND class_level = 10 AND stream = 'general'
  LIMIT 1;

  IF subj_id IS NOT NULL THEN
    INSERT INTO public.chapters (subject_id, name, chapter_number, summary, content)
    SELECT subj_id, c.name, c.chapter_number, c.summary, c.content
    FROM (
      VALUES
        ('A Letter to God', 1, 'A story of faith, irony, and human kindness.', 'NCERT Class 10 English chapter from First Flight.'),
        ('Nelson Mandela: Long Walk to Freedom', 2, 'An excerpt on freedom, leadership, and equality.', 'NCERT Class 10 English prose chapter.'),
        ('Two Stories About Flying', 3, 'Stories of courage and overcoming fear.', 'NCERT Class 10 English chapter.')
    ) AS c(name, chapter_number, summary, content)
    WHERE NOT EXISTS (
      SELECT 1 FROM public.chapters ch
      WHERE ch.subject_id = subj_id AND ch.chapter_number = c.chapter_number
    );
  END IF;

  -- Class 9 Social Science
  SELECT id INTO subj_id
  FROM public.subjects
  WHERE name = 'Social Science' AND class_level = 9 AND stream = 'general'
  LIMIT 1;

  IF subj_id IS NOT NULL THEN
    INSERT INTO public.chapters (subject_id, name, chapter_number, summary, content)
    SELECT subj_id, c.name, c.chapter_number, c.summary, c.content
    FROM (
      VALUES
        ('The French Revolution', 1, 'Causes, events, and outcomes of the French Revolution.', 'NCERT Class 9 History chapter.'),
        ('India - Size and Location', 2, 'Geographical extent and strategic location of India.', 'NCERT Class 9 Geography chapter.'),
        ('What is Democracy? Why Democracy?', 3, 'Core ideas and values of democratic governance.', 'NCERT Class 9 Civics chapter.')
    ) AS c(name, chapter_number, summary, content)
    WHERE NOT EXISTS (
      SELECT 1 FROM public.chapters ch
      WHERE ch.subject_id = subj_id AND ch.chapter_number = c.chapter_number
    );
  END IF;

  -- Class 10 Social Science
  SELECT id INTO subj_id
  FROM public.subjects
  WHERE name = 'Social Science' AND class_level = 10 AND stream = 'general'
  LIMIT 1;

  IF subj_id IS NOT NULL THEN
    INSERT INTO public.chapters (subject_id, name, chapter_number, summary, content)
    SELECT subj_id, c.name, c.chapter_number, c.summary, c.content
    FROM (
      VALUES
        ('The Rise of Nationalism in Europe', 1, 'Nationalism and nation-state formation in Europe.', 'NCERT Class 10 History chapter.'),
        ('Resources and Development', 2, 'Types, planning, and sustainable use of resources.', 'NCERT Class 10 Geography chapter.'),
        ('Power Sharing', 3, 'Forms and importance of power sharing in democracies.', 'NCERT Class 10 Civics chapter.')
    ) AS c(name, chapter_number, summary, content)
    WHERE NOT EXISTS (
      SELECT 1 FROM public.chapters ch
      WHERE ch.subject_id = subj_id AND ch.chapter_number = c.chapter_number
    );
  END IF;
END $$;

-- 3) Add PDF URLs for Class 9/10 subjects that have verified NCERT textbook links
UPDATE public.chapters
SET pdf_url = 'https://ncert.nic.in/textbook/pdf/iesc1dd.pdf'
WHERE subject_id IN (
  SELECT id FROM public.subjects
  WHERE name = 'Science' AND class_level = 9 AND stream = 'general'
);

UPDATE public.chapters
SET pdf_url = 'https://ncert.nic.in/textbook/pdf/iemh1dd.pdf'
WHERE subject_id IN (
  SELECT id FROM public.subjects
  WHERE name = 'Mathematics' AND class_level = 9 AND stream = 'general'
);

UPDATE public.chapters
SET pdf_url = 'https://ncert.nic.in/textbook/pdf/jesc1dd.pdf'
WHERE subject_id IN (
  SELECT id FROM public.subjects
  WHERE name = 'Science' AND class_level = 10 AND stream = 'general'
);

UPDATE public.chapters
SET pdf_url = 'https://ncert.nic.in/textbook/pdf/jemh1dd.pdf'
WHERE subject_id IN (
  SELECT id FROM public.subjects
  WHERE name = 'Mathematics' AND class_level = 10 AND stream = 'general'
);

-- 4) One starter quiz question per seeded chapter (enough to make quiz flow work)
DO $$
DECLARE
  ch RECORD;
  q_text TEXT;
BEGIN
  FOR ch IN
    SELECT c.id, c.name
    FROM public.chapters c
    JOIN public.subjects s ON s.id = c.subject_id
    WHERE s.class_level IN (9, 10)
      AND s.stream = 'general'
      AND c.chapter_number IN (1, 2, 3)
      AND s.name IN ('Science', 'Mathematics', 'English', 'Social Science')
  LOOP
    q_text := 'Quick check: ' || ch.name || ' - choose the correct option.';

    IF NOT EXISTS (
      SELECT 1 FROM public.quiz_questions qq
      WHERE qq.chapter_id = ch.id
        AND qq.question = q_text
    ) THEN
      INSERT INTO public.quiz_questions (chapter_id, question, options, correct_answer, explanation)
      VALUES (
        ch.id,
        q_text,
        '["Option A", "Option B", "Option C", "Option D"]'::jsonb,
        0,
        'Starter question added to enable quiz flow for this chapter.'
      );
    END IF;
  END LOOP;
END $$;
