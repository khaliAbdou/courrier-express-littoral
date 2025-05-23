
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Mail, Send, BarChart, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-agency-blue text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/b5287aa5-72f8-436b-95be-6d1a0e22b700.png" 
                alt="ANOR Logo" 
                className="h-10 w-10 mr-2"
              />
              <div className="flex flex-col">
                <span className="font-bold text-xl">Suivi du Courrier</span>
                <span className="ml-1 text-xs">Antenne du Littoral</span>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link 
                to="/" 
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors ${
                  isActive("/") ? "bg-white text-agency-blue" : "hover:bg-agency-lightblue"
                }`}
              >
                <Mail className="w-4 h-4 mr-1" />
                Accueil
              </Link>
              
              <Link 
                to="/incoming" 
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors ${
                  isActive("/incoming") ? "bg-white text-agency-blue" : "hover:bg-agency-lightblue"
                }`}
              >
                <Mail className="w-4 h-4 mr-1" />
                Courrier Entrant
              </Link>
              
              <Link 
                to="/outgoing" 
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors ${
                  isActive("/outgoing") ? "bg-white text-agency-blue" : "hover:bg-agency-lightblue"
                }`}
              >
                <Send className="w-4 h-4 mr-1" />
                Courrier Départ
              </Link>
              
              <Link 
                to="/statistics" 
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors ${
                  isActive("/statistics") ? "bg-white text-agency-blue" : "hover:bg-agency-lightblue"
                }`}
              >
                <BarChart className="w-4 h-4 mr-1" />
                Statistiques
              </Link>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              className="mobile-menu-button p-2 rounded-md inline-flex items-center justify-center text-white hover:bg-agency-lightblue focus:outline-none focus:ring-2 focus:ring-white"
              onClick={toggleMobileMenu}
              aria-label="Menu principal"
            >
              <span className="sr-only">Ouvrir le menu principal</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        <div className={`${mobileMenuOpen ? "block" : "hidden"} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                isActive("/") ? "bg-white text-agency-blue" : "hover:bg-agency-lightblue"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Mail className="w-4 h-4 mr-2" />
              Accueil
            </Link>
            <Link 
              to="/incoming" 
              className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                isActive("/incoming") ? "bg-white text-agency-blue" : "hover:bg-agency-lightblue"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Mail className="w-4 h-4 mr-2" />
              Courrier Entrant
            </Link>
            <Link 
              to="/outgoing" 
              className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                isActive("/outgoing") ? "bg-white text-agency-blue" : "hover:bg-agency-lightblue"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Send className="w-4 h-4 mr-2" />
              Courrier Départ
            </Link>
            <Link 
              to="/statistics" 
              className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                isActive("/statistics") ? "bg-white text-agency-blue" : "hover:bg-agency-lightblue"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <BarChart className="w-4 h-4 mr-2" />
              Statistiques
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
