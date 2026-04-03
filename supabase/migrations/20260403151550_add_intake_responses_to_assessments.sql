/*
  # Add Intake Responses to Assessments Table

  1. Changes
    - Add `intake_responses` column to `assessments` table
      - Stores the funding pathway intake questionnaire responses
      - JSONB type to store the structured intake data
      - Contains: organizationType, fundingType, yearsInOperation, annualRevenue, pastPerformance
    
  2. Security
    - No changes to RLS policies needed
    - Existing policies will cover the new column
    
  3. Notes
    - Column is nullable to maintain compatibility with existing records
    - New assessments will include intake_responses data
*/

-- Add intake_responses column to assessments table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'assessments' AND column_name = 'intake_responses'
  ) THEN
    ALTER TABLE assessments ADD COLUMN intake_responses JSONB;
  END IF;
END $$;
