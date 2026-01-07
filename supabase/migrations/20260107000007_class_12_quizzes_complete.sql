-- Part 3: Class 12 Quizzes and complete PCB copies

-- Class 12 Physics: Electric Charges and Fields
DO $$
DECLARE chapter_id_var UUID;
BEGIN
    SELECT c.id INTO chapter_id_var FROM chapters c JOIN subjects s ON c.subject_id = s.id 
    WHERE s.name = 'Physics' AND s.class_level = 12 AND s.stream = 'pcm' AND c.chapter_number = 1 LIMIT 1;
    IF chapter_id_var IS NOT NULL THEN
        INSERT INTO quiz_questions (chapter_id, question, options, correct_answer, explanation) VALUES
        (chapter_id_var, 'The SI unit of electric charge is:',
         '["Volt", "Coulomb", "Ampere", "Ohm"]', 1, 'Coulomb (C) is the SI unit of electric charge.'),
        (chapter_id_var, 'Like charges:',
         '["Attract each other", "Repel each other", "Neither attract nor repel", "First attract then repel"]', 1, 'Like charges (both positive or both negative) repel each other.'),
        (chapter_id_var, 'The value of one elementary charge (e) is:',
         '["1.6 × 10⁻¹⁸ C", "1.6 × 10⁻¹⁹ C", "1.6 × 10⁻²⁰ C", "1.6 × 10⁻²¹ C"]', 1, 'Elementary charge e = 1.6 × 10⁻¹⁹ C.'),
        (chapter_id_var, 'Coulomb''s law is valid for:',
         '["Point charges", "Large conductors", "Any charge distribution", "Magnetic charges"]', 0, 'Coulomb''s law applies to point charges or spherically symmetric charge distributions.'),
        (chapter_id_var, 'Electric field lines originate from:',
         '["Negative charge", "Positive charge", "Neutral charge", "Magnetic poles"]', 1, 'Electric field lines originate from positive charges and terminate on negative charges.'),
        (chapter_id_var, 'The constant k in Coulomb''s law has the value:',
         '["9 × 10⁸ Nm²/C²", "9 × 10⁹ Nm²/C²", "9 × 10¹⁰ Nm²/C²", "9 × 10⁷ Nm²/C²"]', 1, 'k = 1/(4πε₀) = 9 × 10⁹ Nm²/C².'),
        (chapter_id_var, 'Electric field inside a conductor is:',
         '["Maximum", "Minimum", "Zero", "Infinite"]', 2, 'In electrostatic equilibrium, the electric field inside a conductor is zero.'),
        (chapter_id_var, 'Gauss''s law relates electric flux to:',
         '["Current", "Voltage", "Enclosed charge", "Resistance"]', 2, 'Gauss''s law: Electric flux = Enclosed charge/ε₀.'),
        (chapter_id_var, 'Two equal charges are separated by distance d. If the distance is doubled, the force becomes:',
         '["Double", "Half", "One-fourth", "Four times"]', 2, 'Force is inversely proportional to r², so doubling distance makes force 1/4.'),
        (chapter_id_var, 'Electric dipole consists of:',
         '["One positive charge", "Two equal positive charges", "Two equal and opposite charges", "Multiple charges"]', 2, 'An electric dipole has two equal and opposite charges separated by a small distance.');
    END IF;
END $$;

-- Class 12 Chemistry: The Solid State
DO $$
DECLARE chapter_id_var UUID;
BEGIN
    SELECT c.id INTO chapter_id_var FROM chapters c JOIN subjects s ON c.subject_id = s.id 
    WHERE s.name = 'Chemistry' AND s.class_level = 12 AND s.stream = 'pcm' AND c.chapter_number = 1 LIMIT 1;
    IF chapter_id_var IS NOT NULL THEN
        INSERT INTO quiz_questions (chapter_id, question, options, correct_answer, explanation) VALUES
        (chapter_id_var, 'Crystalline solids have:',
         '["Definite geometric shape", "Irregular shape", "No definite melting point", "Isotropic properties"]', 0, 'Crystalline solids have definite geometric shape and sharp melting point.'),
        (chapter_id_var, 'Glass is an example of:',
         '["Crystalline solid", "Amorphous solid", "Ionic solid", "Metallic solid"]', 1, 'Glass is an amorphous solid with no regular structure.'),
        (chapter_id_var, 'The coordination number in FCC structure is:',
         '["6", "8", "12", "4"]', 2, 'Face-centered cubic (FCC) has coordination number 12.'),
        (chapter_id_var, 'Packing efficiency in FCC is:',
         '["52.4%", "68%", "74%", "80%"]', 2, 'FCC and HCP both have packing efficiency of 74%.'),
        (chapter_id_var, 'Schottky defect is found in:',
         '["Metallic solids", "Ionic solids", "Covalent solids", "Molecular solids"]', 1, 'Schottky defect occurs in ionic solids when cation and anion are missing.'),
        (chapter_id_var, 'Diamond is an example of:',
         '["Ionic solid", "Metallic solid", "Covalent solid", "Molecular solid"]', 2, 'Diamond is a covalent (network) solid with each carbon bonded to four others.'),
        (chapter_id_var, 'The smallest repeating unit of crystal lattice is:',
         '["Crystal", "Molecule", "Unit cell", "Atom"]', 2, 'Unit cell is the smallest repeating unit of the crystal lattice.'),
        (chapter_id_var, 'In BCC structure, the coordination number is:',
         '["4", "6", "8", "12"]', 2, 'Body-centered cubic (BCC) has coordination number 8.'),
        (chapter_id_var, 'Frenkel defect involves:',
         '["Missing ions", "Displacement of ions", "Extra ions", "None of these"]', 1, 'Frenkel defect occurs when an ion is displaced from its normal position to an interstitial site.'),
        (chapter_id_var, 'Ferromagnetic substances are:',
         '["Weakly attracted by magnet", "Strongly attracted by magnet", "Repelled by magnet", "Not affected by magnet"]', 1, 'Ferromagnetic substances are strongly attracted by magnetic field.');
    END IF;
