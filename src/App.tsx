import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Companies from './pages/Companies';
import DSA from './pages/DSA';
import SQL from './pages/SQL';
import Aptitude from './pages/Aptitude';
import CoreCS from './pages/CoreCS';
import InterviewQuestions from './pages/InterviewQuestions';
import Quiz from './pages/Quiz';
import Notes from './pages/Notes';
import Projects from './pages/Projects';
import QuestionDetail from './pages/QuestionDetail';
import CompanyQuestionDetail from './pages/CompanyQuestionDetail';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="companies" element={<Companies />} />
            <Route path="companies/:questionId" element={<CompanyQuestionDetail />} />
            <Route path="dsa" element={<DSA />} />
            <Route path="dsa/:questionId" element={<QuestionDetail type="dsa" />} />
            <Route path="sql" element={<SQL />} />
            <Route path="sql/:questionId" element={<QuestionDetail type="sql" />} />
            <Route path="aptitude" element={<Aptitude />} />
            <Route path="aptitude/:questionId" element={<QuestionDetail type="aptitude" />} />
            <Route path="core-cs" element={<CoreCS />} />
            <Route path="core-cs/:questionId" element={<QuestionDetail type="corecs" />} />
            <Route path="interview-questions" element={<InterviewQuestions />} />
            <Route path="interview-questions/:questionId" element={<QuestionDetail type="interview" />} />
            <Route path="quiz" element={<Quiz />} />
            <Route path="notes" element={<Notes />} />
            <Route path="projects" element={<Projects />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
