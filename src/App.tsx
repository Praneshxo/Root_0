import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
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
import HRContacts from './pages/HRContacts';
import LandingPage from './pages/LandingPage';
import Notes from './pages/Notes';
import Projects from './pages/Projects';
import QuestionDetail from './pages/QuestionDetail';
import CompanyQuestionDetail from './pages/CompanyQuestionDetail';
import Profile from './pages/Profile';
import AboutPage from './pages/AboutPage';
import CareersPage from './pages/CareersPage';
import ContactPage from './pages/ContactPage';
import AffiliatePage from './pages/AffiliatePage';
import ReviewsPage from './pages/ReviewsPage';
import {
  AlgorithmLabPage,
  SQLSandboxPage,
  SystemDesignPage,
} from './pages/ResourcePages';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/affiliate" element={<AffiliatePage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/resources/algorithm-lab" element={<AlgorithmLabPage />} />
          <Route path="/resources/sql-sandbox" element={<SQLSandboxPage />} />
          <Route path="/resources/system-design" element={<SystemDesignPage />} />
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="companies" element={<Companies />} />
            <Route path="companies/:questionId" element={<CompanyQuestionDetail />} />
            <Route path="companies/question/:questionId" element={<CompanyQuestionDetail />} />
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
            <Route path="hr-contacts" element={<HRContacts />} />
            <Route path="profile" element={<Profile />} />

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
