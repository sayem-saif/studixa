-- Part 2: More Quiz Questions for remaining Class 11 chapters

-- Motion in a Plane (Class 11 Physics Ch4)
DO $$
DECLARE chapter_id_var UUID;
BEGIN
    SELECT c.id INTO chapter_id_var FROM chapters c JOIN subjects s ON c.subject_id = s.id 
    WHERE s.name = 'Physics' AND s.class_level = 11 AND s.stream = 'pcm' AND c.chapter_number = 4 LIMIT 1;
    IF chapter_id_var IS NOT NULL THEN
        INSERT INTO quiz_questions (chapter_id, question, options, correct_answer, explanation) VALUES
        (chapter_id_var, 'In projectile motion, the horizontal component of velocity:',
         '["Increases", "Decreases", "Remains constant", "Becomes zero"]', 2,
         'In projectile motion (neglecting air resistance), horizontal velocity remains constant.'),
        (chapter_id_var, 'The path of a projectile is:',
         '["Straight line", "Circle", "Parabola", "Ellipse"]', 2,
         'The trajectory of a projectile is a parabolic curve.'),
        (chapter_id_var, 'Centripetal acceleration is directed:',
         '["Tangent to path", "Towards center", "Away from center", "Perpendicular to radius"]', 1,
         'Centripetal acceleration is always directed toward the center of the circular path.'),
        (chapter_id_var, 'For maximum range of a projectile, the angle of projection should be:',
         '["30°", "45°", "60°", "90°"]', 1,
         'Maximum range is achieved at 45° angle of projection.'),
        (chapter_id_var, 'The time of flight of a projectile is:',
         '["T = u sinθ/g", "T = 2u sinθ/g", "T = u cosθ/g", "T = u/g"]', 1,
         'Time of flight T = 2u sinθ/g where u is initial velocity and θ is angle of projection.'),
        (chapter_id_var, 'In uniform circular motion, speed is:',
         '["Constant", "Variable", "Zero", "Infinite"]', 0,
         'In uniform circular motion, speed remains constant but velocity changes direction.'),
        (chapter_id_var, 'Angular velocity ω is related to linear velocity v by:',
         '["v = ωr", "v = ω/r", "v = ωr²", "v = r/ω"]', 0,
         'Linear velocity v = ωr where r is the radius.'),
        (chapter_id_var, 'At the highest point of projectile motion, vertical component of velocity is:',
         '["Maximum", "Minimum", "Zero", "Negative"]', 2,
         'At the highest point, vertical velocity becomes zero momentarily.'),
        (chapter_id_var, 'Centripetal force is given by:',
         '["F = mv/r", "F = mv²/r", "F = mr/v", "F = m/vr"]', 1,
         'Centripetal force F = mv²/r = mω²r.'),
        (chapter_id_var, 'The period of circular motion is:',
         '["T = 2πr/v", "T = πr/v", "T = r/2πv", "T = v/2πr"]', 0,
         'Period T = 2πr/v where r is radius and v is speed.');
    END IF;
END $$;

