/*
  # Fix Security Issues

  1. Security Improvements
    - Replace overly permissive RLS policies with proper validation
    - Add email validation to prevent abuse
    - Ensure only valid emails can be inserted
    
  2. Performance Optimizations
    - Remove unused indexes (idx_assessments_email, idx_assessments_created_at)
    - These indexes were not being used by queries
    
  3. Notes
    - The new INSERT policy validates email format to prevent spam
    - The SELECT policy is restricted to prevent data leakage
    - Auth connection strategy should be configured in Supabase dashboard
*/

-- Drop unused indexes
DROP INDEX IF EXISTS idx_assessments_email;
DROP INDEX IF EXISTS idx_assessments_created_at;

-- Drop the insecure policies
DROP POLICY IF EXISTS "Anyone can insert assessments" ON assessments;
DROP POLICY IF EXISTS "Users can view own assessments" ON assessments;

-- Create secure INSERT policy with email validation
CREATE POLICY "Public can insert valid assessments"
  ON assessments
  FOR INSERT
  TO anon
  WITH CHECK (
    -- Validate email format (basic check)
    email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    AND
    -- Ensure responses is not null or empty
    responses IS NOT NULL
    AND
    -- Ensure score is within valid range
    score >= 0 AND score <= 100
    AND
    -- Ensure name and organization are provided
    name IS NOT NULL AND name != ''
    AND
    organization IS NOT NULL AND organization != ''
  );

-- Users cannot view assessments (they get results immediately, no need to query)
-- If you need users to retrieve their results later, implement authenticated access
CREATE POLICY "No public select access"
  ON assessments
  FOR SELECT
  TO anon
  USING (false);

-- Only service role can view all assessments (for admin purposes)
CREATE POLICY "Service role full access"
  ON assessments
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
