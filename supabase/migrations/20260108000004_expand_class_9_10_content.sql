-- Expand Class 9/10 data to match the richer Class 11/12 experience.
-- Idempotent: safe to run multiple times.

-- 1) Ensure Class 9/10 subjects exist (general stream)
INSERT INTO public.subjects (name, class_level, stream, icon, color)
SELECT v.name, v.class_level, 'general'::public.school_stream, v.icon, v.color
FROM (
  VALUES
    ('Science', 9, 'FlaskConical', 'green'),
    ('Mathematics', 9, 'Calculator', 'blue'),
    ('English', 9, 'BookOpen', 'orange'),
    ('Social Science', 9, 'Globe', 'purple'),
    ('Science', 10, 'FlaskConical', 'green'),
    ('Mathematics', 10, 'Calculator', 'blue'),
    ('English', 10, 'BookOpen', 'orange'),
    ('Social Science', 10, 'Globe', 'purple')
) AS v(name, class_level, icon, color)
WHERE NOT EXISTS (
  SELECT 1
  FROM public.subjects s
  WHERE s.name = v.name
    AND s.class_level = v.class_level
    AND s.stream = 'general'::public.school_stream
);

-- 2) Add richer chapter coverage for Class 9/10
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
        ('Matter in Our Surroundings', 1, 'States and particle nature of matter.', 'NCERT Class 9 Science chapter on particle model of matter.'),
        ('Is Matter Around Us Pure', 2, 'Mixtures, solutions, and separation methods.', 'NCERT Class 9 Science chapter on pure substances and mixtures.'),
        ('Atoms and Molecules', 3, 'Atomic mass, molecules, and formula writing.', 'NCERT Class 9 Science chapter introducing atoms and molecules.'),
        ('Structure of the Atom', 4, 'Electronic configuration and valency basics.', 'NCERT Class 9 Science chapter on structure of atom.'),
        ('The Fundamental Unit of Life', 5, 'Cell structure, organelles, and function.', 'NCERT Class 9 Science chapter on cells and life basics.'),
        ('Tissues', 6, 'Plant and animal tissues and their roles.', 'NCERT Class 9 Science chapter on tissues.'),
        ('Motion', 7, 'Distance, displacement, speed, velocity, acceleration.', 'NCERT Class 9 Physics chapter on motion.'),
        ('Force and Laws of Motion', 8, 'Newton laws and momentum concepts.', 'NCERT Class 9 Physics chapter on force and motion laws.'),
        ('Gravitation', 9, 'Universal gravitation and pressure in fluids.', 'NCERT Class 9 Physics chapter on gravitation.'),
        ('Work and Energy', 10, 'Work, kinetic energy, potential energy, power.', 'NCERT Class 9 Physics chapter on work and energy.')
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
        ('Number Systems', 1, 'Rational and irrational numbers in the real number system.', 'NCERT Class 9 Mathematics chapter on number systems.'),
        ('Polynomials', 2, 'Polynomial expressions and algebraic identities.', 'NCERT Class 9 Mathematics chapter on polynomials.'),
        ('Coordinate Geometry', 3, 'Cartesian plane and coordinate plotting.', 'NCERT Class 9 Mathematics chapter on coordinate geometry.'),
        ('Linear Equations in Two Variables', 4, 'Graphical representation of linear equations.', 'NCERT Class 9 Mathematics chapter on linear equations.'),
        ('Introduction to Euclid Geometry', 5, 'Basic definitions and Euclid postulates.', 'NCERT Class 9 Mathematics chapter on Euclidean geometry.'),
        ('Lines and Angles', 6, 'Angle relationships and parallel lines.', 'NCERT Class 9 Mathematics chapter on lines and angles.'),
        ('Triangles', 7, 'Congruence criteria and triangle properties.', 'NCERT Class 9 Mathematics chapter on triangles.'),
        ('Quadrilaterals', 8, 'Properties of quadrilaterals and parallelograms.', 'NCERT Class 9 Mathematics chapter on quadrilaterals.'),
        ('Circles', 9, 'Circle terminology and geometric properties.', 'NCERT Class 9 Mathematics chapter on circles.'),
        ('Herons Formula', 10, 'Area of triangles using Herons formula.', 'NCERT Class 9 Mathematics chapter on Herons formula.')
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
        ('The Fun They Had', 1, 'A story about schooling in the future.', 'NCERT Class 9 English chapter from Beehive.'),
        ('The Sound of Music', 2, 'Stories of determination in music.', 'NCERT Class 9 English prose chapter.'),
        ('The Little Girl', 3, 'A childs perspective on discipline and affection.', 'NCERT Class 9 English chapter.'),
        ('A Truly Beautiful Mind', 4, 'Einsteins life and values.', 'NCERT Class 9 English chapter on Albert Einstein.'),
        ('The Snake and the Mirror', 5, 'A humorous story with life lesson.', 'NCERT Class 9 English story chapter.')
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
        ('The French Revolution', 1, 'Major events and outcomes of the French Revolution.', 'NCERT Class 9 History chapter.'),
        ('Socialism in Europe and the Russian Revolution', 2, 'Rise of socialism and Russian Revolution timeline.', 'NCERT Class 9 History chapter.'),
        ('India - Size and Location', 3, 'Location and strategic significance of India.', 'NCERT Class 9 Geography chapter.'),
        ('Physical Features of India', 4, 'Himalayas, plains, plateaus, and coastal regions.', 'NCERT Class 9 Geography chapter.'),
        ('What is Democracy? Why Democracy?', 5, 'Core principles and value of democracy.', 'NCERT Class 9 Civics chapter.')
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
        ('Chemical Reactions and Equations', 1, 'Balancing and classifying chemical reactions.', 'NCERT Class 10 Science chapter on chemical reactions.'),
        ('Acids, Bases and Salts', 2, 'pH scale and reaction behavior of acids and bases.', 'NCERT Class 10 Science chapter on acids and bases.'),
        ('Metals and Non-metals', 3, 'Properties, reactivity, and metallurgy basics.', 'NCERT Class 10 Science chapter on metals and non-metals.'),
        ('Carbon and Its Compounds', 4, 'Covalent bonding, hydrocarbons, and homologous series.', 'NCERT Class 10 Science chapter on carbon compounds.'),
        ('Life Processes', 5, 'Nutrition, respiration, transportation, and excretion.', 'NCERT Class 10 Biology chapter on life processes.'),
        ('Control and Coordination', 6, 'Nervous system and hormonal coordination.', 'NCERT Class 10 Biology chapter on control and coordination.'),
        ('How do Organisms Reproduce?', 7, 'Asexual and sexual reproduction in organisms.', 'NCERT Class 10 Biology chapter on reproduction.'),
        ('Light - Reflection and Refraction', 8, 'Image formation by mirrors and lenses.', 'NCERT Class 10 Physics chapter on light.'),
        ('The Human Eye and the Colourful World', 9, 'Eye defects and atmospheric optical phenomena.', 'NCERT Class 10 Physics chapter on human eye and color.'),
        ('Electricity', 10, 'Current, potential difference, resistance, and circuits.', 'NCERT Class 10 Physics chapter on electricity.')
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
        ('Real Numbers', 1, 'Euclids division lemma and irrationality proofs.', 'NCERT Class 10 Mathematics chapter on real numbers.'),
        ('Polynomials', 2, 'Zeros and relations with coefficients.', 'NCERT Class 10 Mathematics chapter on polynomials.'),
        ('Pair of Linear Equations in Two Variables', 3, 'Graphical and algebraic methods of solving.', 'NCERT Class 10 Mathematics chapter on linear equations.'),
        ('Quadratic Equations', 4, 'Factorization and quadratic formula methods.', 'NCERT Class 10 Mathematics chapter on quadratic equations.'),
        ('Arithmetic Progressions', 5, 'nth term and sum formulas for AP.', 'NCERT Class 10 Mathematics chapter on arithmetic progressions.'),
        ('Triangles', 6, 'Similarity and proportionality theorems.', 'NCERT Class 10 Mathematics chapter on triangles.'),
        ('Coordinate Geometry', 7, 'Distance, section formula, and area of triangle.', 'NCERT Class 10 Mathematics chapter on coordinate geometry.'),
        ('Introduction to Trigonometry', 8, 'Trigonometric ratios and identities basics.', 'NCERT Class 10 Mathematics chapter on trigonometry.'),
        ('Applications of Trigonometry', 9, 'Heights and distances problems.', 'NCERT Class 10 Mathematics chapter on trigonometry applications.'),
        ('Circles', 10, 'Tangents and properties of circles.', 'NCERT Class 10 Mathematics chapter on circles.')
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
        ('A Letter to God', 1, 'Faith, irony, and empathy in a short narrative.', 'NCERT Class 10 English chapter from First Flight.'),
        ('Nelson Mandela: Long Walk to Freedom', 2, 'Freedom struggle and democratic values.', 'NCERT Class 10 English chapter.'),
        ('Two Stories About Flying', 3, 'Fear, courage, and confidence through stories.', 'NCERT Class 10 English chapter.'),
        ('From the Diary of Anne Frank', 4, 'Personal writing and historical context.', 'NCERT Class 10 English chapter on diary writing.'),
        ('The Hundred Dresses - I', 5, 'Empathy, bullying, and social sensitivity.', 'NCERT Class 10 English chapter.')
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
        ('The Rise of Nationalism in Europe', 1, 'Nationalism and modern nation-state emergence.', 'NCERT Class 10 History chapter.'),
        ('Nationalism in India', 2, 'Indian national movement and mass participation.', 'NCERT Class 10 History chapter.'),
        ('Resources and Development', 3, 'Resource planning and sustainable development.', 'NCERT Class 10 Geography chapter.'),
        ('Forest and Wildlife Resources', 4, 'Conservation and biodiversity management.', 'NCERT Class 10 Geography chapter.'),
        ('Power Sharing', 5, 'Forms and importance of power sharing.', 'NCERT Class 10 Civics chapter.')
    ) AS c(name, chapter_number, summary, content)
    WHERE NOT EXISTS (
      SELECT 1 FROM public.chapters ch
      WHERE ch.subject_id = subj_id AND ch.chapter_number = c.chapter_number
    );
  END IF;
