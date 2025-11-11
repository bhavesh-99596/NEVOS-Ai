
import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogoIcon } from './icons/LogoIcon';
import { useAuth } from '../contexts/AuthContext';
import { LogoutIcon } from './icons/LogoutIcon';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const profileRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { name: 'Home', path: '/dashboard' },
    { name: 'Services', path: '/services' },
    { name: 'Hospitals', path: '/hospitals' },
    { name: 'Diseases', path: '/diseases' },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeLinkClass = "text-brand-primary";
  const inactiveLinkClass = "text-brand-text hover:text-brand-primary";
  const userName = user?.user_metadata?.fullName?.split(' ')[0] || user?.email;

  return (
    <header className="bg-brand-background/80 backdrop-blur-sm sticky top-0 z-40 border-b border-brand-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <NavLink to="/dashboard" className="flex items-center space-x-3 text-brand-heading">
              <LogoIcon className="h-9 w-9" />
              <span className="font-serif font-semibold text-2xl">NEVOS</span>
            </NavLink>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `${isActive ? activeLinkClass : inactiveLinkClass} text-sm font-semibold transition-colors`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>
            <div className="ml-3 relative" ref={profileRef}>
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} type="button" className="flex items-center space-x-2">
                <span className="font-semibold text-sm text-brand-text capitalize">{userName}</span>
                <div className="w-8 h-8 bg-brand-secondary rounded-full flex items-center justify-center font-bold text-brand-primary text-sm">
                  {userName?.charAt(0).toUpperCase()}
                </div>
              </button>
              {isProfileOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <NavLink to="/profile" className="block px-4 py-2 text-sm text-brand-text hover:bg-gray-100" onClick={() => setIsProfileOpen(false)}>Your Profile</NavLink>
                  <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-brand-text hover:bg-gray-100">
                    <LogoutIcon className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-brand-text hover:bg-brand-secondary focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <NavLink key={link.name} to={link.path} onClick={() => setIsMenuOpen(false)} className={({ isActive }) => `${isActive ? 'bg-brand-secondary text-brand-primary' : 'text-brand-text hover:bg-brand-secondary/50'} block px-3 py-2 rounded-md text-base font-medium transition-colors`}>
                {link.name}
              </NavLink>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-brand-subtle">
            <div className="flex items-center px-5">
               <div className="w-10 h-10 bg-brand-secondary rounded-full flex items-center justify-center font-bold text-brand-primary text-lg">
                  {userName?.charAt(0).toUpperCase()}
                </div>
              <div className="ml-3">
                <div className="text-base font-medium leading-none text-brand-heading capitalize">{userName}</div>
                <div className="text-sm font-medium leading-none text-brand-text/70">{user?.email}</div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <NavLink to="/profile" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-brand-text hover:bg-brand-secondary/50">Your Profile</NavLink>
              <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-brand-text hover:bg-brand-secondary/50">Sign out</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;