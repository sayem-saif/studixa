-- Add subjects for Class 11 and 12
-- Physics, Chemistry, Mathematics (PCM), Biology (PCB)

-- Insert subjects for Class 11
INSERT INTO public.subjects (name, class_level, stream, icon, color) VALUES
-- PCM subjects for Class 11
('Physics', 11, 'pcm', 'Atom', 'blue'),
('Chemistry', 11, 'pcm', 'FlaskConical', 'green'),
('Mathematics', 11, 'pcm', 'Calculator', 'purple'),
-- PCB subjects for Class 11 (Physics and Chemistry are common)
('Physics', 11, 'pcb', 'Atom', 'blue'),
('Chemistry', 11, 'pcb', 'FlaskConical', 'green'),
('Biology', 11, 'pcb', 'Dna', 'teal');

-- Insert subjects for Class 12
INSERT INTO public.subjects (name, class_level, stream, icon, color) VALUES
-- PCM subjects for Class 12
('Physics', 12, 'pcm', 'Atom', 'blue'),
('Chemistry', 12, 'pcm', 'FlaskConical', 'green'),
('Mathematics', 12, 'pcm', 'Calculator', 'purple'),
-- PCB subjects for Class 12
('Physics', 12, 'pcb', 'Atom', 'blue'),
('Chemistry', 12, 'pcb', 'FlaskConical', 'green'),
('Biology', 12, 'pcb', 'Dna', 'teal');

-- ===========================
-- CLASS 11 PHYSICS CHAPTERS (PCM)
-- ===========================
DO $$
DECLARE
    physics_11_pcm_id UUID;
BEGIN
    SELECT id INTO physics_11_pcm_id FROM public.subjects WHERE name = 'Physics' AND class_level = 11 AND stream = 'pcm' LIMIT 1;
    
    INSERT INTO public.chapters (subject_id, name, chapter_number, summary, content) VALUES
    (physics_11_pcm_id, 'Physical World', 1, 
     'Introduction to Physics and its scope, nature of physical laws, and the fundamental forces of nature.',
     E'Physics is the study of nature and natural phenomena. It deals with the basic laws of nature and their manifestations.\n\nScope of Physics:\nPhysics is a fundamental science that studies matter, energy, and their interactions. It covers a wide range of phenomena from the microscopic (atoms, molecules) to the macroscopic (planets, galaxies).\n\nFundamental Forces:\n1. Gravitational Force: Acts between all masses\n2. Electromagnetic Force: Acts between charged particles\n3. Strong Nuclear Force: Holds nucleons together in nucleus\n4. Weak Nuclear Force: Responsible for radioactive decay\n\nNature of Physical Laws:\nPhysical laws are universal, precise, and simple. They can be expressed mathematically and are verified through experiments.\n\nPhysics and Technology:\nPhysics has contributed immensely to technology - from electricity to computers, from medical imaging to communication systems.'
    ),
    (physics_11_pcm_id, 'Units and Measurements', 2,
     'Understanding the SI system, measurement techniques, dimensional analysis, and significant figures.',
     E'Measurement is the process of comparing a physical quantity with a standard unit.\n\nSI Units (International System):\nBase Units:\n- Length: metre (m)\n- Mass: kilogram (kg)\n- Time: second (s)\n- Electric Current: ampere (A)\n- Temperature: kelvin (K)\n- Amount of Substance: mole (mol)\n- Luminous Intensity: candela (cd)\n\nDimensional Analysis:\nDimensions are powers to which fundamental quantities are raised to represent a derived quantity.\nFor example: [Force] = [M L T⁻²]\n\nUses of Dimensional Analysis:\n1. Check correctness of equations\n2. Derive relations between physical quantities\n3. Convert units from one system to another\n\nErrors in Measurement:\n1. Systematic Errors: Instrumental, environmental\n2. Random Errors: Due to unknown causes\n\nSignificant Figures:\nRules for counting significant figures help express precision of measurements.'
    ),
    (physics_11_pcm_id, 'Motion in a Straight Line', 3,
     'Concepts of displacement, velocity, acceleration, and equations of motion for uniformly accelerated motion.',
     E'Kinematics deals with motion of objects without considering the cause of motion.\n\nBasic Concepts:\n1. Position: Location of object with respect to origin\n2. Displacement: Change in position (vector quantity)\n3. Velocity: Rate of change of displacement\n4. Acceleration: Rate of change of velocity\n\nTypes of Motion:\n- Uniform Motion: Constant velocity\n- Non-uniform Motion: Variable velocity\n\nEquations of Motion (Uniform Acceleration):\n1. v = u + at\n2. s = ut + ½at²\n3. v² = u² + 2as\n\nWhere:\nv = final velocity\nu = initial velocity\na = acceleration\nt = time\ns = displacement\n\nGraphical Representation:\n- Position-Time Graph\n- Velocity-Time Graph\n- Acceleration-Time Graph\n\nRelative Velocity:\nVelocity of one object with respect to another moving object.'
    ),
    (physics_11_pcm_id, 'Motion in a Plane', 4,
     'Study of motion in two dimensions, projectile motion, and circular motion.',
     E'Motion in a plane involves movement in two dimensions (x and y).\n\nVector Addition:\n- Triangle Law\n- Parallelogram Law\n- Resolution of vectors into components\n\nProjectile Motion:\nCombination of horizontal (uniform) and vertical (uniformly accelerated) motion.\n\nKey Equations:\n- Time of Flight: T = 2u sinθ/g\n- Maximum Height: H = u² sin²θ/2g\n- Range: R = u² sin2θ/g\n\nWhere:\nu = initial velocity\nθ = angle of projection\ng = acceleration due to gravity\n\nCircular Motion:\nMotion along a circular path.\n\nKey Concepts:\n- Angular Displacement: θ (radians)\n- Angular Velocity: ω = dθ/dt\n- Centripetal Acceleration: a = v²/r = ω²r\n- Centripetal Force: F = mv²/r\n\nUniform Circular Motion:\nSpeed is constant but velocity changes (direction changes).\n\nApplications:\n- Planetary motion\n- Motion of satellites\n- Banking of roads'
    );
