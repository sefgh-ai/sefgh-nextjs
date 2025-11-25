# Onboarding System Implementation - Complete Guide

## Overview
A comprehensive SaaS-style onboarding system for SEFGH that collects user information through an interactive 5-step modal flow. The system integrates with Supabase authentication and provides personalized onboarding based on user roles, tech stacks, goals, and preferences.

## Features
- ✅ **5-Step Interactive Flow**: Role selection, tech stack, goals, GitHub integration, and preferences
- ✅ **Progress Tracking**: Visual progress bar and step indicators
- ✅ **Skip Functionality**: Users can skip onboarding with reminder banner
- ✅ **Resume Capability**: Partial progress is saved and can be resumed
- ✅ **Auto-Redirect**: New users automatically redirected from auth callback
- ✅ **Reminder Banner**: Shown to users who skipped onboarding
- ✅ **Database Integration**: All data stored in Supabase with RLS policies
- ✅ **Mobile Responsive**: Full mobile support with touch-friendly UI

## Implementation Details

### 1. Database Schema (`supabase/onboarding-schema.sql`)

**Table: `onboarding_data`**
```sql
CREATE TABLE onboarding_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text,
  experience_level text,
  tech_stack jsonb,
  primary_language text,
  goals text[],
  github_username text,
  notification_preferences text,
  preferred_language text,
  current_step integer DEFAULT 1,
  completed_at timestamptz,
  skipped_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);
```

**Key Features:**
- Enforces one onboarding per user (UNIQUE constraint)
- Cascading delete when user is deleted
- RLS policies scoped to `auth.uid()`
- Automatic `updated_at` timestamp trigger
- Indexes on `user_id` and `completed_at` for performance

**Setup Instructions:**
1. Open Supabase SQL Editor
2. Copy and paste the entire `supabase/onboarding-schema.sql` file
3. Execute the SQL to create table, policies, indexes, and triggers
4. Verify with: `SELECT * FROM onboarding_data;`

### 2. Helper Functions (`src/lib/supabase/onboarding.js`)

**Available Functions:**

1. **`getOnboardingData(userId)`**
   - Retrieves onboarding data for a user
   - Returns: `{ role, experience_level, tech_stack, ... }` or `null`

2. **`createOnboardingData(userId)`**
   - Creates initial onboarding record
   - Sets `current_step = 1`

3. **`updateOnboardingData(userId, data)`**
   - Updates onboarding fields
   - Automatically updates `updated_at` timestamp

4. **`saveStepRole(userId, role, experienceLevel)`**
   - Saves Step 1 data
   - Advances to `current_step = 2`

5. **`saveStepTechStack(userId, techStack, primaryLanguage)`**
   - Saves Step 2 data (array of tech objects)
   - Advances to `current_step = 3`

6. **`saveStepGoals(userId, goals)`**
   - Saves Step 3 data (array of goal strings)
   - Advances to `current_step = 4`

7. **`saveStepGitHub(userId, githubUsername)`**
   - Saves Step 4 data (optional)
   - Advances to `current_step = 5`

8. **`saveStepPreferences(userId, notificationPrefs, preferredLanguage)`**
   - Saves Step 5 data
   - Sets `completed_at` timestamp

9. **`completeOnboarding(userId)`**
   - Marks onboarding as complete
   - Sets `completed_at = now()`

10. **`skipOnboarding(userId)`**
    - Marks onboarding as skipped
    - Sets `skipped_at = now()`

11. **`needsOnboarding(userId)`**
    - Checks if user needs onboarding
    - Returns `true` if not completed/skipped
    - Returns `false` if completed or skipped

**Usage Example:**
```javascript
import { saveStepRole, needsOnboarding } from '@/lib/supabase/onboarding'

// Save step data
await saveStepRole(user.id, 'professional', 'intermediate')

// Check if user needs onboarding
const requires = await needsOnboarding(user.id)
if (requires) {
  router.push('/onboarding')
}
```

### 3. Onboarding Page (`src/app/onboarding/page.js`)

**Route:** `/onboarding`

