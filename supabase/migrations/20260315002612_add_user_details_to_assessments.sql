/*
  # Add User Details to Assessments

  1. Changes
    - Add `name` column to store user's full name
    - Add `organization` column to store organization name
    - Update existing records to have empty strings for backward compatibility

  2. Notes
    - Existing records will have empty strings for name and organization
    - New assessments will capture this information
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'assessments' AND column_name = 'name'
  ) THEN
    ALTER TABLE assessments ADD COLUMN name text DEFAULT '' NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'assessments' AND column_name = 'organization'
  ) THEN
    ALTER TABLE assessments ADD COLUMN organization text DEFAULT '' NOT NULL;
  END IF;
END $$;
