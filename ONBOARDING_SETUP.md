# Onboarding System - Quick Setup Guide

## ⚠️ Important: Database Setup Required

Before the onboarding system can work, you **must** create the database table in Supabase.

## Setup Steps

### 1. Open Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click on **SQL Editor** in the left sidebar

### 2. Run the Migration
1. Open the file `supabase/onboarding-schema.sql` in your code editor
2. Copy **all** the contents (Ctrl+A, Ctrl+C)
3. Paste into the Supabase SQL Editor
4. Click **Run** (or press Ctrl+Enter)

### 3. Verify Setup
Run this query to verify the table was created:
```sql
SELECT * FROM onboarding_data;
```

You should see an empty table with these columns:
- `id`
- `user_id`
- `role`
- `experience_level`
- `tech_stack`
- `primary_language`
- `goals`
- `github_username`
- `notification_preferences`
- `preferred_language`
- `current_step`
- `completed_at`
- `skipped_at`
- `created_at`
- `updated_at`

## Error: "Onboarding table does not exist"

If you see this error in the console:
```
Error creating onboarding data: Onboarding table does not exist
```

**Solution:** You forgot to run Step 2 above! Go to Supabase SQL Editor and run the migration.

## What the Migration Does

The `onboarding-schema.sql` file creates:
1. ✅ `onboarding_data` table with all required columns
2. ✅ Row Level Security (RLS) policies for user data protection
3. ✅ Indexes for fast queries
4. ✅ Trigger for auto-updating `updated_at` timestamp
5. ✅ Constraints to ensure data integrity

## Testing After Setup

1. **Sign up** with a new test account
2. You should be **automatically redirected** to `/onboarding`
3. Complete or skip the onboarding flow
4. Check the data in Supabase:
   ```sql
   SELECT * FROM onboarding_data WHERE user_id = 'YOUR_USER_ID';
   ```

## Troubleshooting

### Error: "permission denied for table onboarding_data"
**Cause:** RLS policies not applied correctly  
**Solution:** Run the migration again, ensure all SQL commands executed

### Error: "relation 'onboarding_data' does not exist"
**Cause:** Table not created  
**Solution:** Run the migration in Supabase SQL Editor

### Error: "duplicate key value violates unique constraint"
**Cause:** User already has onboarding data  
**Solution:** This is normal! The system will fetch existing data automatically

### Onboarding modal doesn't appear after signup
**Causes:**
1. Migration not run (table doesn't exist)
2. User already completed onboarding
3. Auth callback not updated

**Solution:**
1. Verify table exists in Supabase
2. Check console for errors
3. Delete test user's onboarding data:
   ```sql
   DELETE FROM onboarding_data WHERE user_id = 'YOUR_USER_ID';
   ```

## Need Help?

1. Check browser console for detailed error messages
2. Check Supabase logs: Dashboard → Logs → Postgres Logs
3. Review `ONBOARDING_SYSTEM_GUIDE.md` for full documentation

---

**Status Check:**
- [ ] Opened Supabase SQL Editor
- [ ] Ran `supabase/onboarding-schema.sql`
- [ ] Verified table exists
- [ ] Tested signup flow
- [ ] Onboarding modal appears ✅

Once all boxes are checked, the onboarding system is ready to use! 🎉
