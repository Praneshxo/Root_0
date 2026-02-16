-- Create folders table for organizing interview questions
CREATE TABLE IF NOT EXISTS interview_folders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create junction table for questions in folders
CREATE TABLE IF NOT EXISTS folder_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  folder_id uuid NOT NULL REFERENCES interview_folders(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(folder_id, question_id)
);

-- Enable RLS
ALTER TABLE interview_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE folder_questions ENABLE ROW LEVEL SECURITY;

-- Policies for interview_folders
CREATE POLICY "Users can view own folders"
  ON interview_folders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own folders"
  ON interview_folders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own folders"
  ON interview_folders FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own folders"
  ON interview_folders FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for folder_questions
CREATE POLICY "Users can view own folder questions"
  ON folder_questions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM interview_folders
      WHERE interview_folders.id = folder_questions.folder_id
      AND interview_folders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own folder questions"
  ON folder_questions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM interview_folders
      WHERE interview_folders.id = folder_questions.folder_id
      AND interview_folders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own folder questions"
  ON folder_questions FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM interview_folders
      WHERE interview_folders.id = folder_questions.folder_id
      AND interview_folders.user_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_interview_folders_user ON interview_folders(user_id);
CREATE INDEX IF NOT EXISTS idx_folder_questions_folder ON folder_questions(folder_id);
CREATE INDEX IF NOT EXISTS idx_folder_questions_question ON folder_questions(question_id);

