-- Quiz Questions for Class 11 & 12 Chapters
-- This migration adds 10 quiz questions per chapter

-- Helper function to get chapter ID by subject name, class, stream, and chapter name
-- We'll use DO blocks to insert questions for each chapter

-- ===========================
-- CLASS 11 PHYSICS QUIZZES
-- ===========================

-- Physical World (Class 11 Physics PCM)
DO $$
DECLARE
    chapter_id_var UUID;
BEGIN
    SELECT c.id INTO chapter_id_var 
    FROM chapters c 
    JOIN subjects s ON c.subject_id = s.id 
    WHERE s.name = 'Physics' AND s.class_level = 11 AND s.stream = 'pcm' AND c.chapter_number = 1
    LIMIT 1;
    
    IF chapter_id_var IS NOT NULL THEN
        INSERT INTO quiz_questions (chapter_id, question, options, correct_answer, explanation) VALUES
        (chapter_id_var, 'Which of the following is NOT a fundamental force in nature?',
         '["Gravitational force", "Electromagnetic force", "Nuclear force", "Frictional force"]',
         3, 'Frictional force is not a fundamental force; it arises from electromagnetic interactions at the molecular level.'),
        
        (chapter_id_var, 'The scope of physics includes the study of phenomena from:',
         '["Microscopic to macroscopic", "Only atomic level", "Only planetary level", "Only chemical reactions"]',
         0, 'Physics studies phenomena ranging from the microscopic (atoms, molecules) to the macroscopic (planets, galaxies).'),
        
        (chapter_id_var, 'Which force is responsible for holding nucleons together in the nucleus?',
         '["Gravitational force", "Weak nuclear force", "Strong nuclear force", "Electromagnetic force"]',
         2, 'The strong nuclear force binds protons and neutrons together in the atomic nucleus.'),
        
        (chapter_id_var, 'Physical laws are characterized by being:',
         '["Universal and precise", "Local and approximate", "Variable and complex", "Theoretical only"]',
         0, 'Physical laws are universal (apply everywhere), precise (can be measured accurately), and often simple.'),
        
        (chapter_id_var, 'Which fundamental force is responsible for radioactive decay?',
         '["Strong nuclear force", "Electromagnetic force", "Weak nuclear force", "Gravitational force"]',
         2, 'The weak nuclear force is responsible for processes like beta decay in radioactive materials.'),
        
        (chapter_id_var, 'The electromagnetic force acts between:',
         '["All masses", "Charged particles", "Only protons", "Neutrons only"]',
         1, 'Electromagnetic force acts between electrically charged particles.'),
        
        (chapter_id_var, 'Which of the following is a contribution of physics to technology?',
         '["Electricity", "Computers", "Medical imaging", "All of the above"]',
         3, 'Physics has contributed to all these technologies and many more.'),
        
        (chapter_id_var, 'The weakest fundamental force is:',
         '["Gravitational force", "Electromagnetic force", "Strong nuclear force", "Weak nuclear force"]',
         0, 'Gravitational force is the weakest of all fundamental forces, though it dominates at large scales.'),
        
        (chapter_id_var, 'How many fundamental forces are there in nature?',
         '["2", "3", "4", "5"]',
         2, 'There are four fundamental forces: gravitational, electromagnetic, strong nuclear, and weak nuclear.'),
        
        (chapter_id_var, 'Which force has infinite range?',
         '["Strong nuclear force", "Weak nuclear force", "Gravitational force", "None of these"]',
         2, 'Both gravitational and electromagnetic forces have infinite range, though they decrease with distance.');
    END IF;
END $$;

-- Units and Measurements (Class 11 Physics PCM)
DO $$
DECLARE
    chapter_id_var UUID;
