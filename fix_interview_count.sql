-- Fix total_interview_q AND total_effective_q in app_question_counts
-- total_interview_q  = count of HR + Technical questions in company_topic_questions
-- total_effective_q  = (total_company_topic_q * 2) - total_interview_q

UPDATE app_question_counts
SET
  total_interview_q = (
    SELECT COUNT(*)
    FROM company_topic_questions
    WHERE topic IN ('HR', 'Technical')
  ),
  total_effective_q = (
    total_company_topic_q * 2
  ) - (
    SELECT COUNT(*)
    FROM company_topic_questions
    WHERE topic IN ('HR', 'Technical')
  ),
  updated_at = NOW()
WHERE id = 1;

-- Verify the result
SELECT
  total_company_topic_q,
  total_interview_q,
  total_effective_q,
  updated_at
FROM app_question_counts;
