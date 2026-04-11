import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Result from './pages/Result';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-text flex flex-col font-sans">
        {/* Navigation Bar */}
        <header className="w-full bg-white shadow-sm py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-primary p-2 rounded-lg group-hover:bg-secondary transition-colors">
              <Leaf className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-primary tracking-tight">AgroVision</h1>
          </Link>
          <nav className="hidden md:flex gap-6 font-medium text-gray-600">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <Link to="/upload" className="hover:text-primary transition-colors">Diagnose</Link>
          </nav>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col items-center p-6 w-full max-w-5xl mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/result" element={<Result />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <footer className="w-full bg-primary text-white py-6 mt-12">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <p className="text-lg font-medium opacity-90">AgroVision | Helping Farmers with AI</p>
            <p className="text-sm mt-2 opacity-70">© {new Date().getFullYear()} Cultivating better yields.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