**Features:**
- Protected route (requires authentication)
- Loads existing onboarding data on mount
- Creates new onboarding record if none exists
- Manages step navigation via URL params (`?step=1`)
- Redirects to `/home` when completed
- Handles skip and completion actions

**URL Parameters:**
- `?step=1` - Role selection
- `?step=2` - Tech stack
- `?step=3` - Goals
- `?step=4` - GitHub username
- `?step=5` - Preferences

**State Management:**
```javascript
const [currentStep, setCurrentStep] = useState(1)
const [formData, setFormData] = useState({
  role: '',
  experienceLevel: '',
  techStack: [],
  primaryLanguage: '',
  goals: [],
  githubUsername: '',
  notificationPreferences: 'all',
  preferredLanguage: 'en'
})
```

### 4. Onboarding Modal (`src/components/onboarding/OnboardingModal.jsx`)

**Props:**
- `isOpen` (boolean) - Controls modal visibility
- `currentStep` (number) - Current step (1-5)
- `totalSteps` (number) - Total steps (default: 5)
- `onSkip` (function) - Called when user clicks skip
- `children` (ReactNode) - Step component content

**Features:**
- Glass-premium styled modal dialog
- 5-dot progress indicator
- Skip button (hidden on final step)
- Non-dismissible (user must complete or skip)
- Mobile responsive design

**Progress Indicator:**
- Filled dots: Completed steps (primary color)
- Current dot: Larger with ring animation
- Future dots: Muted color

### 5. Onboarding Steps

#### **Step 1: Role Selection** (`StepRole.jsx`)
**Data Collected:**
- `role`: student | professional | researcher | hobbyist
- `experience_level`: beginner | intermediate | advanced

**UI:**
- 4 role cards with icons (GraduationCap, Briefcase, FlaskConical, Code)
- 3 experience level buttons (pill-shaped)
- Next button (disabled until both selected)

**Save Function:**
```javascript
await saveStepRole(user.id, formData.role, formData.experienceLevel)
```

#### **Step 2: Tech Stack** (`StepTechStack.jsx`)
**Data Collected:**
- `tech_stack`: Array of `{ name, category, icon }` objects
- `primary_language`: Single tech name

**Categories:**
- Frontend: React, Vue.js, Angular, Svelte, Next.js
- Backend: Node.js, Python, Java, Go, Ruby
- Mobile: React Native, Flutter, Swift, Kotlin
- DevOps: Docker, Kubernetes, CI/CD, AWS, Azure
- AI/ML: TensorFlow, PyTorch, Scikit-learn, OpenAI
- Databases: PostgreSQL, MongoDB, MySQL, Redis

**UI:**
- Multi-select badge buttons (6 categories)
- Primary language selector (single select)
- Next/Back navigation

**Save Function:**
```javascript
await saveStepTechStack(user.id, formData.techStack, formData.primaryLanguage)
```

#### **Step 3: Goals** (`StepGoals.jsx`)
**Data Collected:**
- `goals`: Array of strings (learning | finding-tools | contributing | research)

**UI:**
- 4 goal cards with icons (BookOpen, Search, GitPullRequest, FlaskConical)
- Multi-select (minimum 1 required)
- Next/Back navigation

**Save Function:**
```javascript
await saveStepGoals(user.id, formData.goals)
```

#### **Step 4: GitHub Integration** (`StepGitHub.jsx`)
**Data Collected:**
- `github_username`: String (optional)

**UI:**
- GitHub icon branding
- Text input for username
- "Why connect?" info card (3 benefits)
- Skip/Next buttons

**Save Function:**
```javascript
await saveStepGitHub(user.id, formData.githubUsername || '')
```

#### **Step 5: Preferences** (`StepPreferences.jsx`)
**Data Collected:**
- `notification_preferences`: all | important | digest | none
- `preferred_language`: en | es | fr | de | ja | zh | hi | te

**UI:**
- 4 notification option cards with icons
- Language selector with flag emojis
- Success completion card
- Back/Complete buttons

**Save Function:**
```javascript
await saveStepPreferences(
  user.id, 
  formData.notificationPreferences, 
  formData.preferredLanguage
)
await completeOnboarding(user.id)
```

### 6. Auth Callback Integration (`src/app/auth/callback/route.js`)