END $$;

-- 3) Attach Class 9/10 NCERT PDF URLs (available official links)
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

-- 4) Seed quiz questions for all Class 9/10 chapters to ensure full-class quiz works.
-- Generates two deterministic questions per chapter if absent.
DO $$
DECLARE
  ch RECORD;
  q1 TEXT;
  q2 TEXT;
BEGIN
  FOR ch IN
    SELECT c.id, c.name, s.name AS subject_name, s.class_level
    FROM public.chapters c
    JOIN public.subjects s ON s.id = c.subject_id
    WHERE s.class_level IN (9, 10)
      AND s.stream = 'general'
  LOOP
    q1 := 'Class ' || ch.class_level || ' ' || ch.subject_name || ': Core idea in ' || ch.name || ' is best described as?';
    q2 := 'Class ' || ch.class_level || ' ' || ch.subject_name || ': Which study action helps most for chapter ' || ch.name || '?';

    IF NOT EXISTS (
      SELECT 1 FROM public.quiz_questions qq
      WHERE qq.chapter_id = ch.id AND qq.question = q1
    ) THEN
      INSERT INTO public.quiz_questions (chapter_id, question, options, correct_answer, explanation)
      VALUES (
        ch.id,
        q1,
        '["Understand the main concept and definitions", "Memorize random facts only", "Skip examples", "Ignore key terms"]'::jsonb,
        0,
        'Always start with conceptual clarity, then practice questions from NCERT examples and exercises.'
      );
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM public.quiz_questions qq
      WHERE qq.chapter_id = ch.id AND qq.question = q2
    ) THEN
      INSERT INTO public.quiz_questions (chapter_id, question, options, correct_answer, explanation)
      VALUES (
        ch.id,
        q2,
        '["Read summary, solve NCERT exercise, revise mistakes", "Only read one page", "Watch without notes", "Skip revision"]'::jsonb,
        0,
        'Best results come from read-practice-review cycle with error correction.'
      );
    END IF;
  END LOOP;
END $$;
