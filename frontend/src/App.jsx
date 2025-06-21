import React, { useEffect, useState, lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Loader from "./components/loader";

// Lazy-loaded pages
const Landing = lazy(() => import("./Pages/Landing.jsx"));
const Pricing = lazy(() => import("./Pages/Pricing"));
const ResumeScanner = lazy(() => import("./Pages/ResumeScanner"));
const InterviewScheduler = lazy(() => import("./Pages/InterviewScheduler"));
const Contact = lazy(() => import("./Pages/Contact"));
const ChatPage = lazy(() => import("./Pages/ChatPage"));
const AccessDenied = lazy(() => import("./Pages/AccessDenied"));
const RoleSelector = lazy(() => import("./Pages/RoleSelector"));
const PolicyBotOnly = lazy(() => import("./Pages/PolicyBotOnly"));
const HrUploadPage = lazy(() => import("./Pages/HrUploadPage"));
const CandidateAccessPage = lazy(() => import("./Pages/CandidateAccessPage"));

const AppRoutes = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === "/policybot-only";

  return (
    <div className="relative min-h-screen">
      {!hideNavbar && <Navbar />}
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Redirect root to role selector */}
          <Route path="/" element={<Navigate to="/choose-role" replace />} />

          {/* Common Pages */}
          <Route path="/choose-role" element={<RoleSelector />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/denied" element={<AccessDenied />} />

          {/* HR Flow */}
          <Route path="/home" element={<Landing />} />
          <Route path="/upload" element={<HrUploadPage />} />
          <Route path="/services/resume-scanner" element={<ResumeScanner />} />
          <Route path="/services/interview-scheduler" element={<InterviewScheduler />} />
          <Route path="/services/policy-bot" element={<HrUploadPage />} />

          {/* Candidate Flow */}
          <Route path="/candidate" element={<CandidateAccessPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/policybot-only" element={<PolicyBotOnly />} />

          {/* 404 Fallback */}
          <Route path="*" element={<AccessDenied />} />
        </Routes>
      </Suspense>
    </div>
  );
};

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