**Modified Redirect Logic:**
```javascript
// After successful authentication
const { data: { user } } = await supabase.auth.getUser()

if (user) {
  // Check if user needs onboarding
  const requiresOnboarding = await needsOnboarding(user.id)
  
  if (requiresOnboarding) {
    // Get current step if user has partial progress
    const onboardingData = await getOnboardingData(user.id)
    const currentStep = onboardingData?.current_step || 1
    
    // Redirect to onboarding with current step
    return NextResponse.redirect(`${origin}/onboarding?step=${currentStep}`)
  }
}

// User doesn't need onboarding, redirect to next page
return NextResponse.redirect(`${origin}${next}`)
```

**Flow:**
1. User signs up → Auth callback triggered
2. Check `needsOnboarding(user.id)`
3. If `true` → Redirect to `/onboarding?step=X`
4. If `false` → Redirect to `/search` (or `?next` param)

### 7. Onboarding Banner (`src/components/OnboardingBanner.jsx`)

**Purpose:**
- Reminds users who skipped onboarding to complete their profile
- Shown on home page only

**Features:**
- Auto-checks onboarding status on mount
- Dismissible with skip functionality
- Gradient animated background
- Sparkles icon branding
- Two CTAs: "Complete Profile" and "Maybe Later"

**UI:**
- Rounded-2xl card with gradient border
- Animated pulse background
- Responsive layout (stacks on mobile)
- X button to dismiss

**Integration:**
```javascript
// In src/app/home/page.js
import OnboardingBanner from '@/components/OnboardingBanner'

// Add before main content
<OnboardingBanner />
```

**Banner Display Logic:**
```javascript
const [showBanner, setShowBanner] = useState(false)

useEffect(() => {
  async function checkOnboarding() {
    if (user?.id) {
      const requiresOnboarding = await needsOnboarding(user.id)
      setShowBanner(requiresOnboarding)
    }
  }
  checkOnboarding()
}, [user])
```

## User Flow Diagram

```
1. User signs up
   ↓
2. Auth callback checks needsOnboarding()
   ↓
3a. TRUE → Redirect to /onboarding?step=1
    ↓
    Modal opens with Step 1 (Role)
    ↓
    User completes/skips steps
    ↓
    Step 5 completion → completeOnboarding()
    ↓
    Redirect to /home
    
3b. FALSE → Redirect to /search
```

## Skip Flow

```
User clicks "Skip" in modal
   ↓
skipOnboarding(user.id) called
   ↓
Sets skipped_at timestamp
   ↓
Redirect to /home
   ↓
OnboardingBanner appears
   ↓
User can click "Complete Profile" to restart
```

## Resume Flow

```
User partially completes onboarding
   ↓
Closes browser or navigates away
   ↓
Returns to site → Auth callback
   ↓
needsOnboarding() returns TRUE
   ↓
Redirect to /onboarding?step=X (last incomplete step)
   ↓
User continues from where they left off
```

## Testing Checklist

### Database Setup
- [ ] Execute `supabase/onboarding-schema.sql` in Supabase SQL Editor
- [ ] Verify table created: `SELECT * FROM onboarding_data;`
- [ ] Test RLS policies: Insert/select as authenticated user
- [ ] Check indexes: `\d onboarding_data` (shows indexes)

### New User Signup Flow
- [ ] Sign up with new account
- [ ] Verify redirect to `/onboarding?step=1`
- [ ] Complete Step 1 → Should advance to Step 2
- [ ] Complete all steps → Should redirect to `/home`
- [ ] Check database: `SELECT * FROM onboarding_data WHERE user_id = 'xxx';`
- [ ] Verify `completed_at` timestamp is set

### Skip Flow
- [ ] Sign up with new account
- [ ] Click "Skip" in onboarding modal
- [ ] Verify redirect to `/home`
- [ ] Check database: `skipped_at` should be set
- [ ] Verify OnboardingBanner appears on home page
- [ ] Click "Complete Profile" → Should redirect to `/onboarding`

