-- Add Maintenance Mode to Settings Table
ALTER TABLE public.settings
ADD COLUMN IF NOT EXISTS is_maintenance_mode BOOLEAN DEFAULT FALSE;
