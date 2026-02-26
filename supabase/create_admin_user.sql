-- =============================================
-- FARIO ADMIN USER CREATION SCRIPT
-- =============================================
-- Run this in Supabase SQL Editor (csyiiks instance)
-- URL: https://supabase.com/dashboard/project/csyiiksxpmbehiiovlbg/editor

-- STEP 1: Check if user exists and current role
SELECT id, email, role, createdat, updatedat 
FROM profiles 
WHERE email = 'kreateuptech@gmail.com';

-- STEP 2: Make kreateuptech@gmail.com an admin
-- NOTE: User must register in the app FIRST before running this
UPDATE profiles 
SET 
  role = 'admin', 
  updatedat = NOW() 
WHERE email = 'kreateuptech@gmail.com';

-- STEP 3: Verify admin was created successfully
SELECT email, role, updatedat 
FROM profiles 
WHERE role = 'admin';

-- Expected Result: kreateuptech@gmail.com | admin | [timestamp]

-- =============================================
-- TROUBLESHOOTING
-- =============================================
-- If UPDATE affects 0 rows, the user hasn't registered yet:
-- 1. Go to: https://techkreateup.github.io/fario-ecommerce-app/#/
-- 2. Click "Register" 
-- 3. Email: kreateuptech@gmail.com
-- 4. Set password
-- 5. Complete registration
-- 6. Then run STEP 2 again
