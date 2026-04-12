🚀 STUDIXA — PERFORMANCE INTELLIGENCE SYSTEM

Built: April 12, 2026

---

## 📋 WHAT WAS BUILT

Studixa has been transformed from a content platform into a PERFORMANCE INTELLIGENCE SYSTEM with three core modules:

### 1️⃣ PERFORMANCE ENGINE
**File:** src/components/school/PerformanceEngine.tsx
**Purpose:** Analyze quiz data and identify weak/strong topics

**Features:**
- Tracks all quiz attempts in `performance_logs` table
- Classifies topics as:
  - 🔴 Weak (< 50% accuracy)
  - 🟡 Medium (50-75% accuracy)
  - 🟢 Strong (> 75% accuracy)
- Shows overall accuracy across all subjects
- Lists weak topics needing improvement
- Lists strong topics to build on
- Subject-wise performance breakdown

**Data Flow:**
1. Student takes quiz → QuizSection logs to `performance_logs`
2. PerformanceEngine reads `performance_logs`
3. AI categorizes topics by accuracy
4. Shows as "Performance" tab in dashboard

---

### 2️⃣ PROGRESS INTELLIGENCE
**File:** src/components/school/ProgressIntelligence.tsx
**Purpose:** Track trends and show improvement over time

**Features:**
- Compares overall vs. weekly performance
- Detects improvement trends (📈 up, 📉 down)
- Shows which subjects improved this week
- Weekly activity summary (quiz attempts per day)
- Highlights declining performance areas
- Celebrates improvements

**Data Flow:**
1. Fetches all `performance_logs` for user
2. Calculates weekly vs. overall accuracy
3. Computes improvement trends
4. Shows as "Trends" tab in dashboard

---

### 3️⃣ PREDICTION ENGINE
**File:** src/components/school/PredictionEngine.tsx
**Purpose:** Predict exam scores and identify improvement areas

**Features:**
- Calculates predicted exam score using formula:
  `predicted_score = (avg_accuracy * 0.4) + (recent_accuracy * 0.4) + (consistency * 0.2)`
- Adjusts prediction based on improvement trend
- Shows confidence level (based on attempts and consistency)
- Predicts score ranges (margin of error ±10%)
- Recommends specific improvements for each subject
- Suggests target score to aim for

**Formula Breakdown:**
- 40% weight: Overall historical accuracy
- 40% weight: Recent performance (last 5 quizzes)
- 20% weight: Consistency (lower variation = higher confidence)
- +Adjustment: Improvement trend over time

**Data Flow:**
1. Fetches recent performance logs
2. Calculates weighted accuracy metrics
3. Computes consistency and trend
4. Generates prediction with confidence
5. Shows as "Prediction" tab in dashboard

---

## 🗄️ DATABASE STRUCTURE

### New Table: `performance_logs`
```sql
CREATE TABLE performance_logs (
  id UUID PRIMARY KEY,
  user_id UUID,              -- Which student
  user_type TEXT,            -- 'school' or 'college'
  subject_id UUID,           -- Which subject
  chapter_id UUID,           -- Which chapter (optional)
  topic_name TEXT,           -- Topic being assessed
  quiz_id UUID,              -- Which quiz
  score INTEGER,             -- Points scored
  total_questions INTEGER,   -- Total questions
  accuracy DECIMAL,          -- Percentage (0-100)
  time_taken INTEGER,        -- Seconds
  difficulty TEXT,           -- 'easy', 'medium', 'hard'
  attempt_number INTEGER,    -- 1st, 2nd, 3rd attempt
  performance_level TEXT,    -- 'weak', 'medium', 'strong' (AUTO)
  created_at TIMESTAMP
);
```

**Indexes for fast queries:**
- By user_id (filter by student)
- By subject_id (filter by subject)
- By performance_level (find weak topics)
- By created_at (recent quizzes first)

---

## 🔄 DATA FLOW (COMPLETE PIPELINE)

```
Student Takes Quiz
    ↓
QuizSection.tsx logs to performance_logs
    ↓
Performance Engine reads logs
    ↓
Classifies as: Weak | Medium | Strong
    ↓
AI Mentor uses this data
    ↓
Shows recommendations
    ↓
Progress Intelligence tracks trends
    ↓
Prediction Engine predicts scores
    ↓
Student sees actionable insights
```

---

## 🎯 SCHOOL DASHBOARD TABS (New Order)

1. **Subjects** - Browse and study by subject
2. **Performance** (NEW) - See weak/strong topics
3. **Trends** (NEW) - Track weekly improvements
4. **Prediction** (NEW) - See predicted exam scores
5. **AI Mentor** (ENHANCED) - Now shows your weak areas
6. **Quiz** - Take quizzes
7. [Summarizer, Progress hidden to reduce clutter]

---

## 📊 AI MENTOR ENHANCEMENTS

**File:** src/components/school/AIMentor.tsx

**What Changed:**
- Now fetches weak topics from `performance_logs`
- Shows personalized welcome message:
  ```
  Based on your recent performance, I noticed you're struggling with:
  • Organic Chemistry
  • Probability  
  • Electrostatics
  
  Let me help you master these topics!
  ```