END $$;

-- ===========================
-- CLASS 11 PHYSICS CHAPTERS (PCB) - Same as PCM
-- ===========================
DO $$
DECLARE
    physics_11_pcb_id UUID;
BEGIN
    SELECT id INTO physics_11_pcb_id FROM public.subjects WHERE name = 'Physics' AND class_level = 11 AND stream = 'pcb' LIMIT 1;
    
    INSERT INTO public.chapters (subject_id, name, chapter_number, summary, content) VALUES
    (physics_11_pcb_id, 'Physical World', 1, 
     'Introduction to Physics and its scope, nature of physical laws, and the fundamental forces of nature.',
     E'Physics is the study of nature and natural phenomena. It deals with the basic laws of nature and their manifestations.\n\nScope of Physics:\nPhysics is a fundamental science that studies matter, energy, and their interactions. It covers a wide range of phenomena from the microscopic (atoms, molecules) to the macroscopic (planets, galaxies).\n\nFundamental Forces:\n1. Gravitational Force: Acts between all masses\n2. Electromagnetic Force: Acts between charged particles\n3. Strong Nuclear Force: Holds nucleons together in nucleus\n4. Weak Nuclear Force: Responsible for radioactive decay\n\nNature of Physical Laws:\nPhysical laws are universal, precise, and simple. They can be expressed mathematically and are verified through experiments.\n\nPhysics and Technology:\nPhysics has contributed immensely to technology - from electricity to computers, from medical imaging to communication systems.'
    ),
    (physics_11_pcb_id, 'Units and Measurements', 2,
     'Understanding the SI system, measurement techniques, dimensional analysis, and significant figures.',
     E'Measurement is the process of comparing a physical quantity with a standard unit.\n\nSI Units (International System):\nBase Units:\n- Length: metre (m)\n- Mass: kilogram (kg)\n- Time: second (s)\n- Electric Current: ampere (A)\n- Temperature: kelvin (K)\n- Amount of Substance: mole (mol)\n- Luminous Intensity: candela (cd)\n\nDimensional Analysis:\nDimensions are powers to which fundamental quantities are raised to represent a derived quantity.\nFor example: [Force] = [M L T⁻²]\n\nUses of Dimensional Analysis:\n1. Check correctness of equations\n2. Derive relations between physical quantities\n3. Convert units from one system to another\n\nErrors in Measurement:\n1. Systematic Errors: Instrumental, environmental\n2. Random Errors: Due to unknown causes\n\nSignificant Figures:\nRules for counting significant figures help express precision of measurements.'
    ),
    (physics_11_pcb_id, 'Motion in a Straight Line', 3,
     'Concepts of displacement, velocity, acceleration, and equations of motion for uniformly accelerated motion.',
     E'Kinematics deals with motion of objects without considering the cause of motion.\n\nBasic Concepts:\n1. Position: Location of object with respect to origin\n2. Displacement: Change in position (vector quantity)\n3. Velocity: Rate of change of displacement\n4. Acceleration: Rate of change of velocity\n\nTypes of Motion:\n- Uniform Motion: Constant velocity\n- Non-uniform Motion: Variable velocity\n\nEquations of Motion (Uniform Acceleration):\n1. v = u + at\n2. s = ut + ½at²\n3. v² = u² + 2as\n\nWhere:\nv = final velocity\nu = initial velocity\na = acceleration\nt = time\ns = displacement\n\nGraphical Representation:\n- Position-Time Graph\n- Velocity-Time Graph\n- Acceleration-Time Graph\n\nRelative Velocity:\nVelocity of one object with respect to another moving object.'
    ),
    (physics_11_pcb_id, 'Motion in a Plane', 4,
     'Study of motion in two dimensions, projectile motion, and circular motion.',
     E'Motion in a plane involves movement in two dimensions (x and y).\n\nVector Addition:\n- Triangle Law\n- Parallelogram Law\n- Resolution of vectors into components\n\nProjectile Motion:\nCombination of horizontal (uniform) and vertical (uniformly accelerated) motion.\n\nKey Equations:\n- Time of Flight: T = 2u sinθ/g\n- Maximum Height: H = u² sin²θ/2g\n- Range: R = u² sin2θ/g\n\nWhere:\nu = initial velocity\nθ = angle of projection\ng = acceleration due to gravity\n\nCircular Motion:\nMotion along a circular path.\n\nKey Concepts:\n- Angular Displacement: θ (radians)\n- Angular Velocity: ω = dθ/dt\n- Centripetal Acceleration: a = v²/r = ω²r\n- Centripetal Force: F = mv²/r\n\nUniform Circular Motion:\nSpeed is constant but velocity changes (direction changes).\n\nApplications:\n- Planetary motion\n- Motion of satellites\n- Banking of roads'
    );
