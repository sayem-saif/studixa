import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase configuration
const SUPABASE_URL = 'https://mwrbxsukujurihpaijhn.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'YOUR_SERVICE_KEY'; // You'll need to set this

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function runMigrations() {
  console.log('🚀 Running Class 11 & 12 migrations...\n');
  
  const migrationFiles = [
    '20260107000000_add_class_11_12_data.sql',
    '20260107000001_add_class_11_12_data_part2.sql',
    '20260107000002_add_class_12_data.sql',
    '20260107000003_add_class_12_chem_math_bio.sql',
    '20260107000004_add_class_12_math_bio.sql',
    '20260107000005_add_quiz_questions.sql',
    '20260107000006_add_more_quizzes.sql',
    '20260107000007_class_12_quizzes_complete.sql'
  ];

  for (const file of migrationFiles) {
    const filePath = path.join(__dirname, '..', 'supabase', 'migrations', file);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${file}`);
      continue;
    }

    console.log(`📄 Running migration: ${file}`);
    
    const sql = fs.readFileSync(filePath, 'utf8');
    
    try {
      const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
      
      if (error) {
        console.error(`❌ Error in ${file}:`, error.message);
      } else {
        console.log(`✅ Successfully ran ${file}\n`);
      }
    } catch (err) {
      console.error(`❌ Error running ${file}:`, err.message);
    }
  }
  
  console.log('✨ Migration process completed!');
}

runMigrations().catch(console.error);
