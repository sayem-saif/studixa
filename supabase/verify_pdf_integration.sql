-- Verification Script for PDF Integration
-- Run this in Supabase SQL Editor to verify the PDF setup

-- 1. Check if pdf_url column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'chapters' AND column_name = 'pdf_url';

-- 2. Count chapters with PDFs
SELECT 
  'Total chapters' as category,
  COUNT(*) as count
FROM public.chapters
UNION ALL
SELECT 
  'Chapters with PDFs' as category,
  COUNT(*) as count
FROM public.chapters
WHERE pdf_url IS NOT NULL
UNION ALL
SELECT 
  'Chapters without PDFs' as category,
  COUNT(*) as count
FROM public.chapters
WHERE pdf_url IS NULL;

-- 3. PDF status by class level
SELECT 
  s.class_level,
  COUNT(*) as total_chapters,
  COUNT(c.pdf_url) as chapters_with_pdf,
  ROUND(COUNT(c.pdf_url)::numeric / COUNT(*)::numeric * 100, 2) as pdf_coverage_percentage
FROM public.chapters c
JOIN public.subjects s ON c.subject_id = s.id
WHERE s.class_level IN (9, 10, 11, 12)
GROUP BY s.class_level
ORDER BY s.class_level;

-- 4. PDF status by subject
SELECT 
  s.name as subject_name,
  s.class_level,
  s.stream,
  COUNT(*) as total_chapters,
  COUNT(c.pdf_url) as chapters_with_pdf
FROM public.chapters c
JOIN public.subjects s ON c.subject_id = s.id
WHERE s.class_level IN (9, 10, 11, 12)
GROUP BY s.name, s.class_level, s.stream
ORDER BY s.class_level, s.name;

-- 5. Sample PDFs (First 10)
SELECT 
  s.class_level,
  s.name as subject,
  c.chapter_number,
  c.name as chapter_name,
  CASE 
    WHEN c.pdf_url IS NOT NULL THEN '✓ Available'
    ELSE '✗ Missing'
  END as pdf_status,
  c.pdf_url
FROM public.chapters c
JOIN public.subjects s ON c.subject_id = s.id
WHERE s.class_level IN (9, 10, 11, 12)
ORDER BY s.class_level, s.name, c.chapter_number
LIMIT 10;

-- 6. Find broken or invalid PDF URLs (basic check)
SELECT 
  s.class_level,
  s.name as subject,
  c.chapter_number,
  c.name as chapter_name,
  c.pdf_url
FROM public.chapters c
JOIN public.subjects s ON c.subject_id = s.id
WHERE c.pdf_url IS NOT NULL
  AND (
    c.pdf_url NOT LIKE 'http%'  -- Must start with http/https
    OR LENGTH(c.pdf_url) < 10    -- Too short to be valid URL
  )
ORDER BY s.class_level, s.name, c.chapter_number;

-- 7. List all unique PDF domains being used
SELECT 
  SUBSTRING(pdf_url FROM 'https?://([^/]+)') as domain,
  COUNT(*) as usage_count
FROM public.chapters
WHERE pdf_url IS NOT NULL
GROUP BY domain
ORDER BY usage_count DESC;
