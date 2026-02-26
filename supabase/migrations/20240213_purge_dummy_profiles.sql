-- =============================================
-- FARIO: Purge Dummy Data
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. DELETE DUMMY PROFILES
-- Deletes all profiles assuming they are the dummy ones seeded earlier.
-- KEEPS the user with email 'kreateuptech@gmail.com' (Admin) or any specific ID you want to save.
-- Adjust the WHERE clause if you have other real users to keep.

DELETE FROM profiles
WHERE email NOT IN ('kreateuptech@gmail.com', 'admin@fario.in');

-- Note: specific tables like 'orders', 'reviews', 'returns' that reference profiles
-- might block deletion if ON DELETE CASCADE isn't set.
-- If so, delete from them first:

-- DELETE FROM orders WHERE user_id IN (SELECT id FROM profiles WHERE email NOT IN ('kreateuptech@gmail.com'));
-- DELETE FROM reviews WHERE user_id IN (SELECT id FROM profiles WHERE email NOT IN ('kreateuptech@gmail.com'));
-- DELETE FROM returns WHERE user_id IN (SELECT id FROM profiles WHERE email NOT IN ('kreateuptech@gmail.com'));
