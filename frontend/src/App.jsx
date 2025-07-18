import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { SubmitPage } from './pages/SubmitPage';
import { AdminPage } from './pages/AdminPage';
import './App.css';
import './i18n';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/submit" element={<SubmitPage />} />
            <Route path="/admin" element={<AdminPage />} />
            {/* Placeholder routes */}
            <Route path="/about" element={<div className="container mx-auto px-4 py-8"><h1>About Page</h1></div>} />
            <Route path="/contact" element={<div className="container mx-auto px-4 py-8"><h1>Contact Page</h1></div>} />
            <Route path="/privacy" element={<div className="container mx-auto px-4 py-8"><h1>Privacy Policy</h1></div>} />
            <Route path="/terms" element={<div className="container mx-auto px-4 py-8"><h1>Terms of Service</h1></div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
