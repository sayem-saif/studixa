-- Part 2: Mathematics Class 11, Biology Class 11, and Class 12 content

-- ===========================
-- CLASS 11 MATHEMATICS CHAPTERS (PCM only)
-- ===========================
DO $$
DECLARE
    math_11_id UUID;
BEGIN
    SELECT id INTO math_11_id FROM public.subjects WHERE name = 'Mathematics' AND class_level = 11 AND stream = 'pcm' LIMIT 1;
    
    INSERT INTO public.chapters (subject_id, name, chapter_number, summary, content) VALUES
    (math_11_id, 'Sets', 1,
     'Introduction to sets, types of sets, operations on sets, and Venn diagrams.',
     E'A set is a well-defined collection of distinct objects.\n\nNotation:\n- Capital letters for sets: A, B, C\n- Small letters for elements: a, b, c\n- a ∈ A means "a belongs to A"\n\nTypes of Sets:\n1. Empty Set (∅): Set with no elements\n2. Finite Set: Limited number of elements\n3. Infinite Set: Unlimited elements\n4. Singleton Set: Exactly one element\n5. Universal Set (U): Set containing all objects under consideration\n\nRepresentation:\n1. Roster Form: A = {1, 2, 3, 4}\n2. Set-builder Form: A = {x | x is a natural number less than 5}\n\nSubsets:\nA ⊆ B if every element of A is in B\n\nOperations on Sets:\n1. Union: A ∪ B = {x | x ∈ A or x ∈ B}\n2. Intersection: A ∩ B = {x | x ∈ A and x ∈ B}\n3. Difference: A - B = {x | x ∈ A and x ∉ B}\n4. Complement: A'' = {x | x ∈ U and x ∉ A}\n\nVenn Diagrams:\nGraphical representation of sets and their relationships.\n\nDe Morgan''s Laws:\n1. (A ∪ B)'' = A'' ∩ B''\n2. (A ∩ B)'' = A'' ∪ B''\n\nCardinality:\nn(A ∪ B) = n(A) + n(B) - n(A ∩ B)'
    ),
    (math_11_id, 'Relations and Functions', 2,
     'Understanding relations, types of relations, functions, and types of functions.',
     E'Relations and functions are fundamental concepts connecting elements of different sets.\n\nRelation:\nA relation R from set A to set B is a subset of A × B.\n\nTypes of Relations:\n1. Empty Relation: R = ∅\n2. Universal Relation: R = A × A\n3. Reflexive: (a, a) ∈ R for all a ∈ A\n4. Symmetric: If (a, b) ∈ R, then (b, a) ∈ R\n5. Transitive: If (a, b) ∈ R and (b, c) ∈ R, then (a, c) ∈ R\n6. Equivalence: Reflexive, Symmetric, and Transitive\n\nFunction:\nA relation f from A to B is a function if every element of A has exactly one image in B.\n\nNotation: f: A → B\n\nDomain: Set A (input values)\nCodomain: Set B\nRange: Set of actual outputs\n\nTypes of Functions:\n1. One-One (Injective): Different elements have different images\n2. Onto (Surjective): Range = Codomain\n3. Bijective: Both one-one and onto\n\nComposition of Functions:\n(fog)(x) = f(g(x))\n\nInverse Function:\nIf f: A → B is bijective, then f⁻¹: B → A exists\nf(f⁻¹(x)) = x and f⁻¹(f(x)) = x'
    ),
    (math_11_id, 'Trigonometric Functions', 3,
     'Angle measurements, trigonometric ratios, identities, and graphs of trigonometric functions.',
     E'Trigonometry deals with relationships between angles and sides of triangles.\n\nAngle Measurement:\n1. Degree: 360° = one complete revolution\n2. Radian: 2π radians = 360°\n   1 radian = 180°/π\n\nTrigonometric Ratios:\nFor angle θ in right triangle:\n- sin θ = Opposite/Hypotenuse\n- cos θ = Adjacent/Hypotenuse\n- tan θ = Opposite/Adjacent\n- cot θ = 1/tan θ\n- sec θ = 1/cos θ\n- cosec θ = 1/sin θ\n\nFundamental Identities:\n1. sin²θ + cos²θ = 1\n2. 1 + tan²θ = sec²θ\n3. 1 + cot²θ = cosec²θ\n\nSign Convention:\nQuadrant I: All positive\nQuadrant II: Sin positive\nQuadrant III: Tan positive\nQuadrant IV: Cos positive\n\nCompound Angles:\nsin(A ± B) = sinA cosB ± cosA sinB\ncos(A ± B) = cosA cosB ∓ sinA sinB\ntan(A ± B) = (tanA ± tanB)/(1 ∓ tanA tanB)\n\nMultiple Angles:\nsin 2A = 2 sinA cosA\ncos 2A = cos²A - sin²A = 2cos²A - 1 = 1 - 2sin²A\n\nGraphs:\nPeriodic nature of trigonometric functions with specific periods and ranges.'
    ),
    (math_11_id, 'Principle of Mathematical Induction', 4,
     'Method of proof by mathematical induction and its applications.',
     E'Mathematical Induction is a technique for proving statements about natural numbers.\n\nPrinciple:\nTo prove P(n) is true for all natural numbers n ≥ 1:\n\nStep 1: Base Case\nProve P(1) is true.\n\nStep 2: Inductive Hypothesis\nAssume P(k) is true for some natural number k.\n\nStep 3: Inductive Step\nProve P(k+1) is true using the assumption P(k).\n\nConclusion:\nIf steps 1-3 are completed, then P(n) is true for all n ≥ 1.\n\nExample:\nProve: 1 + 2 + 3 + ... + n = n(n+1)/2\n\nBase Case (n=1):\nLHS = 1\nRHS = 1(1+1)/2 = 1\nLHS = RHS ✓\n\nInductive Hypothesis:\nAssume true for n = k:\n1 + 2 + ... + k = k(k+1)/2\n\nInductive Step (n = k+1):\n1 + 2 + ... + k + (k+1)\n= k(k+1)/2 + (k+1)  [using hypothesis]\n= (k+1)[k/2 + 1]\n= (k+1)(k+2)/2\n= (k+1)((k+1)+1)/2 ✓\n\nApplications:\n- Proving summation formulas\n- Divisibility problems\n- Inequalities\n- Sequence and series problems'
    );
