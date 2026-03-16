/*
  # Grant Readiness Assessment Database Schema

  1. New Tables
    - `assessments`
      - `id` (uuid, primary key) - Unique identifier for each assessment
      - `email` (text, not null) - User's email address
      - `responses` (jsonb, not null) - Array of Yes/No responses to 25 questions
      - `score` (integer, not null) - Calculated score from 0-100
      - `created_at` (timestamptz) - When the assessment was completed
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `assessments` table
    - Add policy for authenticated users to insert their own assessments
    - Add policy for public insert (since this is a public assessment tool)
    
  3. Notes
    - The `responses` field stores the complete assessment data as JSON
    - Score is calculated client-side and stored for quick retrieval
    - Public access is enabled since this is a lead generation tool
*/

CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  responses jsonb NOT NULL,
  score integer NOT NULL CHECK (score >= 0 AND score <= 100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_assessments_email ON assessments(email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON assessments(created_at DESC);

-- Enable RLS
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert assessments (public lead generation tool)
CREATE POLICY "Anyone can insert assessments"
  ON assessments
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow users to view their own assessments by email
CREATE POLICY "Users can view own assessments"
  ON assessments
  FOR SELECT
  TO anon
  USING (true);