BEGIN
    SELECT c.id INTO chapter_id_var 
    FROM chapters c 
    JOIN subjects s ON c.subject_id = s.id 
    WHERE s.name = 'Physics' AND s.class_level = 11 AND s.stream = 'pcm' AND c.chapter_number = 2
    LIMIT 1;
    
    IF chapter_id_var IS NOT NULL THEN
        INSERT INTO quiz_questions (chapter_id, question, options, correct_answer, explanation) VALUES
        (chapter_id_var, 'The SI unit of electric current is:',
         '["Volt", "Ampere", "Ohm", "Watt"]',
         1, 'The ampere (A) is the SI base unit for electric current.'),
        
        (chapter_id_var, 'The dimensional formula for force is:',
         '["[M L T⁻¹]", "[M L T⁻²]", "[M L² T⁻²]", "[M L⁻¹ T⁻²]"]',
         1, 'Force = mass × acceleration, so [F] = [M][L T⁻²] = [M L T⁻²].'),
        
        (chapter_id_var, 'How many base units are there in the SI system?',
         '["5", "6", "7", "8"]',
         2, 'There are 7 base units in SI: metre, kilogram, second, ampere, kelvin, mole, and candela.'),
        
        (chapter_id_var, 'The number 0.00456 has how many significant figures?',
         '["2", "3", "5", "6"]',
         1, 'Three significant figures: 4, 5, and 6. Leading zeros are not significant.'),
        
        (chapter_id_var, 'Dimensional analysis can be used to:',
         '["Check equation correctness", "Derive relations", "Convert units", "All of the above"]',
         3, 'Dimensional analysis is useful for all these purposes.'),
        
        (chapter_id_var, 'The SI unit of luminous intensity is:',
         '["Lumen", "Candela", "Lux", "Watt"]',
         1, 'Candela (cd) is the SI base unit for luminous intensity.'),
        
        (chapter_id_var, 'Which of the following is a systematic error?',
         '["Zero error in instrument", "Random fluctuations", "Human reaction time", "None of these"]',
         0, 'Zero error is a systematic error that can be corrected by proper calibration.'),
        
        (chapter_id_var, 'The dimensional formula [M L² T⁻²] represents:',
         '["Force", "Energy", "Power", "Momentum"]',
         1, 'Energy, work, and heat all have the dimensional formula [M L² T⁻²].'),
        
        (chapter_id_var, 'In the measurement 25.00 m, the number of significant figures is:',
         '["2", "3", "4", "5"]',
         2, 'Four significant figures: 2, 5, 0, and 0. Trailing zeros after decimal are significant.'),
        
        (chapter_id_var, 'The SI unit of temperature is:',
         '["Celsius", "Fahrenheit", "Kelvin", "Rankine"]',
         2, 'Kelvin (K) is the SI base unit for thermodynamic temperature.');
    END IF;
END $$;

-- Motion in a Straight Line (Class 11 Physics PCM)
DO $$
DECLARE
    chapter_id_var UUID;
BEGIN
    SELECT c.id INTO chapter_id_var 
    FROM chapters c 
    JOIN subjects s ON c.subject_id = s.id 
    WHERE s.name = 'Physics' AND s.class_level = 11 AND s.stream = 'pcm' AND c.chapter_number = 3
    LIMIT 1;
    
    IF chapter_id_var IS NOT NULL THEN
        INSERT INTO quiz_questions (chapter_id, question, options, correct_answer, explanation) VALUES
        (chapter_id_var, 'Displacement is a:',
         '["Scalar quantity", "Vector quantity", "Neither scalar nor vector", "Both scalar and vector"]',
         1, 'Displacement is a vector quantity because it has both magnitude and direction.'),
        
        (chapter_id_var, 'In uniform motion, the velocity is:',
         '["Constant", "Variable", "Zero", "Infinite"]',
         0, 'Uniform motion means the velocity remains constant (both speed and direction).'),
        
        (chapter_id_var, 'The equation v = u + at is valid for:',
         '["Uniform velocity", "Variable acceleration", "Uniform acceleration", "Circular motion"]',
         2, 'This is one of the equations of motion for uniformly accelerated motion.'),
        
        (chapter_id_var, 'If a body starts from rest, its initial velocity (u) is:',
         '["0", "1", "Infinite", "Cannot be determined"]',
         0, 'Starting from rest means the initial velocity is zero.'),
        
        (chapter_id_var, 'The area under a velocity-time graph represents:',
         '["Acceleration", "Displacement", "Speed", "Force"]',
         1, 'The area under a velocity-time graph gives the displacement of the object.'),
        
        (chapter_id_var, 'For a freely falling body, the acceleration is:',
         '["Zero", "9.8 m/s upward", "9.8 m/s² downward", "Variable"]',
         2, 'A freely falling body accelerates downward at approximately 9.8 m/s² (acceleration due to gravity).'),
        
        (chapter_id_var, 'The slope of a position-time graph gives:',
         '["Velocity", "Acceleration", "Displacement", "Distance"]',
         0, 'The slope of a position-time graph represents velocity.'),
        
        (chapter_id_var, 'Which equation relates velocity, acceleration, and displacement (without time)?',
         '["v = u + at", "s = ut + ½at²", "v² = u² + 2as", "s = (u + v)t/2"]',
         2, 'The third equation of motion v² = u² + 2as doesn''t involve time.'),
        
        (chapter_id_var, 'A body moving with constant velocity has:',
         '["Zero acceleration", "Constant acceleration", "Variable acceleration", "Infinite acceleration"]',
         0, 'If velocity is constant, there is no change in velocity, so acceleration is zero.'),
        
        (chapter_id_var, 'The slope of a velocity-time graph represents:',
         '["Displacement", "Velocity", "Acceleration", "Distance"]',
         2, 'The slope of a velocity-time graph gives acceleration.');
    END IF;
END $$;

-- Continue with more chapters... This file is getting large, so I''ll create additional quiz questions in the next sections