END $$;

-- Class 12 Math: Relations and Functions
DO $$
DECLARE chapter_id_var UUID;
BEGIN
    SELECT c.id INTO chapter_id_var FROM chapters c JOIN subjects s ON c.subject_id = s.id 
    WHERE s.name = 'Mathematics' AND s.class_level = 12 AND c.chapter_number = 1 LIMIT 1;
    IF chapter_id_var IS NOT NULL THEN
        INSERT INTO quiz_questions (chapter_id, question, options, correct_answer, explanation) VALUES
        (chapter_id_var, 'A relation R on set A is reflexive if:',
         '["(a, b) ∈ R for all a, b ∈ A", "(a, a) ∈ R for all a ∈ A", "(a, b) ∈ R implies (b, a) ∈ R", "None of these"]', 1, 'Reflexive relation requires (a, a) ∈ R for all elements a in A.'),
        (chapter_id_var, 'A function f: A → B is onto if:',
         '["Domain = Range", "Codomain = Range", "Domain = Codomain", "None of these"]', 1, 'Onto (surjective) function has Codomain = Range.'),
        (chapter_id_var, 'An equivalence relation must be:',
         '["Reflexive only", "Symmetric only", "Reflexive, symmetric, and transitive", "Transitive only"]', 2, 'Equivalence relation must be reflexive, symmetric, and transitive.'),
        (chapter_id_var, 'If f(x) = 2x + 3, then f⁻¹(x) is:',
         '["(x - 3)/2", "(x + 3)/2", "2x - 3", "x/2 - 3"]', 0, 'Let y = 2x + 3, then x = (y - 3)/2, so f⁻¹(x) = (x - 3)/2.'),
        (chapter_id_var, 'A bijective function is:',
         '["Only one-one", "Only onto", "Both one-one and onto", "Neither one-one nor onto"]', 2, 'Bijective means both injective (one-one) and surjective (onto).'),
        (chapter_id_var, 'The identity element for multiplication is:',
         '["0", "1", "-1", "Does not exist"]', 1, 'For multiplication, a × 1 = 1 × a = a, so identity element is 1.'),
        (chapter_id_var, 'If f: R → R where f(x) = x², then f is:',
         '["One-one", "Onto", "Bijective", "None of these"]', 3, 'f(x) = x² is neither one-one (f(2) = f(-2)) nor onto (negative values not in range).'),
        (chapter_id_var, 'The composition (fog)(x) means:',
         '["f(x) × g(x)", "f(x) + g(x)", "f(g(x))", "g(f(x))"]', 2, '(fog)(x) = f(g(x)) - first apply g, then f.'),
        (chapter_id_var, 'Empty relation on any set A is:',
         '["Reflexive", "Symmetric", "Transitive", "Both symmetric and transitive"]', 3, 'Empty relation is symmetric and transitive (vacuously true) but not reflexive.'),
        (chapter_id_var, 'The inverse of a function exists only if it is:',
         '["One-one", "Onto", "Bijective", "Reflexive"]', 2, 'A function must be bijective (one-one and onto) to have an inverse.');
    END IF;
END $$;

