/*
  # Add Procurement Assessment Fields to Assessments Table

  1. Changes
    - Add `procurement_responses` column to `assessments` table
      - Stores the procurement readiness questionnaire responses
      - JSONB type to store the array of string responses
      - Contains answers to 31 procurement-related questions
    - Add `procurement_score` column to `assessments` table
      - Stores the calculated procurement readiness score (0-100)
      - Integer type
    
  2. Security
    - No changes to RLS policies needed
    - Existing policies will cover the new columns
    
  3. Notes
    - Columns are nullable to maintain compatibility with existing records
    - Grant-only assessments will have null procurement fields
    - Procurement-only assessments will have null grant response fields
    - Dual-path assessments will have both sets of data populated
*/

-- Add procurement_responses column to assessments table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'assessments' AND column_name = 'procurement_responses'
  ) THEN
    ALTER TABLE assessments ADD COLUMN procurement_responses JSONB;
  END IF;
END $$;

-- Add procurement_score column to assessments table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'assessments' AND column_name = 'procurement_score'
  ) THEN
    ALTER TABLE assessments ADD COLUMN procurement_score INTEGER;
  END IF;
END $$;