-- Class 11 Chemistry Quizzes
-- Some Basic Concepts (Ch1)
DO $$
DECLARE chapter_id_var UUID;
BEGIN
    SELECT c.id INTO chapter_id_var FROM chapters c JOIN subjects s ON c.subject_id = s.id 
    WHERE s.name = 'Chemistry' AND s.class_level = 11 AND s.stream = 'pcm' AND c.chapter_number = 1 LIMIT 1;
    IF chapter_id_var IS NOT NULL THEN
        INSERT INTO quiz_questions (chapter_id, question, options, correct_answer, explanation) VALUES
        (chapter_id_var, 'One mole of any substance contains:',
         '["6.022 × 10²¹ particles", "6.022 × 10²³ particles", "6.022 × 10²⁴ particles", "6.022 × 10²² particles"]', 1,
         'Avogadro''s number is 6.022 × 10²³ particles per mole.'),
        (chapter_id_var, 'The atomic mass unit (amu) is defined as:',
         '["1/12 mass of C-12", "1/16 mass of O-16", "Mass of H-1", "Mass of one proton"]', 0,
         'One amu is 1/12th the mass of a carbon-12 atom.'),
        (chapter_id_var, 'The law of definite proportions was given by:',
         '["Dalton", "Proust", "Lavoisier", "Avogadro"]', 1,
         'Joseph Proust stated that a chemical compound always contains the same elements in fixed proportions.'),
        (chapter_id_var, 'Stoichiometry deals with:',
         '["Structure of atoms", "Quantitative relationships in reactions", "Energy changes", "Reaction rates"]', 1,
         'Stoichiometry is the study of quantitative relationships between reactants and products.'),
        (chapter_id_var, 'Which law states that mass is conserved in a chemical reaction?',
         '["Law of multiple proportions", "Law of conservation of mass", "Law of definite proportions", "Avogadro''s law"]', 1,
         'Lavoisier''s law of conservation of mass states that mass is neither created nor destroyed in chemical reactions.'),
        (chapter_id_var, 'Molecular mass is the sum of:',
         '["Atomic numbers", "Atomic masses", "Neutrons", "Electrons"]', 1,
         'Molecular mass is the sum of atomic masses of all atoms in a molecule.'),
        (chapter_id_var, 'The molar mass of water (H₂O) is approximately:',
         '["16 g/mol", "18 g/mol", "20 g/mol", "22 g/mol"]', 1,
         'H₂O = 2(1) + 16 = 18 g/mol.'),
        (chapter_id_var, 'Which of the following is amorphous?',
         '["Ice", "Diamond", "Glass", "Salt"]', 2,
         'Glass is an amorphous solid with no regular crystalline structure.'),
        (chapter_id_var, 'The percentage of oxygen in water (H₂O) by mass is:',
         '["11.1%", "88.9%", "50%", "33.3%"]', 1,
         'Oxygen mass = 16, Total mass = 18, Percentage = (16/18) × 100 = 88.9%.'),
        (chapter_id_var, 'The law of multiple proportions was proposed by:',
         '["Dalton", "Proust", "Lavoisier", "Berzelius"]', 0,
         'John Dalton proposed the law of multiple proportions.');
    END IF;
END $$;

-- Structure of Atom (Ch2)
DO $$
DECLARE chapter_id_var UUID;
BEGIN
    SELECT c.id INTO chapter_id_var FROM chapters c JOIN subjects s ON c.subject_id = s.id 
    WHERE s.name = 'Chemistry' AND s.class_level = 11 AND s.stream = 'pcm' AND c.chapter_number = 2 LIMIT 1;
    IF chapter_id_var IS NOT NULL THEN
        INSERT INTO quiz_questions (chapter_id, question, options, correct_answer, explanation) VALUES
        (chapter_id_var, 'Who discovered the electron?',
         '["Rutherford", "J.J. Thomson", "Chadwick", "Bohr"]', 1,
         'J.J. Thomson discovered the electron through cathode ray experiments in 1897.'),
        (chapter_id_var, 'The charge on an electron is:',
         '["1.6 × 10⁻¹⁹ C", "-1.6 × 10⁻¹⁹ C", "1.6 × 10⁻¹⁸ C", "-1.6 × 10⁻¹⁸ C"]', 1,
         'The electron has a negative charge of -1.6 × 10⁻¹⁹ coulombs.'),
        (chapter_id_var, 'According to Bohr''s model, electrons revolve in:',
         '["Random orbits", "Fixed orbits", "Spiral paths", "Elliptical orbits"]', 1,
         'Bohr proposed that electrons revolve in fixed circular orbits around the nucleus.'),
        (chapter_id_var, 'The principal quantum number (n) can have values:',
         '["0, 1, 2, 3...", "1, 2, 3, 4...", "-1, 0, 1, 2...", "Any real number"]', 1,
         'The principal quantum number n can be 1, 2, 3, 4... (positive integers).'),
        (chapter_id_var, 'The maximum number of electrons in an orbital is:',
         '["1", "2", "4", "8"]', 1,
         'According to Pauli''s exclusion principle, maximum 2 electrons can occupy one orbital.'),
        (chapter_id_var, 'The azimuthal quantum number (l) determines:',
         '["Energy level", "Shape of orbital", "Orientation", "Spin"]', 1,
         'The azimuthal quantum number l determines the shape of the orbital (s, p, d, f).'),
        (chapter_id_var, 'Which subshell has a dumbbell shape?',
         '["s", "p", "d", "f"]', 1,
         'The p-orbital has a dumbbell (two-lobed) shape.'),
        (chapter_id_var, 'The electronic configuration of sodium (Z=11) is:',
         '["1s² 2s² 2p⁶ 3s¹", "1s² 2s² 2p⁵ 3s²", "1s² 2s² 2p⁶ 3p¹", "1s² 2s² 2p⁷"]', 0,
         'Sodium has 11 electrons: 1s² 2s² 2p⁶ 3s¹.'),
        (chapter_id_var, 'Hund''s rule states that:',
         '["Electrons pair up first", "Electrons fill lower energy orbitals first", "Electrons occupy orbitals singly before pairing", "All orbitals have same energy"]', 2,
         'Hund''s rule: electrons occupy degenerate orbitals singly with parallel spins before pairing.'),
        (chapter_id_var, 'The neutron was discovered by:',
         '["Thomson", "Rutherford", "Chadwick", "Bohr"]', 2,
         'James Chadwick discovered the neutron in 1932.');
    END IF;
