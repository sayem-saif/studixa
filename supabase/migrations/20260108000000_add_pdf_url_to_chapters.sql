-- Add pdf_url column to chapters table
ALTER TABLE public.chapters ADD COLUMN pdf_url TEXT;

-- Add NCERT PDF URLs from official NCERT website
-- URLs use the pattern: https://ncert.nic.in/textbook/pdf/[code][chapter].pdf
-- Codes: Class 11 (ke-prefix), Class 12 (le-prefix), Class 9 (ie-prefix), Class 10 (je-prefix)
-- Note: NCERT provides complete book PDFs, not individual chapter PDFs
-- We're linking to the complete book for each subject - students will need to navigate to specific chapters

-- Class 11 Physics (Complete Book PDF for all chapters)
-- Book: Physics Part I (Chapters 1-8) - https://ncert.nic.in/textbook/pdf/keph1dd.pdf
-- Book: Physics Part II (Chapters 9-15) - https://ncert.nic.in/textbook/pdf/keph2dd.pdf
UPDATE public.chapters 
SET pdf_url = 'https://ncert.nic.in/textbook/pdf/keph1dd.pdf'
WHERE chapter_number BETWEEN 1 AND 8
AND subject_id IN (SELECT id FROM public.subjects WHERE name = 'Physics' AND class_level = 11);

UPDATE public.chapters 
SET pdf_url = 'https://ncert.nic.in/textbook/pdf/keph2dd.pdf'
WHERE chapter_number > 8
AND subject_id IN (SELECT id FROM public.subjects WHERE name = 'Physics' AND class_level = 11);

-- Class 11 Chemistry (Complete Book PDF for all chapters)
-- Book: Chemistry Part I (Chapters 1-7) - https://ncert.nic.in/textbook/pdf/kech1dd.pdf
-- Book: Chemistry Part II (Chapters 8-14) - https://ncert.nic.in/textbook/pdf/kech2dd.pdf
UPDATE public.chapters 
SET pdf_url = 'https://ncert.nic.in/textbook/pdf/kech1dd.pdf'
WHERE chapter_number BETWEEN 1 AND 7
AND subject_id IN (SELECT id FROM public.subjects WHERE name = 'Chemistry' AND class_level = 11);

UPDATE public.chapters 
SET pdf_url = 'https://ncert.nic.in/textbook/pdf/kech2dd.pdf'
WHERE chapter_number > 7
AND subject_id IN (SELECT id FROM public.subjects WHERE name = 'Chemistry' AND class_level = 11);

-- Class 11 Mathematics (Complete Book PDF for all chapters)
-- Book: Mathematics - https://ncert.nic.in/textbook/pdf/kemh1dd.pdf
UPDATE public.chapters 
SET pdf_url = 'https://ncert.nic.in/textbook/pdf/kemh1dd.pdf'
WHERE subject_id IN (SELECT id FROM public.subjects WHERE name = 'Mathematics' AND class_level = 11);

-- Class 11 Biology (Complete Book PDF for all chapters)
-- Book: Biology - https://ncert.nic.in/textbook/pdf/kebo1dd.pdf
UPDATE public.chapters 
SET pdf_url = 'https://ncert.nic.in/textbook/pdf/kebo1dd.pdf'
WHERE subject_id IN (SELECT id FROM public.subjects WHERE name = 'Biology' AND class_level = 11);

-- Class 12 Physics (Complete Book PDF for all chapters)
-- Book: Physics Part I (Chapters 1-8) - https://ncert.nic.in/textbook/pdf/leph1dd.pdf
-- Book: Physics Part II (Chapters 9-15) - https://ncert.nic.in/textbook/pdf/leph2dd.pdf
UPDATE public.chapters 
SET pdf_url = 'https://ncert.nic.in/textbook/pdf/leph1dd.pdf'
WHERE chapter_number BETWEEN 1 AND 8
AND subject_id IN (SELECT id FROM public.subjects WHERE name = 'Physics' AND class_level = 12);