### Resume Flow
- [ ] Sign up, complete Steps 1-3
- [ ] Close browser without completing
- [ ] Sign back in
- [ ] Verify redirect to `/onboarding?step=4`
- [ ] Complete remaining steps
- [ ] Verify `completed_at` set, banner doesn't appear

### Banner Dismissal
- [ ] Skip onboarding
- [ ] See banner on home page
- [ ] Click "Maybe Later" → Banner disappears
- [ ] Refresh page → Banner doesn't reappear (skipped_at persists)
- [ ] Click X button → Same behavior as "Maybe Later"

## File Structure

```
src/
├── app/
│   ├── onboarding/
│   │   └── page.js                 # Main onboarding route
│   └── auth/
│       └── callback/
│           └── route.js            # Auth callback with onboarding check
├── components/
│   ├── OnboardingBanner.jsx        # Home page reminder banner
│   └── onboarding/
│       ├── OnboardingModal.jsx     # Modal container with progress
│       ├── StepRole.jsx            # Step 1: Role & experience
│       ├── StepTechStack.jsx       # Step 2: Tech stack selection
│       ├── StepGoals.jsx           # Step 3: Goals selection
│       ├── StepGitHub.jsx          # Step 4: GitHub integration
│       └── StepPreferences.jsx     # Step 5: Notifications & language
└── lib/
    └── supabase/
        └── onboarding.js           # Database helper functions

supabase/
└── onboarding-schema.sql           # Database schema & RLS policies
```

## Environment Variables

No additional environment variables needed. Uses existing Supabase configuration:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Styling

**Theme:**
- Glass-premium cards with backdrop blur
- GitHub dark theme colors (#0d1117, #21262d)
- Gradient accents (blue-500 to purple-600)
- Lucide React icons throughout

**Responsive Design:**
- Mobile: Single column layout
- Desktop: Centered modal (max-w-3xl)
- Touch-friendly targets (min 44px)
- Scrollable step content

**Animations:**
- Progress dots scale/fade transitions
- Button hover states (glow effects)
- Card hover transformations
- Banner pulse animation

## Best Practices

1. **Data Validation:**
   - Validate on both client and server
   - Use Supabase column constraints
   - RLS policies prevent unauthorized access

2. **Error Handling:**
   - Wrap all Supabase calls in try/catch
   - Show user-friendly error messages with toast
   - Log errors to console for debugging

3. **Performance:**
   - Debounce GitHub username validation
   - Index on frequently queried columns
   - Use `JSONB` for flexible tech_stack data

4. **UX Considerations:**
   - Auto-save progress after each step
   - Show loading states during saves
   - Disable navigation during async operations
   - Provide clear skip option

## Future Enhancements

- [ ] Add conditional steps based on role (e.g., students see education-specific questions)
- [ ] GitHub OAuth integration for auto-filling username
- [ ] AI-powered tech stack recommendations
- [ ] Onboarding analytics dashboard (admin)
- [ ] A/B testing for step variations
- [ ] Email notifications for incomplete onboarding
- [ ] Gamification (badges for completing onboarding)
- [ ] Export onboarding data as user profile PDF

## Troubleshooting

**Issue:** "User not redirected to onboarding after signup"
- Check `src/app/auth/callback/route.js` imports
- Verify `needsOnboarding()` function is working
- Test with `console.log(requiresOnboarding)` before redirect

**Issue:** "Onboarding data not saving"
- Check Supabase RLS policies (must match `auth.uid()`)
- Verify user is authenticated (`useAuth()` returns user)
- Check Network tab for 403 Forbidden errors

**Issue:** "Banner shows for completed users"
- Clear `skipped_at` if user completed later: `UPDATE onboarding_data SET skipped_at = NULL WHERE user_id = 'xxx';`
- Ensure `completed_at` is set on final step

**Issue:** "Current step not resuming correctly"
- Check `current_step` column in database
- Verify `updateOnboardingData()` updates step number
- Test URL param parsing: `searchParams.get('step')`

## Support

For issues or questions:
1. Check this guide first
2. Review Supabase logs (Settings → Logs)
3. Test queries in SQL Editor
4. Check browser console for client-side errors

---

**Implementation Status:** ✅ Complete
**Last Updated:** [Current Date]
**Version:** 1.0.0
