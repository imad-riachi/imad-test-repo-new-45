-- Add is_active column to job_descriptions table
ALTER TABLE job_descriptions ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE; 