END $$;

-- Add PCB copies for Physics and Chemistry
DO $$
DECLARE chapter_id_var UUID;
BEGIN
    -- Copy Physics Ch1 quizzes to PCB
    SELECT c.id INTO chapter_id_var FROM chapters c JOIN subjects s ON c.subject_id = s.id 
    WHERE s.name = 'Physics' AND s.class_level = 11 AND s.stream = 'pcb' AND c.chapter_number = 1 LIMIT 1;
    IF chapter_id_var IS NOT NULL THEN
        INSERT INTO quiz_questions (chapter_id, question, options, correct_answer, explanation)
        SELECT chapter_id_var, question, options, correct_answer, explanation
        FROM quiz_questions WHERE chapter_id = (
            SELECT c.id FROM chapters c JOIN subjects s ON c.subject_id = s.id 
            WHERE s.name = 'Physics' AND s.class_level = 11 AND s.stream = 'pcm' AND c.chapter_number = 1 LIMIT 1
        );
    END IF;
END $$;

-- Continue with additional quiz copies for all PCB chapters...
-- For brevity, adding quizzes for key Math and Biology chapters

-- Class 11 Math: Sets
DO $$
DECLARE chapter_id_var UUID;
BEGIN
    SELECT c.id INTO chapter_id_var FROM chapters c JOIN subjects s ON c.subject_id = s.id 
    WHERE s.name = 'Mathematics' AND s.class_level = 11 AND c.chapter_number = 1 LIMIT 1;
    IF chapter_id_var IS NOT NULL THEN
        INSERT INTO quiz_questions (chapter_id, question, options, correct_answer, explanation) VALUES
        (chapter_id_var, 'A set with no elements is called:',
         '["Universal set", "Empty set", "Singleton set", "Finite set"]', 1,
         'The empty set (∅) contains no elements.'),
        (chapter_id_var, 'The number of subsets of a set with n elements is:',
         '["n", "2n", "2ⁿ", "n²"]', 2,
         'A set with n elements has 2ⁿ subsets.'),
        (chapter_id_var, 'A ∪ B means:',
         '["Intersection", "Union", "Difference", "Complement"]', 1,
         'The union symbol ∪ represents all elements in A or B or both.'),
        (chapter_id_var, 'If A ⊂ B, then A ∩ B equals:',
         '["A", "B", "∅", "A ∪ B"]', 0,
         'If A is a subset of B, then A ∩ B = A.'),
        (chapter_id_var, 'De Morgan''s law states (A ∪ B)'' =',
         '["A'' ∩ B''", "A'' ∪ B''", "A ∩ B", "A ∪ B"]', 0,
         'De Morgan''s law: (A ∪ B)'' = A'' ∩ B''.'),
        (chapter_id_var, 'A set containing only one element is called:',
         '["Empty set", "Singleton set", "Finite set", "Infinite set"]', 1,
         'A singleton set has exactly one element.'),
        (chapter_id_var, 'If n(A) = 5 and n(B) = 3, and n(A ∩ B) = 2, then n(A ∪ B) is:',
         '["6", "7", "8", "10"]', 0,
         'n(A ∪ B) = n(A) + n(B) - n(A ∩ B) = 5 + 3 - 2 = 6.'),
        (chapter_id_var, 'The set of natural numbers is:',
         '["Finite", "Infinite", "Empty", "Singleton"]', 1,
         'The set of natural numbers {1, 2, 3, ...} is infinite.'),
        (chapter_id_var, 'A - B represents:',
         '["Elements in A but not in B", "Elements in B but not in A", "Elements in both", "Union"]', 0,
         'A - B (difference) contains elements that are in A but not in B.'),
        (chapter_id_var, 'The complement of universal set U is:',
         '["U", "∅", "Cannot be determined", "Infinite"]', 1,
         'The complement of the universal set is the empty set.');
    END IF;