END $$;

-- ===========================
-- CLASS 11 BIOLOGY CHAPTERS (PCB only)
-- ===========================
DO $$
DECLARE
    biology_11_id UUID;
BEGIN
    SELECT id INTO biology_11_id FROM public.subjects WHERE name = 'Biology' AND class_level = 11 AND stream = 'pcb' LIMIT 1;
    
    INSERT INTO public.chapters (subject_id, name, chapter_number, summary, content) VALUES
    (biology_11_id, 'The Living World', 1,
     'Diversity in living organisms, classification, nomenclature, and taxonomic categories.',
     E'Biology is the study of living organisms and their interactions with the environment.\n\nCharacteristics of Living Organisms:\n1. Growth: Increase in mass and number of cells\n2. Reproduction: Production of offspring\n3. Metabolism: Sum of chemical reactions\n4. Cellular Organization: Made of cells\n5. Consciousness: Response to stimuli\n\nBiodiversity:\nVariety of life forms on Earth.\n\nTaxonomy:\nScience of classification of organisms.\n\nNomenclature:\nBinomial system by Carolus Linnaeus\n- Generic name (Genus)\n- Specific epithet (Species)\nExample: Homo sapiens\n\nTaxonomic Hierarchy (Categories):\n1. Kingdom (highest)\n2. Phylum/Division\n3. Class\n4. Order\n5. Family\n6. Genus\n7. Species (lowest)\n\nMnemonic: King Philip Came Over For Good Soup\n\nFive Kingdom Classification (R.H. Whittaker):\n1. Monera: Prokaryotic, unicellular\n2. Protista: Eukaryotic, mostly unicellular\n3. Fungi: Eukaryotic, heterotrophic\n4. Plantae: Eukaryotic, autotrophic\n5. Animalia: Eukaryotic, heterotrophic\n\nTaxonomic Aids:\n- Herbarium: Preserved plant specimens\n- Museum: Preserved specimens\n- Botanical Gardens\n- Zoological Parks\n- Key: Aid for identification'
    ),
    (biology_11_id, 'Biological Classification', 2,
     'Five kingdom classification system and characteristics of each kingdom.',
     E'Classification organizes organisms based on shared characteristics.\n\nKingdom Monera:\n- Prokaryotic cells (no nucleus)\n- Unicellular\n- Examples: Bacteria, Cyanobacteria\n- Bacteria types:\n  * Autotrophic (chemosynthetic, photosynthetic)\n  * Heterotrophic (decomposers, parasites)\n\nKingdom Protista:\n- Eukaryotic, mostly unicellular\n- Aquatic organisms\n- Examples: Amoeba, Paramecium, Euglena\n- Types:\n  * Chrysophytes (diatoms)\n  * Dinoflagellates\n  * Euglenoids\n  * Slime moulds\n  * Protozoans\n\nKingdom Fungi:\n- Eukaryotic, heterotrophic\n- Cell wall made of chitin\n- Saprophytic nutrition\n- Examples: Yeast, Mushroom, Penicillium\n- Reproduction: Spores\n- Types:\n  * Phycomycetes\n  * Ascomycetes\n  * Basidiomycetes\n  * Deuteromycetes\n\nKingdom Plantae:\n- Eukaryotic, multicellular\n- Autotrophic (photosynthesis)\n- Cell wall made of cellulose\n- Classification:\n  * Algae\n  * Bryophytes (amphibians of plant kingdom)\n  * Pteridophytes (first vascular plants)\n  * Gymnosperms (naked seeds)\n  * Angiosperms (flowering plants)\n\nKingdom Animalia:\n- Eukaryotic, multicellular\n- Heterotrophic\n- No cell wall\n- Classification based on:\n  * Symmetry\n  * Coelom\n  * Segmentation\n  * Notochord\n\nViruses:\n- Not included in any kingdom\n- Non-cellular\n- Obligate parasites\n- Inert outside host'
    ),
    (biology_11_id, 'Plant Kingdom', 3,
     'Classification of plants including algae, bryophytes, pteridophytes, gymnosperms, and angiosperms.',
     E'Plant kingdom includes all photosynthetic eukaryotes.\n\nAlgae:\n- Simple, autotrophic, aquatic\n- Thallus organization (no root, stem, leaf)\n- Types: Green algae, Brown algae, Red algae\n- Pigments: Chlorophyll, carotenoids, phycobilins\n- Reproduction: Vegetative, asexual, sexual\n\nBryophytes:\n- "Amphibians of plant kingdom"\n- Need water for reproduction\n- No vascular tissue (xylem, phloem)\n- Gametophyte dominant\n- Examples: Moss, Liverwort, Hornwort\n- First land plants\n\nPteridophytes:\n- First vascular plants\n- Sporophyte dominant\n- No seeds\n- Examples: Ferns, Horsetails\n- Require water for fertilization\n\nGymnosperms:\n- "Naked seed plants"\n- Seeds not enclosed in fruit\n- Heterosporous\n- Examples: Pinus, Cycas, Ginkgo\n- Mostly evergreen, perennial, woody\n- Tap root system\n\nAngiosperms:\n- "Flowering plants"\n- Seeds enclosed in fruit\n- Most advanced and diverse\n- Two classes:\n  1. Dicotyledons (2 cotyledons)\n     - Reticulate venation\n     - Tap root\n     - Tetramerous/Pentamerous flowers\n  2. Monocotyledons (1 cotyledon)\n     - Parallel venation\n     - Fibrous root\n     - Trimerous flowers\n\nPlant Life Cycle:\nAlternation of generations between diploid sporophyte and haploid gametophyte.'
    ),
    (biology_11_id, 'Animal Kingdom', 4,
     'Classification of animals based on various criteria and characteristics of major phyla.',
     E'Animal kingdom includes all multicellular, heterotrophic eukaryotes.\n\nBasis of Classification:\n1. Levels of Organization:\n   - Cellular: Sponges\n   - Tissue: Coelenterates\n   - Organ: Platyhelminthes\n   - Organ System: Higher animals\n\n2. Symmetry:\n   - Asymmetrical: Sponges\n   - Radial: Coelenterates\n   - Bilateral: Most animals\n\n3. Germ Layers:\n   - Diploblastic: 2 layers (Coelenterates)\n   - Triploblastic: 3 layers (Higher animals)\n\n4. Coelom:\n   - Acoelomate: No coelom (Flatworms)\n   - Pseudocoelomate: False coelom (Roundworms)\n   - Coelomate: True coelom (Annelids onwards)\n\nMajor Phyla:\n\n1. Porifera (Sponges):\n   - Pore-bearing\n   - Aquatic, sessile\n   - Canal system\n\n2. Coelenterata (Cnidaria):\n   - Cnidoblasts (stinging cells)\n   - Radial symmetry\n   - Examples: Hydra, Jellyfish\n\n3. Platyhelminthes (Flatworms):\n   - Bilateral symmetry\n   - Acoelomate\n   - Examples: Planaria, Tapeworm\n\n4. Nematoda (Roundworms):\n   - Pseudocoelomate\n   - Cylindrical body\n   - Example: Ascaris\n\n5. Annelida:\n   - Segmented worms\n   - Coelomate\n   - Examples: Earthworm, Leech\n\n6. Arthropoda:\n   - Largest phylum\n   - Jointed appendages\n   - Exoskeleton (chitin)\n   - Examples: Insects, Spiders, Crabs\n\n7. Mollusca:\n   - Soft-bodied\n   - Examples: Snail, Octopus\n\n8. Echinodermata:\n   - Spiny skin\n   - Marine\n   - Examples: Starfish, Sea urchin\n\n9. Chordata:\n   - Notochord\n   - Dorsal nerve cord\n   - Includes all vertebrates'
    );
END $$;
