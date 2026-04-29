import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Features', path: '/solutions' },
  { name: 'About', path: '/about' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const navBg =
    scrolled || !isLanding
      ? 'bg-white/95 backdrop-blur-md shadow-sm'
      : 'bg-transparent';

  const linkColor = (path) =>
    isActive(path)
      ? 'text-green-600'
      : scrolled || !isLanding
      ? 'text-gray-600 hover:text-green-600'
      : 'text-gray-700 hover:text-green-600';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo.jpeg" alt="AgriSense" className="w-9 h-9 rounded-lg object-contain" />
          <span className="text-lg font-bold tracking-tight text-gray-900">
            Agri<span className="text-green-600">Sense</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-7">
          {NAV_LINKS.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors ${linkColor(link.path)}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center space-x-3">
          <SignedOut>
            <Link
              to="/login"
              className={`hidden md:block text-sm font-bold transition-colors ${
                scrolled || !isLanding ? 'text-gray-600 hover:text-green-600' : 'text-gray-700 hover:text-green-600'
              }`}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="hidden md:flex items-center space-x-1.5 bg-white/80 border border-green-600 text-green-700 text-sm font-semibold px-4 py-2 rounded-full hover:bg-green-50 transition-all backdrop-blur-sm"
            >
              Sign Up
            </Link>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 px-6 py-4 space-y-4 animate-fadeIn shadow-lg">
          {NAV_LINKS.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block w-full text-left text-sm font-medium ${
                isActive(link.path) ? 'text-green-600' : 'text-gray-600 hover:text-green-600'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <SignedOut>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-gray-100 text-gray-700 text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-gray-200 transition-all"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-green-50 border border-green-200 text-green-700 text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-green-100 transition-all"
              >
                Sign Up
              </Link>
            </SignedOut>
          </div>
        </div>
      )}
    </header>
  );
}
