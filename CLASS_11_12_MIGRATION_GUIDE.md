# Class 11 & 12 Content Migration Guide

This guide explains how to add subjects, chapters, and quizzes for Class 11 & 12 students (both PCM and PCB streams).

## What's Included

### Subjects Added:
**Class 11:**
- Physics (PCM & PCB)
- Chemistry (PCM & PCB)
- Mathematics (PCM only)
- Biology (PCB only)

**Class 12:**
- Physics (PCM & PCB)
- Chemistry (PCM & PCB)
- Mathematics (PCM only)
- Biology (PCB only)

### Chapters (First 4 for each subject):

**Class 11 Physics:**
1. Physical World
2. Units and Measurements
3. Motion in a Straight Line
4. Motion in a Plane

**Class 11 Chemistry:**
1. Some Basic Concepts of Chemistry
2. Structure of Atom
3. Classification of Elements and Periodicity
4. Chemical Bonding and Molecular Structure

**Class 11 Mathematics:**
1. Sets
2. Relations and Functions
3. Trigonometric Functions
4. Principle of Mathematical Induction

**Class 11 Biology:**
1. The Living World
2. Biological Classification
3. Plant Kingdom
4. Animal Kingdom

**Class 12 Physics:**
1. Electric Charges and Fields
2. Electrostatic Potential and Capacitance
3. Current Electricity
4. Moving Charges and Magnetism

**Class 12 Chemistry:**
1. The Solid State
2. Solutions
3. Electrochemistry
4. Chemical Kinetics

**Class 12 Mathematics:**
1. Relations and Functions
2. Inverse Trigonometric Functions
3. Matrices
4. Determinants

**Class 12 Biology:**
1. Reproduction in Organisms
2. Sexual Reproduction in Flowering Plants
3. Human Reproduction
4. Reproductive Health

### Quiz Questions:
- **10 questions per chapter** based on NCERT curriculum
- Multiple choice format with explanations
- Random selection during quiz

## Migration Files

The following migration files have been created in `supabase/migrations/`:

1. `20260107000000_add_class_11_12_data.sql` - Subjects and Class 11 Physics/Chemistry chapters
2. `20260107000001_add_class_11_12_data_part2.sql` - Class 11 Math and Biology chapters
3. `20260107000002_add_class_12_data.sql` - Class 12 Physics chapters
4. `20260107000003_add_class_12_chem_math_bio.sql` - Class 12 Chemistry chapters
5. `20260107000004_add_class_12_math_bio.sql` - Class 12 Math and Biology chapters
6. `20260107000005_add_quiz_questions.sql` - Quiz questions for Class 11
7. `20260107000006_add_more_quizzes.sql` - More quiz questions
8. `20260107000007_class_12_quizzes_complete.sql` - Class 12 quiz questions and PCB copies

## How to Apply Migrations

### Method 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project: https://app.supabase.com/project/mwrbxsukujurihpaijhn
2. Navigate to **SQL Editor**
3. Copy and paste the content of each migration file **in order** (from 00 to 07)
4. Click **Run** for each file
5. Verify the data was added by checking the tables

### Method 2: Using Supabase CLI (if installed)

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Link to your project
supabase link --project-ref mwrbxsukujurihpaijhn

# Push migrations
supabase db push
```

### Method 3: Direct SQL Execution

You can also concatenate all migration files and run them together:

```bash
# On Windows PowerShell
Get-Content supabase\migrations\20260107*.sql | Set-Content combined_migration.sql
```

Then run `combined_migration.sql` in Supabase SQL Editor.

## Verification

After running migrations, verify:

1. **Subjects Table:**
   ```sql
   SELECT name, class_level, stream FROM subjects WHERE class_level IN (11, 12) ORDER BY class_level, stream, name;
   ```
   You should see 12 subjects (6 for class 11, 6 for class 12).

2. **Chapters Table:**
   ```sql
   SELECT s.name as subject, s.class_level, s.stream, c.chapter_number, c.name as chapter
   FROM chapters c
   JOIN subjects s ON c.subject_id = s.id
   WHERE s.class_level IN (11, 12)
   ORDER BY s.class_level, s.stream, s.name, c.chapter_number;
   ```
   You should see 48 chapters (4 chapters × 12 subjects).

3. **Quiz Questions:**
   ```sql
   SELECT COUNT(*) as total_questions FROM quiz_questions;
   ```
   You should have hundreds of quiz questions.

## Testing

1. **Log in as a Class 11 PCM student** and verify:
   - You see Physics, Chemistry, and Mathematics subjects
   - Each subject shows 4 chapters
   - Each chapter has content
   - You can take quizzes (10 questions per chapter)

2. **Log in as a Class 11 PCB student** and verify:
   - You see Physics, Chemistry, and Biology subjects
   - Each subject shows 4 chapters
   - All features work correctly

3. **Repeat for Class 12 students** (both PCM and PCB)

## Troubleshooting

### "Duplicate key value" error
This means the migration has already been run. You can safely ignore this.

### "Column does not exist" error
Make sure you've run all previous migrations in order.

### No subjects showing up
Check that your profile's `school_class` is set to 11 or 12, and `school_stream` is 'pcm' or 'pcb'.

### Quiz questions not appearing
Verify that:
1. The chapter has associated quiz questions in the database
2. The `quiz_questions` table has entries for the chapter_id

## Future Additions

To add more chapters or subjects:

1. Create a new migration file with timestamp
2. Follow the same structure as existing migrations
3. Add subjects, chapters, and quiz questions
4. Run the migration

## Support

If you encounter any issues, check:
- Supabase dashboard for error logs
- Browser console for frontend errors
- Database table contents using SQL queries above
