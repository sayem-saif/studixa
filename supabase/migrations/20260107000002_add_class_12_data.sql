-- Part 3: Class 12 content for all subjects

-- ===========================
-- CLASS 12 PHYSICS CHAPTERS (PCM)
-- ===========================
DO $$
DECLARE
    physics_12_pcm_id UUID;
BEGIN
    SELECT id INTO physics_12_pcm_id FROM public.subjects WHERE name = 'Physics' AND class_level = 12 AND stream = 'pcm' LIMIT 1;
    
    INSERT INTO public.chapters (subject_id, name, chapter_number, summary, content) VALUES
    (physics_12_pcm_id, 'Electric Charges and Fields', 1,
     'Electrostatics, Coulomb''s law, electric field, and Gauss''s law.',
     E'Electrostatics deals with stationary electric charges and their interactions.\n\nElectric Charge:\n- Two types: Positive and Negative\n- Like charges repel, unlike charges attract\n- SI Unit: Coulomb (C)\n- Charge is quantized: Q = ne (e = 1.6 × 10⁻¹⁹ C)\n\nProperties of Charge:\n1. Additive nature\n2. Conservation of charge\n3. Quantization\n\nMethods of Charging:\n1. Friction\n2. Conduction\n3. Induction\n\nCoulomb''s Law:\nForce between two point charges:\nF = k(q₁q₂)/r²\nWhere k = 9 × 10⁹ Nm²/C²\n\nElectric Field:\nForce per unit charge\nE = F/q = kQ/r²\nDirection: Away from positive, towards negative charge\n\nElectric Field Lines:\n- Start from positive charge\n- End at negative charge\n- Never intersect\n- Density indicates field strength\n\nElectric Dipole:\nTwo equal and opposite charges separated by small distance\nDipole moment: p = q × 2a\n\nGauss''s Law:\nElectric flux through closed surface = Charge enclosed/ε₀\nΦ = Q/ε₀\n\nApplications:\n- Field due to infinite plane sheet\n- Field due to charged sphere\n- Field inside conductor is zero'
    ),
    (physics_12_pcm_id, 'Electrostatic Potential and Capacitance', 2,
     'Electric potential, potential difference, capacitors, and combinations of capacitors.',
     E'Electric Potential is work done to bring unit positive charge from infinity to a point.\n\nElectric Potential:\nV = W/q = kQ/r\nSI Unit: Volt (V)\n\nPotential Difference:\nWork done to move unit charge between two points\nV = V₁ - V₂\n\nRelation between E and V:\nE = -dV/dr\nElectric field is negative gradient of potential\n\nEquipotential Surfaces:\n- Potential is same at all points\n- No work done in moving charge along surface\n- Perpendicular to electric field lines\n\nPotential Energy:\nU = qV = kq₁q₂/r\n\nCapacitor:\nDevice to store electric charge and energy\n\nCapacitance:\nC = Q/V\nSI Unit: Farad (F)\n\nParallel Plate Capacitor:\nC = ε₀A/d\nWhere:\nA = area of plates\nd = separation between plates\n\nEffect of Dielectric:\nC = Kε₀A/d\nK = dielectric constant\n\nEnergy Stored:\nU = ½CV² = ½Q²/C = ½QV\n\nCombinations:\n1. Series:\n   1/C = 1/C₁ + 1/C₂ + ...\n\n2. Parallel:\n   C = C₁ + C₂ + ...\n\nApplications:\n- Energy storage\n- Tuning circuits\n- Power factor correction\n- Filters'
    ),
    (physics_12_pcm_id, 'Current Electricity', 3,
     'Electric current, Ohm''s law, resistance, resistivity, and electrical circuits.',
     E'Current Electricity deals with flow of electric charges.\n\nElectric Current:\nRate of flow of charge\nI = Q/t\nSI Unit: Ampere (A)\n\nDrift Velocity:\nAverage velocity of charge carriers\nI = neAvd\n\nOhm''s Law:\nV = IR\nWhere:\nV = Potential difference\nI = Current\nR = Resistance\n\nResistance:\nOpposition to flow of current\nR = ρL/A\nWhere:\nρ = resistivity\nL = length\nA = area of cross-section\n\nFactors Affecting Resistance:\n1. Length: R ∝ L\n2. Area: R ∝ 1/A\n3. Material: R ∝ ρ\n4. Temperature: R = R₀(1 + αΔT)\n\nCombinations of Resistors:\n1. Series:\n   R = R₁ + R₂ + ...\n   Same current, different voltages\n\n2. Parallel:\n   1/R = 1/R₁ + 1/R₂ + ...\n   Same voltage, different currents\n\nKirchhoff''s Laws:\n1. Junction Law (KCL):\n   Sum of currents entering = Sum leaving\n   ΣI = 0\n\n2. Loop Law (KVL):\n   Sum of voltages in closed loop = 0\n   ΣV = 0\n\nWheatstone Bridge:\nBalanced condition: P/Q = R/S\n\nElectric Power:\nP = VI = I²R = V²/R\nSI Unit: Watt (W)\n\nElectrical Energy:\nE = Pt = VIt\nSI Unit: Joule (J)\nCommercial Unit: kWh'
    ),
    (physics_12_pcm_id, 'Moving Charges and Magnetism', 4,
     'Magnetic force on moving charges, Biot-Savart law, Ampere''s law, and magnetic materials.',
     E'Magnetism arises from moving electric charges.\n\nMagnetic Force:\nForce on moving charge in magnetic field:\nF = qvB sinθ\nDirection: Fleming''s Left Hand Rule\n\nLorentz Force:\nF = q(E + v × B)\nCombined electric and magnetic force\n\nMotion in Magnetic Field:\n- If v ⊥ B: Circular motion\n  Radius: r = mv/qB\n  Period: T = 2πm/qB\n\n- If v ∥ B: Straight line\n- If at angle: Helical path\n\nForce on Current-Carrying Conductor:\nF = BIL sinθ\n\nBiot-Savart Law:\nMagnetic field due to current element:\ndB = (μ₀/4π) × (I dL × r)/r³\n\nApplications:\n1. Field due to straight wire:\n   B = μ₀I/2πr\n\n2. Field at center of circular loop:\n   B = μ₀I/2R\n\n3. Field due to solenoid:\n   B = μ₀nI\n\nAmpere''s Circuital Law:\n∮B·dL = μ₀Ienc\n\nForce Between Parallel Currents:\nF/L = μ₀I₁I₂/2πd\nParallel currents attract\nAntiparallel currents repel\n\nTorque on Current Loop:\nτ = NIAB sinθ\nMagnetic moment: M = NIA\n\nMoving Coil Galvanometer:\nMeasures small currents\nDeflection ∝ Current\n\nConversion to Ammeter:\nLow resistance in parallel (shunt)\n\nConversion to Voltmeter:\nHigh resistance in series'
    );
