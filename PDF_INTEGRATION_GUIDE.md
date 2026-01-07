# PDF Integration for Chapters (Classes 9-12)

## Overview
This update adds PDF viewing functionality to all chapter content in classes 9-12. PDFs open within the platform using a custom viewer component.

## What's New

### 1. Database Changes
- **Migration File**: `20260108000000_add_pdf_url_to_chapters.sql`
- Added `pdf_url` TEXT column to the `chapters` table
- Pre-populated sample NCERT PDF URLs for all subjects in classes 11-12

### 2. New Component
- **PDFViewer Component** (`src/components/school/PDFViewer.tsx`)
  - In-platform PDF viewing with iframe
  - Features:
    - Zoom controls (50% - 200%)
    - Fullscreen mode
    - Download option
    - Responsive design
    - Clean, modern UI

### 3. Updated Components
- **ChapterView Component** (`src/components/school/ChapterView.tsx`)
  - Added "View Chapter PDF" button when PDF is available
  - Shows "PDF Available" badge in chapter list
  - Integrated PDF viewer that opens without leaving the page

## Usage

### For Students
1. Navigate to any subject in classes 9-12
2. Click on a chapter
3. If a PDF is available, you'll see a "View Chapter PDF" button
4. Click to open the PDF viewer within the platform
5. Use zoom, fullscreen, and download controls as needed

### For Administrators/Developers

#### Adding PDF URLs to Chapters

**Option 1: Update via Migration (Recommended for bulk updates)**
```sql
UPDATE public.chapters 
SET pdf_url = 'https://your-cdn.com/path-to-pdf.pdf'
WHERE chapter_number = 1 
AND subject_id IN (SELECT id FROM public.subjects WHERE name = 'Physics' AND class_level = 11);
```

**Option 2: Update via Supabase Dashboard**
1. Go to Supabase Dashboard
2. Navigate to Table Editor > chapters
3. Find the chapter row
4. Add the PDF URL to the `pdf_url` column

**Option 3: Programmatic Update**
```typescript
const { error } = await supabase
  .from('chapters')
  .update({ pdf_url: 'https://example.com/chapter.pdf' })
  .eq('id', 'chapter-uuid-here');
```

## PDF URL Sources

### Current Sample URLs
The migration includes placeholder NCERT PDF URLs following this pattern:
- Class 11 Physics: `https://ncert.nic.in/textbook/pdf/keph1XX.pdf`
- Class 11 Chemistry: `https://ncert.nic.in/textbook/pdf/kech1XX.pdf`
- Class 11 Math: `https://ncert.nic.in/textbook/pdf/kemh1XX.pdf`
- Class 11 Biology: `https://ncert.nic.in/textbook/pdf/kebo1XX.pdf`
- Class 12 subjects follow similar pattern with `le` prefix

### Recommended PDF Hosting Options

1. **Cloud Storage (Recommended)**
   - AWS S3 with CloudFront CDN
   - Google Cloud Storage
   - Azure Blob Storage
   - Benefits: Fast, scalable, reliable

2. **Direct URLs**
   - Official NCERT website
   - Educational repositories
   - Ensure CORS is enabled for iframe viewing

3. **Self-Hosted**
   - Host PDFs in your `public/` folder
   - Use relative paths: `/pdfs/class-11/physics/chapter-1.pdf`
   - Add PDFs to your deployment

## Running the Migration

### Using Supabase CLI
```bash
# Make sure you're in the project directory
cd studixa-main_old

# Run the migration
npx supabase db push

# Or if using migration files
npx supabase migration up
```

### Using Supabase Dashboard
1. Go to SQL Editor
2. Copy contents of `20260108000000_add_pdf_url_to_chapters.sql`
3. Run the SQL query

## Important Notes

### CORS Requirements
For PDFs to display in iframe, the hosting server must:
- Allow iframe embedding
- Set proper CORS headers:
  ```
  Access-Control-Allow-Origin: *
  X-Frame-Options: SAMEORIGIN or ALLOWALL
  ```

### Browser Compatibility
- Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers will use native PDF viewers
- Fallback to download if iframe fails

### Performance Considerations
- Large PDFs may take time to load
- Consider using compressed/optimized PDFs
- CDN hosting recommended for better performance

## File Structure
```
src/
├── components/
│   └── school/
│       ├── ChapterView.tsx       (Updated)
│       └── PDFViewer.tsx          (New)
supabase/
└── migrations/
    └── 20260108000000_add_pdf_url_to_chapters.sql  (New)
```

## Troubleshooting

### PDF Not Displaying
1. Check if `pdf_url` is set in database
2. Verify PDF URL is accessible (try opening in new tab)
3. Check browser console for CORS errors
4. Ensure PDF is a valid PDF file

### Download Not Working
- Browser may block popup - check popup blocker settings
- Try right-click > Save As on the PDF

### Zoom Not Working Properly
- This is a known limitation with iframe scaling
- Users can use browser's built-in PDF controls

## Future Enhancements
- [ ] Add PDF.js for better rendering control
- [ ] Page navigation controls
- [ ] Bookmark specific pages
- [ ] Highlight and annotation support
- [ ] Offline PDF caching
- [ ] Progress tracking (pages read)

## Support
For issues or questions, please check:
1. Browser console for errors
2. Network tab for failed requests
3. Database for missing PDF URLs
