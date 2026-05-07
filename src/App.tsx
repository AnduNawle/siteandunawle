import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import TheParty from './pages/TheParty';
import Program from './pages/Program';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Events from './pages/Events';
import JoinUs from './pages/JoinUs';
import Contact from './pages/Contact';
import Donate from './pages/Donate';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PageLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        {children}
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <PageLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/parti" element={<TheParty />} />
          <Route path="/programme" element={<Program />} />
          <Route path="/actualites" element={<News />} />
          <Route path="/actualites/:slug" element={<NewsDetail />} />
          <Route path="/evenements" element={<Events />} />
          <Route path="/rejoindre" element={<JoinUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faire-un-don" element={<Donate />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </PageLayout>
    </BrowserRouter>
  );
}