END $$;

-- ===========================
-- CLASS 12 PHYSICS CHAPTERS (PCB) - Same as PCM
-- ===========================
DO $$
DECLARE
    physics_12_pcb_id UUID;
BEGIN
    SELECT id INTO physics_12_pcb_id FROM public.subjects WHERE name = 'Physics' AND class_level = 12 AND stream = 'pcb' LIMIT 1;
    
    INSERT INTO public.chapters (subject_id, name, chapter_number, summary, content) VALUES
    (physics_12_pcb_id, 'Electric Charges and Fields', 1,
     'Electrostatics, Coulomb''s law, electric field, and Gauss''s law.',
     E'Electrostatics deals with stationary electric charges and their interactions.\n\nElectric Charge:\n- Two types: Positive and Negative\n- Like charges repel, unlike charges attract\n- SI Unit: Coulomb (C)\n- Charge is quantized: Q = ne (e = 1.6 × 10⁻¹⁹ C)\n\nProperties of Charge:\n1. Additive nature\n2. Conservation of charge\n3. Quantization\n\nMethods of Charging:\n1. Friction\n2. Conduction\n3. Induction\n\nCoulomb''s Law:\nForce between two point charges:\nF = k(q₁q₂)/r²\nWhere k = 9 × 10⁹ Nm²/C²\n\nElectric Field:\nForce per unit charge\nE = F/q = kQ/r²\nDirection: Away from positive, towards negative charge\n\nElectric Field Lines:\n- Start from positive charge\n- End at negative charge\n- Never intersect\n- Density indicates field strength\n\nElectric Dipole:\nTwo equal and opposite charges separated by small distance\nDipole moment: p = q × 2a\n\nGauss''s Law:\nElectric flux through closed surface = Charge enclosed/ε₀\nΦ = Q/ε₀\n\nApplications:\n- Field due to infinite plane sheet\n- Field due to charged sphere\n- Field inside conductor is zero'
    ),
    (physics_12_pcb_id, 'Electrostatic Potential and Capacitance', 2,
     'Electric potential, potential difference, capacitors, and combinations of capacitors.',
     E'Electric Potential is work done to bring unit positive charge from infinity to a point.\n\nElectric Potential:\nV = W/q = kQ/r\nSI Unit: Volt (V)\n\nPotential Difference:\nWork done to move unit charge between two points\nV = V₁ - V₂\n\nRelation between E and V:\nE = -dV/dr\nElectric field is negative gradient of potential\n\nEquipotential Surfaces:\n- Potential is same at all points\n- No work done in moving charge along surface\n- Perpendicular to electric field lines\n\nPotential Energy:\nU = qV = kq₁q₂/r\n\nCapacitor:\nDevice to store electric charge and energy\n\nCapacitance:\nC = Q/V\nSI Unit: Farad (F)\n\nParallel Plate Capacitor:\nC = ε₀A/d\nWhere:\nA = area of plates\nd = separation between plates\n\nEffect of Dielectric:\nC = Kε₀A/d\nK = dielectric constant\n\nEnergy Stored:\nU = ½CV² = ½Q²/C = ½QV\n\nCombinations:\n1. Series:\n   1/C = 1/C₁ + 1/C₂ + ...\n\n2. Parallel:\n   C = C₁ + C₂ + ...\n\nApplications:\n- Energy storage\n- Tuning circuits\n- Power factor correction\n- Filters'
    ),
    (physics_12_pcb_id, 'Current Electricity', 3,
     'Electric current, Ohm''s law, resistance, resistivity, and electrical circuits.',
     E'Current Electricity deals with flow of electric charges.\n\nElectric Current:\nRate of flow of charge\nI = Q/t\nSI Unit: Ampere (A)\n\nDrift Velocity:\nAverage velocity of charge carriers\nI = neAvd\n\nOhm''s Law:\nV = IR\nWhere:\nV = Potential difference\nI = Current\nR = Resistance\n\nResistance:\nOpposition to flow of current\nR = ρL/A\nWhere:\nρ = resistivity\nL = length\nA = area of cross-section\n\nFactors Affecting Resistance:\n1. Length: R ∝ L\n2. Area: R ∝ 1/A\n3. Material: R ∝ ρ\n4. Temperature: R = R₀(1 + αΔT)\n\nCombinations of Resistors:\n1. Series:\n   R = R₁ + R₂ + ...\n   Same current, different voltages\n\n2. Parallel:\n   1/R = 1/R₁ + 1/R₂ + ...\n   Same voltage, different currents\n\nKirchhoff''s Laws:\n1. Junction Law (KCL):\n   Sum of currents entering = Sum leaving\n   ΣI = 0\n\n2. Loop Law (KVL):\n   Sum of voltages in closed loop = 0\n   ΣV = 0\n\nWheatstone Bridge:\nBalanced condition: P/Q = R/S\n\nElectric Power:\nP = VI = I²R = V²/R\nSI Unit: Watt (W)\n\nElectrical Energy:\nE = Pt = VIt\nSI Unit: Joule (J)\nCommercial Unit: kWh'
    ),
    (physics_12_pcb_id, 'Moving Charges and Magnetism', 4,
     'Magnetic force on moving charges, Biot-Savart law, Ampere''s law, and magnetic materials.',
     E'Magnetism arises from moving electric charges.\n\nMagnetic Force:\nForce on moving charge in magnetic field:\nF = qvB sinθ\nDirection: Fleming''s Left Hand Rule\n\nLorentz Force:\nF = q(E + v × B)\nCombined electric and magnetic force\n\nMotion in Magnetic Field:\n- If v ⊥ B: Circular motion\n  Radius: r = mv/qB\n  Period: T = 2πm/qB\n\n- If v ∥ B: Straight line\n- If at angle: Helical path\n\nForce on Current-Carrying Conductor:\nF = BIL sinθ\n\nBiot-Savart Law:\nMagnetic field due to current element:\ndB = (μ₀/4π) × (I dL × r)/r³\n\nApplications:\n1. Field due to straight wire:\n   B = μ₀I/2πr\n\n2. Field at center of circular loop:\n   B = μ₀I/2R\n\n3. Field due to solenoid:\n   B = μ₀nI\n\nAmpere''s Circuital Law:\n∮B·dL = μ₀Ienc\n\nForce Between Parallel Currents:\nF/L = μ₀I₁I₂/2πd\nParallel currents attract\nAntiparallel currents repel\n\nTorque on Current Loop:\nτ = NIAB sinθ\nMagnetic moment: M = NIA\n\nMoving Coil Galvanometer:\nMeasures small currents\nDeflection ∝ Current\n\nConversion to Ammeter:\nLow resistance in parallel (shunt)\n\nConversion to Voltmeter:\nHigh resistance in series'
    );
END $$;

-- Continue with Chemistry, Math, and Biology Class 12...