- AI responses can now reference student's specific weak areas
- Provides targeted study suggestions

---

## 🏗️ TECHNICAL ARCHITECTURE

### Frontend Components

```
src/components/school/
├── PerformanceEngine.tsx      (Overall accuracy, weak/strong topics)
├── ProgressIntelligence.tsx   (Trends, weekly improvement)
├── PredictionEngine.tsx       (Score prediction, recommendations)
├── AIMentor.tsx              (ENHANCED with performance data)
└── QuizSection.tsx           (UPDATED to log performance data)

src/pages/
└── SchoolDashboard.tsx       (UPDATED with 3 new tabs)
```

### Data Flow

```
performance_logs table (Supabase)
    ↓
[Viewed by 3 smart components]
    ├→ PerformanceEngine (real-time weak/strong)
    ├→ ProgressIntelligence (trends over time)
    ├→ PredictionEngine (predictions + recommendations)
    └→ AIMentor (performance-aware guidance)
```

---

## 💾 HOW DATA IS LOGGED

When a student completes a quiz in `QuizSection.tsx`:

```typescript
const percentage = Math.round((score / questions.length) * 100);

await supabase.from("performance_logs").insert({
  user_id: session.user.id,
  user_type: profile?.user_type,    // 'school'
  subject_id: subjectId,
  chapter_id: chapter?.id,
  topic_name: chapter?.name,
  accuracy: percentage,              // e.g., 85% → 85
  score: score,                      // e.g., 8.5/10
  total_questions: questions.length,
  time_taken: timeTakenSeconds,
  difficulty: "medium"
});
```

**Automatic Field (SQL Generated):**
```sql
performance_level = CASE
  WHEN accuracy < 50 THEN 'weak'
  WHEN accuracy <= 75 THEN 'medium'
  WHEN accuracy > 75 THEN 'strong'
END
```

---

## 🎓 EXAMPLE USER JOURNEY

### Day 1: Student takes quizzes

- Math quiz: 75% → Medium
- Physics quiz: 45% → Weak  
- Chemistry quiz: 85% → Strong

### Day 2: Checks Performance tab

Sees:
- ⚠️ Physics is weak - focus here!
- 💪 Chemistry is strong - keep it up
- Overall: 68% accuracy

### Day 3: Checks Prediction tab

Sees:
- Expected score in Maths: 72-78%
- Expected score in Physics: 48-58%
- Expected score in Chemistry: 82-90%
- Recommendation: "Improve Physics fundamentals"

### Day 4: Opens AI Mentor

AI says:
```
⚠️ Based on your recent performance, I noticed you're struggling with:
• Newton's Laws
• Circular Motion
• Wave Optics

Let me help you master these topics!
```

Student asks: "Explain Newton's Laws"
AI gives focused explanation.

---

## 📈 KEY METRICS TRACKED

For each quiz attempt, we now capture:

1. **Accuracy** - % of questions correct
2. **Speed** - Time taken per quiz
3. **Consistency** - How variable are your scores?
4. **Trend** - Are you improving or declining?
5. **Topic-level data** - What specific topic was weak?
6. **Confidence** - How sure are we in the prediction?

---

## 🔐 PRIVACY & SECURITY

- All performance data is **user-specific** (RLS enabled)
- Students can only see their own data
- Data stored in Supabase with full encryption
- Performance logs tied to auth.users(id)

---

## 🚀 NEXT STEPS (OPTIONAL)

### For College Students

The same system can work for college:
1. Map skills/subjects → performance_logs
2. Track problem-solving practice → log accuracy
3. Predict placement readiness based on performance
4. Recommend DSA/system design topics to focus on

### For Advanced Features

1. **Compare with Peers** - "You're in 75th percentile"
2. **AI-Generated Study Plans** - "Here's your personalized study schedule"
3. **Smart Notifications** - "You're weak in Physics - practice more!"
4. **Spaced Repetition** - Recommend when to revisit weak topics
5. **Visualization** - Performance heatmaps by day/week

---

## ♻️ MIGRATION & DEPLOYMENT

Run this migration to create the performance_logs table:

```bash
# Applies migration 20260108000002_create_performance_logs_table.sql
supabase migration up
```

---

## 📝 TESTING CHECKLIST

- [ ] Quiz logs performance data ✓
- [ ] Performance Engine shows weak/strong topics ✓
- [ ] Progress Intelligence shows trends ✓
- [ ] Prediction Engine calculates accurate scores ✓
- [ ] AI Mentor mentions weak areas ✓
- [ ] All 3 tabs visible in School Dashboard ✓
- [ ] Performance level formula works correctly ✓
- [ ] Data is user-specific (no data leakage) ✓

---

## 🎯 CORE VISION ACHIEVED

✅ **Before:** Platform that served content
✅ **After:** Intelligence system that helps students improve

Studixa now answers:
- "What am I weak in?" → Performance Engine
- "Am I improving?" → Progress Intelligence
- "What will I score?" → Prediction Engine
- "How do I improve?" → AI Mentor (performance-aware)

**Studixa is now a DECISION ENGINE for students.**

---

Built by: Performance Intelligence System v1.0
Date: April 12, 2026
