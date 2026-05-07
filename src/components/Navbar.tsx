import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Users, Heart, Calendar, MessageSquare, Info } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/', label: 'ACCUEIL' },
    { to: '/parti', label: 'LE PARTI' },
    { to: '/programme', label: 'NOTRE PROGRAMME' },
    { to: '/actualites', label: 'ACTUALITÉS' },
    { to: '/evenements', label: 'ÉVÉNEMENTS' },
    { to: '/contact', label: 'CONTACT' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300",
      scrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">
               <img 
          src="src/components/images/logo.png" 
          alt="logo" 
          class="rounded-[10px]"
        />
            </div>
            <div className="flex flex-col">
              <span className={cn("font-bold text-lg leading-none", scrolled ? "text-gray-900" : "text-white")}>
                ANDU NAWLE
              </span>
              <span className={cn("text-[10px] uppercase tracking-tighter font-medium", scrolled ? "text-gray-500" : "text-blue-100")}>
                La marche des territoires
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => cn(
                  "text-sm font-semibold tracking-wide transition-colors",
                  isActive 
                    ? "text-[#0047AB] border-b-2 border-[#0047AB]" 
                    : scrolled ? "text-gray-700 hover:text-[#0047AB]" : "text-white hover:text-blue-200"
                )}
              >
                {link.label}
              </NavLink>
            ))}
            <Link 
              to="/rejoindre" 
              className="bg-[#0047AB] text-white px-5 py-2.5 rounded hover:bg-blue-800 transition-colors text-sm font-bold flex items-center gap-2"
            >
              <Users size={16} />
              NOUS REJOINDRE
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={cn(scrolled ? "text-gray-700" : "text-white")}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-xl animate-in slide-in-from-top duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#0047AB] hover:bg-blue-50"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/rejoindre"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-3 text-base font-bold text-[#0047AB] bg-blue-50 border-l-4 border-[#0047AB]"
            >
              NOUS REJOINDRE
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
