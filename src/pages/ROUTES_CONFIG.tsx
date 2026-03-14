// Add these to your existing React Router config (App.tsx or routes file)
// Import all pages at the top:

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

// Then add these <Route> entries inside your <Routes> block:

/*
<Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/about" element={<AboutPage />} />
  <Route path="/careers" element={<CareersPage />} />
  <Route path="/contact" element={<ContactPage />} />
  <Route path="/affiliate" element={<AffiliatePage />} />
  <Route path="/reviews" element={<ReviewsPage />} />
  <Route path="/resources/algorithm-lab" element={<AlgorithmLabPage />} />
  <Route path="/resources/sql-sandbox" element={<SQLSandboxPage />} />
  <Route path="/resources/system-design" element={<SystemDesignPage />} />
  ... your existing login/signup/dashboard routes
</Routes>
*/

// Also update your LandingPage footer links from href="#" to the correct paths:
// About Us    → /about
// Careers     → /careers
// Contact     → /contact
// Affiliate   → /affiliate
// Reviews     → /reviews  (the "See all reviews" button)
// Algorithm Lab     → /resources/algorithm-lab
// SQL Sandbox       → /resources/sql-sandbox
// System Design     → /resources/system-design
// Pricing (navbar)  → scroll to #pricing on landing page