UPDATE public.chapters 
SET pdf_url = 'https://ncert.nic.in/textbook/pdf/leph2dd.pdf'
WHERE chapter_number > 8
AND subject_id IN (SELECT id FROM public.subjects WHERE name = 'Physics' AND class_level = 12);

-- Class 12 Chemistry (Complete Book PDF for all chapters)
-- Book: Chemistry Part I (Chapters 1-8) - https://ncert.nic.in/textbook/pdf/lech1dd.pdf
-- Book: Chemistry Part II (Chapters 9-16) - https://ncert.nic.in/textbook/pdf/lech2dd.pdf
UPDATE public.chapters 
SET pdf_url = 'https://ncert.nic.in/textbook/pdf/lech1dd.pdf'
WHERE chapter_number BETWEEN 1 AND 8
AND subject_id IN (SELECT id FROM public.subjects WHERE name = 'Chemistry' AND class_level = 12);

UPDATE public.chapters 
SET pdf_url = 'https://ncert.nic.in/textbook/pdf/lech2dd.pdf'
WHERE chapter_number > 8
AND subject_id IN (SELECT id FROM public.subjects WHERE name = 'Chemistry' AND class_level = 12);

-- Class 12 Mathematics (Complete Book PDF for all chapters)
-- Book: Mathematics Part I (Chapters 1-6) - https://ncert.nic.in/textbook/pdf/lemh1dd.pdf
-- Book: Mathematics Part II (Chapters 7-13) - https://ncert.nic.in/textbook/pdf/lemh2dd.pdf
UPDATE public.chapters 
SET pdf_url = 'https://ncert.nic.in/textbook/pdf/lemh1dd.pdf'
WHERE chapter_number BETWEEN 1 AND 6
AND subject_id IN (SELECT id FROM public.subjects WHERE name = 'Mathematics' AND class_level = 12);

UPDATE public.chapters 
SET pdf_url = 'https://ncert.nic.in/textbook/pdf/lemh2dd.pdf'
WHERE chapter_number > 6
AND subject_id IN (SELECT id FROM public.subjects WHERE name = 'Mathematics' AND class_level = 12);

-- Class 12 Biology (Complete Book PDF for all chapters)
-- Book: Biology - https://ncert.nic.in/textbook/pdf/lebo1dd.pdf
UPDATE public.chapters 
SET pdf_url = 'https://ncert.nic.in/textbook/pdf/lebo1dd.pdf'
WHERE subject_id IN (SELECT id FROM public.subjects WHERE name = 'Biology' AND class_level = 12);

-- Class 9 PDFs (NCERT provides complete book PDFs)
-- Science: https://ncert.nic.in/textbook/pdf/iesc1dd.pdf
UPDATE public.chapters 
SET pdf_url = 'https://ncert.nic.in/textbook/pdf/iesc1dd.pdf'
WHERE subject_id IN (SELECT id FROM public.subjects WHERE name = 'Science' AND class_level = 9);

-- Mathematics: https://ncert.nic.in/textbook/pdf/iemh1dd.pdf
UPDATE public.chapters 
SET pdf_url = 'https://ncert.nic.in/textbook/pdf/iemh1dd.pdf'
WHERE subject_id IN (SELECT id FROM public.subjects WHERE name = 'Mathematics' AND class_level = 9);

-- Class 10 PDFs (NCERT provides complete book PDFs)
-- Science: https://ncert.nic.in/textbook/pdf/jesc1dd.pdf
UPDATE public.chapters 
SET pdf_url = 'https://ncert.nic.in/textbook/pdf/jesc1dd.pdf'
WHERE subject_id IN (SELECT id FROM public.subjects WHERE name = 'Science' AND class_level = 10);

-- Mathematics: https://ncert.nic.in/textbook/pdf/jemh1dd.pdf
UPDATE public.chapters 
SET pdf_url = 'https://ncert.nic.in/textbook/pdf/jemh1dd.pdf'
WHERE subject_id IN (SELECT id FROM public.subjects WHERE name = 'Mathematics' AND class_level = 10);