-- Insert sample interview questions
INSERT INTO questions (title, category, difficulty, content, solution_text) VALUES
  ('Explain the bias-variance tradeoff in machine learning', 'Technical', 'Medium', 'Describe the bias-variance tradeoff and how it affects model performance.', 'The bias-variance tradeoff is a fundamental concept in machine learning. High bias models are too simple and underfit, missing important patterns. High variance models are too complex and overfit, capturing noise. The goal is to find the right balance between bias and variance for optimal generalization. Techniques include cross-validation, regularization, and ensemble methods.'),
  
  ('What is overfitting? How can you prevent it?', 'Technical', 'Medium', 'Explain overfitting and prevention techniques.', 'Overfitting occurs when a model learns the training data too well, including noise, hurting generalization. Prevention: 1) Use more training data, 2) Apply regularization (L1/L2), 3) Use dropout, 4) Early stopping, 5) Cross-validation, 6) Reduce model complexity.'),
  
  ('How does gradient descent work?', 'Technical', 'Easy', 'Explain the gradient descent algorithm.', 'Gradient descent iteratively updates parameters in the direction of the loss to minimize it. Batch gradient descent uses all data per step, stochastic uses one example, and mini-batch uses a subset. Proper step size scheduling and momentum can improve convergence.'),
  
  ('Explain L1 and L2 regularization', 'Technical', 'Easy', 'What are L1 and L2 regularization and when to use them?', 'L1 regularization (Lasso) adds absolute value of weights to loss, promoting sparsity and acting as feature selection. L2 regularization (Ridge) adds squared weights, shrinking parameters smoothly without forcing them to zero. Choose L1 when interpretability and sparsity matter, L2 for general overfitting prevention.'),
  
  ('What is a confusion matrix?', 'Technical', 'Easy', 'Explain confusion matrix and its metrics.', 'A confusion matrix tabulates true positives, false positives, true negatives, and false negatives for classification. From it, compute accuracy, precision, recall, specificity, F1 score. It reveals asymmetric error costs and class imbalance issues. Useful for evaluating binary and multiclass classifiers.'),
  
  ('How do ROC-AUC and PR-AUC differ?', 'Technical', 'Medium', 'Explain ROC-AUC vs PR-AUC and when to prefer each.', 'ROC-AUC evaluates true positive rate versus false positive rate across thresholds, robust when classes are balanced. PR-AUC evaluates precision versus recall, focusing on positive class performance. Prefer PR-AUC when both classes are imbalanced or anomaly detection or skewed datasets are involved.'),
  
  ('Describe cross-validation strategies', 'Technical', 'Easy', 'Explain different cross-validation techniques.', 'Cross-validation strategies include k-fold (split data into k parts), stratified k-fold (preserve class distribution), leave-one-out (k=n), and time series split (respect temporal order). They help estimate model performance and prevent overfitting by testing on unseen data.'),
  
  ('You need to build a predictive model but your dataset is highly imbalanced. Why is accuracy a poor metric?', 'Technical', 'Hard', 'Explain why accuracy fails on imbalanced datasets and what to use instead.', 'Accuracy is a poor metric for imbalanced datasets because it fails to identify the rare class accurately. For example, if 99% of transactions are not fraud and 1% are fraud, a model that always predicts not fraud would have 99% accuracy but fail to identify any fraud. Better metrics: Precision, Recall, F1-Score, ROC-AUC, PR-AUC. Techniques: Resampling, SMOTE, class weights, anomaly detection.'),
  
  ('What are React Hooks and how do they change the way you write components?', 'Technical', 'Hard', 'Explain React Hooks like useState and useEffect.', 'Hooks are functions that let you use state and lifecycle methods in functional components. Before Hooks, you had to use class components. useState allows a function component to declare and manage its own state. useEffect allows you to perform side effects (like data fetching or subscriptions) after the component renders. This makes code more reusable and easier to understand.'),
  
  ('How do you fine-tune large language models effectively?', 'Technical', 'Hard', 'Describe fine-tuning techniques for LLMs.', 'Fine-tuning LLMs involves training on task-aligned data using techniques like LoRA or adapters for parameter efficiency, and careful hyperparameter tuning with small learning rates. Regular evaluation, early stopping, prompt engineering, and quantization help optimize performance. RLHF or preference optimization can align models to human preferences.'),
  
  ('How would you design a fan-out on write vs fan-out on read system?', 'Technical', 'Hard', 'Explain fan-out-on-write vs fan-out-on-read.', 'A common approach is a hybrid model. 1. Fan-out-on-write (Push): For most users with < 5000 followers, pre-compute timeline when they post. 2. Fan-out-on-read (Pull): For celebrity users with millions of followers, fetch their posts at read time. This balances write cost and read latency. Choose based on read vs write frequency and user distribution.'),
  
  ('Explain the Hardhat development environment', 'Technical', 'Medium', 'What is Hardhat and its key features?', 'Hardhat is a popular development environment for Ethereum software. Key Features: 1. Console.log debugging inside Solidity, 2. Local Ethereum network, 3. Plugin ecosystem, 4. Test runner with Waffle, 5. Mainnet forking for testing. It helps developers compile, deploy, test, and debug Ethereum dApps efficiently.'),
  
  ('Difference between == and .equals()?', 'Technical', 'Easy', 'Explain == vs .equals() in Java.', '== compares references (memory addresses) for objects, while .equals() compares content/values. For primitives, == compares values. Always use .equals() for String comparison to avoid bugs.'),
  
  ('What is the main goal of A/B testing in a marketing campaign?', 'Technical', 'Easy', 'Explain A/B testing for marketing.', 'A/B testing (or split testing) is a method of comparing two versions of a webpage or app against each other to determine which one performs better. For a landing page, you might create an A version with red CTA button and B version with green CTA button. You split traffic 50/50. The goal is to test hypotheses and make data-driven decisions to improve conversion rates, click-through rates, or other KPIs.'),
  
  ('Explain the Hardhat development environment', 'Technical', 'Medium', 'Describe Hardhat for Ethereum development.', 'Hardhat is a popular development environment for Ethereum software. Key Features: 1. Console.log debugging inside Solidity, 2. Local Ethereum network, 3. Plugin ecosystem, 4. Test runner, 5. Mainnet forking. It helps developers compile, deploy, test, and debug Ethereum dApps efficiently.'),
  
  ('Difference between == and .equals()?', 'Technical', 'Easy', 'Explain == vs .equals() in programming.', '== compares references (memory addresses) for objects, while .equals() compares content/values. For primitives, == compares values. Always use .equals() for String comparison to avoid bugs.')
ON CONFLICT DO NOTHING;