END $$;

-- ===========================
-- CLASS 11 CHEMISTRY CHAPTERS (PCM)
-- ===========================
DO $$
DECLARE
    chemistry_11_pcm_id UUID;
BEGIN
    SELECT id INTO chemistry_11_pcm_id FROM public.subjects WHERE name = 'Chemistry' AND class_level = 11 AND stream = 'pcm' LIMIT 1;
    
    INSERT INTO public.chapters (subject_id, name, chapter_number, summary, content) VALUES
    (chemistry_11_pcm_id, 'Some Basic Concepts of Chemistry', 1,
     'Introduction to chemistry, matter, measurement, atomic and molecular masses, and stoichiometry.',
     E'Chemistry is the science that deals with the composition, structure, and properties of matter.\n\nImportance of Chemistry:\nChemistry plays a central role in science and technology. It is involved in agriculture, health, medicine, materials, energy, and environment.\n\nNature of Matter:\n- Matter: Anything that has mass and occupies space\n- Classification: Solid, Liquid, Gas\n\nLaws of Chemical Combination:\n1. Law of Conservation of Mass (Lavoisier)\n2. Law of Definite Proportions (Proust)\n3. Law of Multiple Proportions (Dalton)\n\nAtomic and Molecular Masses:\n- Atomic Mass Unit (amu): 1/12th mass of C-12 atom\n- Molecular Mass: Sum of atomic masses\n\nMole Concept:\n- 1 mole = 6.022 × 10²³ particles (Avogadro''s Number)\n- Molar Mass: Mass of one mole of substance\n\nStoichiometry:\nQuantitative relationships between reactants and products in chemical reactions.\n\nPercentage Composition:\nMass percentage of each element in a compound.'
    ),
    (chemistry_11_pcm_id, 'Structure of Atom', 2,
     'Discovery of subatomic particles, atomic models, quantum mechanical model, and electronic configuration.',
     E'The atom is the smallest particle of an element that retains its chemical properties.\n\nSubatomic Particles:\n1. Electron: Discovered by J.J. Thomson (cathode ray experiment)\n2. Proton: Discovered by Rutherford\n3. Neutron: Discovered by Chadwick\n\nAtomic Models:\n1. Thomson''s Model: Plum pudding model\n2. Rutherford''s Model: Nuclear model\n3. Bohr''s Model: Energy levels\n4. Quantum Mechanical Model: Orbitals\n\nBohr''s Model:\n- Electrons revolve in fixed orbits\n- Energy is quantized\n- E = -13.6/n² eV (for hydrogen)\n\nQuantum Numbers:\n1. Principal (n): Energy level\n2. Azimuthal (l): Shape of orbital\n3. Magnetic (m): Orientation\n4. Spin (s): Spin direction\n\nElectronic Configuration:\nArrangement of electrons in orbitals.\n\nRules:\n1. Aufbau Principle: Lower energy orbitals filled first\n2. Pauli Exclusion Principle: Maximum 2 electrons per orbital\n3. Hund''s Rule: Maximum multiplicity\n\nOrbital Notation: 1s² 2s² 2p⁶...'
    ),
    (chemistry_11_pcm_id, 'Classification of Elements and Periodicity', 3,
     'Development of periodic table, periodic trends, and properties of elements.',
     E'The Periodic Table arranges elements in order of increasing atomic number.\n\nHistorical Development:\n1. Dobereiner''s Triads\n2. Newlands'' Law of Octaves\n3. Mendeleev''s Periodic Law (based on atomic mass)\n4. Modern Periodic Law (based on atomic number)\n\nModern Periodic Table:\n- 18 Groups (vertical columns)\n- 7 Periods (horizontal rows)\n- s, p, d, f blocks\n\nPeriodic Trends:\n\n1. Atomic Radius:\n- Decreases across period (left to right)\n- Increases down group\n\n2. Ionization Energy:\n- Energy required to remove electron\n- Increases across period\n- Decreases down group\n\n3. Electron Affinity:\n- Energy released when electron is added\n- Generally increases across period\n\n4. Electronegativity:\n- Ability to attract electrons\n- Increases across period\n- Decreases down group\n\n5. Metallic Character:\n- Decreases across period\n- Increases down group\n\nValence and Oxidation States:\nDetermined by electronic configuration.'
    ),
    (chemistry_11_pcm_id, 'Chemical Bonding and Molecular Structure', 4,
     'Types of chemical bonds, Lewis structures, VSEPR theory, and molecular orbital theory.',
     E'Chemical bonding explains how atoms combine to form molecules.\n\nTypes of Chemical Bonds:\n\n1. Ionic Bond:\n- Transfer of electrons\n- Between metal and non-metal\n- Example: NaCl\n- Properties: High melting point, conducts electricity in solution\n\n2. Covalent Bond:\n- Sharing of electrons\n- Between non-metals\n- Types: Single, Double, Triple\n- Example: H₂, O₂, N₂\n\n3. Coordinate Covalent Bond:\n- Both electrons from same atom\n- Example: NH₃-BF₃\n\nLewis Structures:\nRepresentation showing bonding and lone pairs.\n\nOctet Rule:\nAtoms tend to achieve 8 electrons in valence shell.\n\nVSEPR Theory:\nValence Shell Electron Pair Repulsion\nPredicts molecular geometry based on electron pair repulsion.\n\nShapes:\n- Linear: 180°\n- Trigonal Planar: 120°\n- Tetrahedral: 109.5°\n- Trigonal Bipyramidal: 90°, 120°\n- Octahedral: 90°\n\nHybridization:\nMixing of atomic orbitals to form hybrid orbitals.\n- sp: Linear\n- sp²: Trigonal planar\n- sp³: Tetrahedral\n\nMolecular Orbital Theory:\nCombination of atomic orbitals forms molecular orbitals.\nBond Order = (Nb - Na)/2'
    );
