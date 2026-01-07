# Quick Guide: Adding PDFs to Your Chapters

## Step-by-Step Instructions

### Step 1: Run the Migration
First, apply the database migration to add the `pdf_url` column:

```bash
# Navigate to your project directory
cd studixa-main_old

# Run the migration using Supabase CLI
npx supabase db push
```

Or manually in Supabase Dashboard:
1. Go to SQL Editor
2. Open `supabase/migrations/20260108000000_add_pdf_url_to_chapters.sql`
3. Copy and run the SQL

### Step 2: Prepare Your PDFs

#### Option A: Use NCERT PDFs (Already Configured)
The migration includes NCERT PDF URLs. These should work out of the box!

#### Option B: Host Your Own PDFs

**Using Public Folder (Simple, for testing)**
```bash
# Create PDF directory
mkdir -p public/pdfs/class-9
mkdir -p public/pdfs/class-10
mkdir -p public/pdfs/class-11
mkdir -p public/pdfs/class-12

# Add your PDF files
# Then update URLs to: /pdfs/class-11/physics-ch1.pdf
```

**Using Cloud Storage (Recommended for production)**
1. Upload PDFs to AWS S3, Google Cloud, or similar
2. Get public URLs for each PDF
3. Update database with these URLs

### Step 3: Update Chapter PDFs

#### For a Single Chapter
```sql
-- Replace 'CHAPTER_ID' with actual chapter UUID from your database
UPDATE public.chapters 
SET pdf_url = 'https://your-cdn.com/your-chapter.pdf'
WHERE id = 'CHAPTER_ID';
```

#### For All Chapters of a Subject
```sql
-- Example: Update all Class 11 Physics chapters
UPDATE public.chapters 
SET pdf_url = CONCAT('https://your-cdn.com/class-11-physics-ch', chapter_number, '.pdf')
WHERE subject_id IN (
  SELECT id FROM public.subjects 
  WHERE name = 'Physics' AND class_level = 11
);
```

#### Bulk Update Multiple Chapters
```sql
-- Update specific chapters by name
UPDATE public.chapters 
SET pdf_url = 'https://cdn.example.com/physics-motion.pdf'
WHERE name = 'Motion in a Straight Line';

UPDATE public.chapters 
SET pdf_url = 'https://cdn.example.com/physics-forces.pdf'
WHERE name = 'Laws of Motion';
```

### Step 4: Test the Feature

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Log in to your application

3. Navigate to: Dashboard → Select Class (9-12) → Choose Subject → Open Chapter

4. Look for:
   - "PDF Available" badge in chapter list
   - "View Chapter PDF" button when chapter is open

5. Click the button and verify:
   - PDF opens in the viewer
   - Zoom controls work
   - Fullscreen toggle works
   - Download option works

### Step 5: Verify Database Updates

Check your updates in Supabase Dashboard:
1. Go to Table Editor
2. Select `chapters` table
3. Look for the `pdf_url` column
4. Verify URLs are correctly set

## Example: Complete Setup for Class 11 Physics

```sql
-- First, get the subject_id
SELECT id, name FROM public.subjects 
WHERE name = 'Physics' AND class_level = 11 AND stream = 'pcm';
-- Let's say the ID is: 'abc123-...'

-- Update PDFs for all chapters
UPDATE public.chapters SET pdf_url = 'https://ncert.nic.in/textbook/pdf/keph101.pdf' WHERE subject_id = 'abc123-...' AND chapter_number = 1;
UPDATE public.chapters SET pdf_url = 'https://ncert.nic.in/textbook/pdf/keph102.pdf' WHERE subject_id = 'abc123-...' AND chapter_number = 2;
UPDATE public.chapters SET pdf_url = 'https://ncert.nic.in/textbook/pdf/keph103.pdf' WHERE subject_id = 'abc123-...' AND chapter_number = 3;
-- ... continue for all chapters
```

## Common PDF Sources

### Free Educational Resources
1. **NCERT**: https://ncert.nic.in/textbook.php
2. **NROER**: https://nroer.gov.in/
3. **CK-12**: https://www.ck12.org/

### Self-Hosting Options
1. **GitHub Pages** (Free)
   - Upload PDFs to a public GitHub repo
   - Enable GitHub Pages
   - Use: `https://username.github.io/repo/pdf/chapter1.pdf`

2. **Cloudflare R2** (Affordable)
   - S3-compatible storage
   - No egress fees
   - Good for serving PDFs

3. **Firebase Storage** (Free tier available)
   - Google Cloud integration
   - Easy to set up

## Troubleshooting

### PDFs Not Loading
```sql
-- Check if PDF URLs are set
SELECT id, name, pdf_url 
FROM public.chapters 
WHERE subject_id IN (
  SELECT id FROM public.subjects WHERE class_level >= 9
)
ORDER BY class_level, chapter_number;
```

### Reset PDF URLs
```sql
-- Remove all PDF URLs (if you need to start over)
UPDATE public.chapters SET pdf_url = NULL;
```

### Check Specific Subject
```sql
-- View all chapters for a specific subject
SELECT c.chapter_number, c.name, c.pdf_url, s.name as subject, s.class_level
FROM public.chapters c
JOIN public.subjects s ON c.subject_id = s.id
WHERE s.name = 'Physics' AND s.class_level = 11
ORDER BY c.chapter_number;
```

## Production Checklist

Before deploying to production:

- [ ] All PDFs are uploaded to reliable hosting
- [ ] PDF URLs are publicly accessible
- [ ] CORS headers are properly configured
- [ ] PDFs are optimized for web viewing
- [ ] All chapters have valid PDF URLs
- [ ] Test on multiple devices/browsers
- [ ] Verify download functionality
- [ ] Check mobile responsiveness

## Need Help?

Check these files for more details:
- `PDF_INTEGRATION_GUIDE.md` - Full documentation
- `src/components/school/PDFViewer.tsx` - PDF viewer component
- `src/components/school/ChapterView.tsx` - Integration example
- `supabase/migrations/20260108000000_add_pdf_url_to_chapters.sql` - Database schema

Happy teaching! 📚