END $$;

-- Class 11 Biology: The Living World
DO $$
DECLARE chapter_id_var UUID;
BEGIN
    SELECT c.id INTO chapter_id_var FROM chapters c JOIN subjects s ON c.subject_id = s.id 
    WHERE s.name = 'Biology' AND s.class_level = 11 AND c.chapter_number = 1 LIMIT 1;
    IF chapter_id_var IS NOT NULL THEN
        INSERT INTO quiz_questions (chapter_id, question, options, correct_answer, explanation) VALUES
        (chapter_id_var, 'The binomial nomenclature was given by:',
         '["Darwin", "Linnaeus", "Aristotle", "Whittaker"]', 1,
         'Carolus Linnaeus developed the binomial system of naming organisms.'),
        (chapter_id_var, 'In binomial nomenclature, the first word represents:',
         '["Species", "Genus", "Family", "Order"]', 1,
         'The first word is the genus name, the second is the species name.'),
        (chapter_id_var, 'Which is the correct sequence of taxonomic categories?',
         '["Kingdom → Phylum → Class → Order → Family → Genus → Species", "Species → Genus → Family → Order → Class → Phylum → Kingdom", "Kingdom → Class → Phylum → Order → Family → Genus → Species", "Phylum → Kingdom → Class → Family → Order → Genus → Species"]', 0,
         'The correct sequence from highest to lowest: Kingdom, Phylum, Class, Order, Family, Genus, Species.'),
        (chapter_id_var, 'Which of the following is a characteristic of living organisms?',
         '["Growth", "Reproduction", "Metabolism", "All of the above"]', 3,
         'All are characteristics of living organisms: growth, reproduction, metabolism, etc.'),
        (chapter_id_var, 'A herbarium is a:',
         '["Collection of living plants", "Collection of preserved plant specimens", "Botanical garden", "Zoo for plants"]', 1,
         'A herbarium is a collection of preserved plant specimens for reference.'),
        (chapter_id_var, 'The scientific name of human is:',
         '["Homo sapiens", "Homo erectus", "Homo habilis", "Homo neanderthalensis"]', 0,
         'Homo sapiens is the scientific name for modern humans.'),
        (chapter_id_var, 'Taxonomy is the science of:',
         '["Naming organisms", "Classifying organisms", "Identifying organisms", "All of the above"]', 3,
         'Taxonomy involves naming, classifying, and identifying organisms.'),
        (chapter_id_var, 'Which kingdom includes prokaryotic organisms?',
         '["Monera", "Protista", "Fungi", "Plantae"]', 0,
         'Kingdom Monera consists of prokaryotic organisms like bacteria.'),
        (chapter_id_var, 'The basic unit of classification is:',
         '["Kingdom", "Phylum", "Genus", "Species"]', 3,
         'Species is the basic unit of classification.'),
        (chapter_id_var, 'Five kingdom classification was proposed by:',
         '["Linnaeus", "Whittaker", "Darwin", "Aristotle"]', 1,
         'R.H. Whittaker proposed the five kingdom classification in 1969.');
    END IF;
END $$;