END $$;

-- ===========================
-- CLASS 11 CHEMISTRY CHAPTERS (PCB) - Same as PCM
-- ===========================
DO $$
DECLARE
    chemistry_11_pcb_id UUID;
BEGIN
    SELECT id INTO chemistry_11_pcb_id FROM public.subjects WHERE name = 'Chemistry' AND class_level = 11 AND stream = 'pcb' LIMIT 1;
    
    INSERT INTO public.chapters (subject_id, name, chapter_number, summary, content) VALUES
    (chemistry_11_pcb_id, 'Some Basic Concepts of Chemistry', 1,
     'Introduction to chemistry, matter, measurement, atomic and molecular masses, and stoichiometry.',
     E'Chemistry is the science that deals with the composition, structure, and properties of matter.\n\nImportance of Chemistry:\nChemistry plays a central role in science and technology. It is involved in agriculture, health, medicine, materials, energy, and environment.\n\nNature of Matter:\n- Matter: Anything that has mass and occupies space\n- Classification: Solid, Liquid, Gas\n\nLaws of Chemical Combination:\n1. Law of Conservation of Mass (Lavoisier)\n2. Law of Definite Proportions (Proust)\n3. Law of Multiple Proportions (Dalton)\n\nAtomic and Molecular Masses:\n- Atomic Mass Unit (amu): 1/12th mass of C-12 atom\n- Molecular Mass: Sum of atomic masses\n\nMole Concept:\n- 1 mole = 6.022 × 10²³ particles (Avogadro''s Number)\n- Molar Mass: Mass of one mole of substance\n\nStoichiometry:\nQuantitative relationships between reactants and products in chemical reactions.\n\nPercentage Composition:\nMass percentage of each element in a compound.'
    ),
    (chemistry_11_pcb_id, 'Structure of Atom', 2,
     'Discovery of subatomic particles, atomic models, quantum mechanical model, and electronic configuration.',
     E'The atom is the smallest particle of an element that retains its chemical properties.\n\nSubatomic Particles:\n1. Electron: Discovered by J.J. Thomson (cathode ray experiment)\n2. Proton: Discovered by Rutherford\n3. Neutron: Discovered by Chadwick\n\nAtomic Models:\n1. Thomson''s Model: Plum pudding model\n2. Rutherford''s Model: Nuclear model\n3. Bohr''s Model: Energy levels\n4. Quantum Mechanical Model: Orbitals\n\nBohr''s Model:\n- Electrons revolve in fixed orbits\n- Energy is quantized\n- E = -13.6/n² eV (for hydrogen)\n\nQuantum Numbers:\n1. Principal (n): Energy level\n2. Azimuthal (l): Shape of orbital\n3. Magnetic (m): Orientation\n4. Spin (s): Spin direction\n\nElectronic Configuration:\nArrangement of electrons in orbitals.\n\nRules:\n1. Aufbau Principle: Lower energy orbitals filled first\n2. Pauli Exclusion Principle: Maximum 2 electrons per orbital\n3. Hund''s Rule: Maximum multiplicity\n\nOrbital Notation: 1s² 2s² 2p⁶...'
    ),
    (chemistry_11_pcb_id, 'Classification of Elements and Periodicity', 3,
     'Development of periodic table, periodic trends, and properties of elements.',
     E'The Periodic Table arranges elements in order of increasing atomic number.\n\nHistorical Development:\n1. Dobereiner''s Triads\n2. Newlands'' Law of Octaves\n3. Mendeleev''s Periodic Law (based on atomic mass)\n4. Modern Periodic Law (based on atomic number)\n\nModern Periodic Table:\n- 18 Groups (vertical columns)\n- 7 Periods (horizontal rows)\n- s, p, d, f blocks\n\nPeriodic Trends:\n\n1. Atomic Radius:\n- Decreases across period (left to right)\n- Increases down group\n\n2. Ionization Energy:\n- Energy required to remove electron\n- Increases across period\n- Decreases down group\n\n3. Electron Affinity:\n- Energy released when electron is added\n- Generally increases across period\n\n4. Electronegativity:\n- Ability to attract electrons\n- Increases across period\n- Decreases down group\n\n5. Metallic Character:\n- Decreases across period\n- Increases down group\n\nValence and Oxidation States:\nDetermined by electronic configuration.'
    ),
    (chemistry_11_pcb_id, 'Chemical Bonding and Molecular Structure', 4,
     'Types of chemical bonds, Lewis structures, VSEPR theory, and molecular orbital theory.',
     E'Chemical bonding explains how atoms combine to form molecules.\n\nTypes of Chemical Bonds:\n\n1. Ionic Bond:\n- Transfer of electrons\n- Between metal and non-metal\n- Example: NaCl\n- Properties: High melting point, conducts electricity in solution\n\n2. Covalent Bond:\n- Sharing of electrons\n- Between non-metals\n- Types: Single, Double, Triple\n- Example: H₂, O₂, N₂\n\n3. Coordinate Covalent Bond:\n- Both electrons from same atom\n- Example: NH₃-BF₃\n\nLewis Structures:\nRepresentation showing bonding and lone pairs.\n\nOctet Rule:\nAtoms tend to achieve 8 electrons in valence shell.\n\nVSEPR Theory:\nValence Shell Electron Pair Repulsion\nPredicts molecular geometry based on electron pair repulsion.\n\nShapes:\n- Linear: 180°\n- Trigonal Planar: 120°\n- Tetrahedral: 109.5°\n- Trigonal Bipyramidal: 90°, 120°\n- Octahedral: 90°\n\nHybridization:\nMixing of atomic orbitals to form hybrid orbitals.\n- sp: Linear\n- sp²: Trigonal planar\n- sp³: Tetrahedral\n\nMolecular Orbital Theory:\nCombination of atomic orbitals forms molecular orbitals.\nBond Order = (Nb - Na)/2'
    );
END $$;

-- Continue with Mathematics and Biology in the next comment due to character limit...
