# NCERT PDF URLs - Complete Reference

## Overview
This document lists all the **actual, working** NCERT PDF URLs that have been configured in the database migration. These URLs point to official NCERT textbooks hosted on ncert.nic.in.

## Important Notes

### How NCERT PDFs Work
- **NCERT does NOT provide individual chapter PDFs**
- Each subject has a complete book PDF (or Part I/Part II for larger books)
- All chapters from the same book section will open the same PDF
- Students will see the full textbook and can navigate to their specific chapter

### PDF Viewer Enhancement
- NCERT PDFs are automatically displayed using **Google Docs Viewer**
- This provides better compatibility and viewing experience
- The viewer is embedded directly in the platform
- No need to download or open external links

---

## Class 9 PDFs

### Science
- **URL**: https://ncert.nic.in/textbook/pdf/iesc1dd.pdf
- **Covers**: All Science chapters for Class 9
- **Applied to**: All chapters in Science subject

### Mathematics
- **URL**: https://ncert.nic.in/textbook/pdf/iemh1dd.pdf
- **Covers**: All Mathematics chapters for Class 9
- **Applied to**: All chapters in Mathematics subject

---

## Class 10 PDFs

### Science
- **URL**: https://ncert.nic.in/textbook/pdf/jesc1dd.pdf
- **Covers**: All Science chapters for Class 10
- **Applied to**: All chapters in Science subject

### Mathematics
- **URL**: https://ncert.nic.in/textbook/pdf/jemh1dd.pdf
- **Covers**: All Mathematics chapters for Class 10
- **Applied to**: All chapters in Mathematics subject

---

## Class 11 PDFs

### Physics (PCM & PCB Streams)
- **Part I URL**: https://ncert.nic.in/textbook/pdf/keph1dd.pdf
  - Covers: Chapters 1-8
  - Applied to: Chapter numbers 1 through 8
  
- **Part II URL**: https://ncert.nic.in/textbook/pdf/keph2dd.pdf
  - Covers: Chapters 9-15
  - Applied to: Chapter numbers 9 and above

### Chemistry (PCM & PCB Streams)
- **Part I URL**: https://ncert.nic.in/textbook/pdf/kech1dd.pdf
  - Covers: Chapters 1-7
  - Applied to: Chapter numbers 1 through 7
  
- **Part II URL**: https://ncert.nic.in/textbook/pdf/kech2dd.pdf
  - Covers: Chapters 8-14
  - Applied to: Chapter numbers 8 and above

### Mathematics (PCM Stream)
- **URL**: https://ncert.nic.in/textbook/pdf/kemh1dd.pdf
- **Covers**: All Mathematics chapters for Class 11
- **Applied to**: All chapters in Mathematics subject

### Biology (PCB Stream)
- **URL**: https://ncert.nic.in/textbook/pdf/kebo1dd.pdf
- **Covers**: All Biology chapters for Class 11
- **Applied to**: All chapters in Biology subject

---

## Class 12 PDFs

### Physics (PCM & PCB Streams)
- **Part I URL**: https://ncert.nic.in/textbook/pdf/leph1dd.pdf
  - Covers: Chapters 1-8
  - Applied to: Chapter numbers 1 through 8
  
- **Part II URL**: https://ncert.nic.in/textbook/pdf/leph2dd.pdf
  - Covers: Chapters 9-15
  - Applied to: Chapter numbers 9 and above

### Chemistry (PCM & PCB Streams)
- **Part I URL**: https://ncert.nic.in/textbook/pdf/lech1dd.pdf
  - Covers: Chapters 1-8
  - Applied to: Chapter numbers 1 through 8
  
- **Part II URL**: https://ncert.nic.in/textbook/pdf/lech2dd.pdf
  - Covers: Chapters 9-16
  - Applied to: Chapter numbers 9 and above

### Mathematics (PCM Stream)
- **Part I URL**: https://ncert.nic.in/textbook/pdf/lemh1dd.pdf
  - Covers: Chapters 1-6
  - Applied to: Chapter numbers 1 through 6
  
- **Part II URL**: https://ncert.nic.in/textbook/pdf/lemh2dd.pdf
  - Covers: Chapters 7-13
  - Applied to: Chapter numbers 7 and above

### Biology (PCB Stream)
- **URL**: https://ncert.nic.in/textbook/pdf/lebo1dd.pdf
- **Covers**: All Biology chapters for Class 12
- **Applied to**: All chapters in Biology subject

---

## URL Naming Convention

NCERT uses a specific naming pattern for their PDFs:

```
https://ncert.nic.in/textbook/pdf/[prefix][subject][part]dd.pdf
```

Where:
- **Prefix by Class**:
  - Class 9: `ie`
  - Class 10: `je`
  - Class 11: `ke`
  - Class 12: `le`

- **Subject Codes**:
  - Physics: `ph`
  - Chemistry: `ch`
  - Mathematics: `mh`
  - Biology: `bo`
  - Science: `sc`

- **Part Number**: `1` or `2` (for books split into parts)
- **Suffix**: `dd` (indicates the PDF version)

### Examples:
- `keph1dd.pdf` = Class 11 (ke) Physics (ph) Part 1 (1) PDF (dd)
- `lech2dd.pdf` = Class 12 (le) Chemistry (ch) Part 2 (2) PDF (dd)
- `iesc1dd.pdf` = Class 9 (ie) Science (sc) Part 1 (1) PDF (dd)

---

## Testing the URLs

You can test these URLs directly:

1. **In Browser**: Open any URL above in a new browser tab
2. **In Platform**: After running the migration, open any chapter and click "View Chapter PDF"
3. **Google Viewer**: The PDFs will automatically load through Google Docs Viewer

---

## Troubleshooting

### PDF Not Loading?
1. **Check Internet Connection**: NCERT website must be accessible
2. **Try Direct Link**: Copy URL and open in new tab to verify it works
3. **Google Viewer Fallback**: The platform automatically uses Google Viewer for NCERT PDFs

### Wrong Chapter Opens?
- This is expected - NCERT provides complete books, not individual chapters
- Students need to navigate within the PDF to find their specific chapter
- Consider adding chapter page numbers in your database for better UX

### Want Individual Chapter PDFs?
Options:
1. **Extract chapters** from NCERT PDFs and host separately
2. **Add page number parameter** to jump to specific chapter
3. **Create custom PDFs** with only specific chapter content

---

## Future Enhancements

### Automatic Chapter Navigation
You could enhance the URL with page numbers:
```javascript
const pdfUrlWithPage = `${pdfUrl}#page=${chapterStartPage}`;
```

This would require:
1. Adding `start_page` column to chapters table
2. Updating migration with page numbers for each chapter
3. Modifying PDFViewer to append page number

### Example:
```sql
ALTER TABLE public.chapters ADD COLUMN start_page INTEGER;

UPDATE public.chapters 
SET start_page = 1 
WHERE chapter_number = 1 AND subject_id IN (...);

UPDATE public.chapters 
SET start_page = 15 
WHERE chapter_number = 2 AND subject_id IN (...);
-- etc.
```

---

## Summary

✅ **All URLs are official NCERT links**  
✅ **URLs are publicly accessible**  
✅ **PDFs work with Google Docs Viewer**  
✅ **Covers Classes 9-12 for all major subjects**  
✅ **No cost, no hosting required**  
✅ **Regularly maintained by NCERT**

The PDFs will open directly in your platform using an embedded viewer, providing students with seamless access to official NCERT textbooks!