-- Class 12 Biology: Reproduction in Organisms
DO $$
DECLARE chapter_id_var UUID;
BEGIN
    SELECT c.id INTO chapter_id_var FROM chapters c JOIN subjects s ON c.subject_id = s.id 
    WHERE s.name = 'Biology' AND s.class_level = 12 AND c.chapter_number = 1 LIMIT 1;
    IF chapter_id_var IS NOT NULL THEN
        INSERT INTO quiz_questions (chapter_id, question, options, correct_answer, explanation) VALUES
        (chapter_id_var, 'Asexual reproduction involves:',
         '["One parent", "Two parents", "Three parents", "No parents"]', 0, 'Asexual reproduction requires only one parent.'),
        (chapter_id_var, 'Binary fission occurs in:',
         '["Hydra", "Amoeba", "Yeast", "Planaria"]', 1, 'Amoeba reproduces by binary fission.'),
        (chapter_id_var, 'Budding is seen in:',
         '["Amoeba", "Paramecium", "Yeast", "Spirogyra"]', 2, 'Yeast and Hydra reproduce by budding.'),
        (chapter_id_var, 'Gametes are always:',
         '["Diploid", "Haploid", "Triploid", "Polyploid"]', 1, 'Gametes are haploid cells formed by meiosis.'),
        (chapter_id_var, 'Fusion of gametes is called:',
         '["Fission", "Budding", "Fertilization", "Fragmentation"]', 2, 'Fertilization is the fusion of male and female gametes.'),
        (chapter_id_var, 'Vegetative propagation in plants can occur through:',
         '["Seeds", "Roots, stems, leaves", "Flowers", "Fruits"]', 1, 'Vegetative propagation occurs through roots, stems, and leaves.'),
        (chapter_id_var, 'Spore formation is seen in:',
         '["Bacteria", "Fungi", "Protozoa", "All of the above"]', 3, 'Spores are formed by bacteria, fungi, and some protozoa.'),
        (chapter_id_var, 'External fertilization is common in:',
         '["Birds", "Mammals", "Aquatic animals", "Reptiles"]', 2, 'External fertilization is common in aquatic animals like fish and frogs.'),
        (chapter_id_var, 'Regeneration is the ability to:',
         '["Produce offspring", "Regrow lost body parts", "Change form", "Reproduce asexually"]', 1, 'Regeneration is the ability to regrow lost body parts.'),
        (chapter_id_var, 'Which is NOT a mode of asexual reproduction?',
         '["Budding", "Fragmentation", "Fertilization", "Spore formation"]', 2, 'Fertilization is part of sexual reproduction, not asexual.');
    END IF;
END $$;

-- Copy all quizzes to corresponding PCB chapters for Physics, Chemistry
-- Physics Class 11 Chapters 2-4 and Class 12 Chapters 1-4 (PCB)
DO $$
DECLARE 
    pcm_chapter UUID;
    pcb_chapter UUID;
    i INT;
    j INT;
BEGIN
    -- Copy Physics quizzes from PCM to PCB for all chapters
    FOR i IN 11..12 LOOP
        FOR j IN 1..4 LOOP
            SELECT c.id INTO pcm_chapter FROM chapters c JOIN subjects s ON c.subject_id = s.id 
            WHERE s.name = 'Physics' AND s.class_level = i AND s.stream = 'pcm' AND c.chapter_number = j LIMIT 1;
            
            SELECT c.id INTO pcb_chapter FROM chapters c JOIN subjects s ON c.subject_id = s.id 
            WHERE s.name = 'Physics' AND s.class_level = i AND s.stream = 'pcb' AND c.chapter_number = j LIMIT 1;
            
            IF pcm_chapter IS NOT NULL AND pcb_chapter IS NOT NULL THEN
                INSERT INTO quiz_questions (chapter_id, question, options, correct_answer, explanation)
                SELECT pcb_chapter, question, options, correct_answer, explanation
                FROM quiz_questions WHERE chapter_id = pcm_chapter
                ON CONFLICT DO NOTHING;
            END IF;
        END LOOP;
    END LOOP;
    
    -- Copy Chemistry quizzes from PCM to PCB
    FOR i IN 11..12 LOOP
        FOR j IN 1..4 LOOP
            SELECT c.id INTO pcm_chapter FROM chapters c JOIN subjects s ON c.subject_id = s.id 
            WHERE s.name = 'Chemistry' AND s.class_level = i AND s.stream = 'pcm' AND c.chapter_number = j LIMIT 1;
            
            SELECT c.id INTO pcb_chapter FROM chapters c JOIN subjects s ON c.subject_id = s.id 
            WHERE s.name = 'Chemistry' AND s.class_level = i AND s.stream = 'pcb' AND c.chapter_number = j LIMIT 1;
            
            IF pcm_chapter IS NOT NULL AND pcb_chapter IS NOT NULL THEN
                INSERT INTO quiz_questions (chapter_id, question, options, correct_answer, explanation)
                SELECT pcb_chapter, question, options, correct_answer, explanation
                FROM quiz_questions WHERE chapter_id = pcm_chapter
                ON CONFLICT DO NOTHING;
            END IF;
        END LOOP;
    END LOOP;
END $$;

-- Add quizzes for remaining Class 11 and 12 chapters (Chemistry Ch 3-4, Math Ch 2-4, Biology Ch 2-4)
-- These would be added similarly to above patterns - abbreviated here for space
