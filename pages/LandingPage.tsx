import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { LogoIcon } from '../components/icons/LogoIcon';
import { CalendarIcon } from '../components/icons/CalendarIcon';
import { ClockIcon } from '../components/icons/ClockIcon';
import { HeadsetIcon } from '../components/icons/HeadsetIcon';
import { ScanIcon } from '../components/icons/ScanIcon';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-background flex flex-col font-sans">
      <header className="sticky top-0 z-40 bg-brand-background/80 backdrop-blur-sm border-b border-brand-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
                <div className="flex items-center space-x-3 text-brand-heading cursor-pointer" onClick={() => navigate('/')}>
                    <LogoIcon className="h-9 w-9" />
                    <span className="font-serif font-semibold text-2xl">NEVOS</span>
                </div>
                <nav className="hidden md:flex items-center space-x-6">
                    <button 
                      onClick={() => navigate('/login')} 
                      className="font-semibold text-sm text-brand-text hover:text-brand-primary transition-colors"
                    >
                        Login
                    </button>
                    <button 
                        onClick={() => navigate('/signup')} 
                        className="bg-brand-primary text-white font-bold py-2 px-5 rounded-lg hover:bg-brand-primary-dark transition-colors text-sm"
                    >
                        Sign Up
                    </button>
                </nav>
            </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative flex items-center justify-center text-center text-white bg-brand-heading min-h-[50vh] overflow-hidden">
            <img 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop" 
                alt="Doctor consulting with a patient"
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10"></div>
            <div className="relative z-20 px-4 animate-fade-in-up max-w-3xl">
                <h1 className="font-serif text-4xl md:text-6xl font-bold mt-2 mb-6 leading-tight">
                    Advanced Skin Cancer Detection
                </h1>
                <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
                    AI-powered skin lesion analysis for early detection and peace of mind. Get instant results and connect with dermatologists.
                </p>
                <div className="flex justify-center">
                    <button 
                        onClick={() => navigate('/signup')} 
                        className="flex items-center justify-center bg-brand-primary text-white font-bold py-3 px-6 rounded-lg text-base hover:bg-brand-primary-dark transition-transform transform hover:scale-105"
                    >
                        <ScanIcon className="h-5 w-5 mr-2" />
                        Get Started
                    </button>
                </div>
            </div>
        </section>

        {/* Info Cards Section */}
        <section className="py-16 bg-white/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <div className="mx-auto w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mb-4">
                            <CalendarIcon className="h-8 w-8 text-brand-primary" />
                        </div>
                        <h3 className="font-serif text-xl font-bold text-brand-heading mt-4 mb-2">Online Appointment</h3>
                        <p className="text-brand-text mb-4">Book appointments with top dermatologists directly through our platform for seamless care.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <div className="mx-auto w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mb-4">
                            <ClockIcon className="h-8 w-8 text-brand-primary" />
                        </div>
                        <h3 className="font-serif text-xl font-bold text-brand-heading mt-4 mb-2">24/7 Available</h3>
                        <p className="text-brand-text mb-4">AI analysis available anytime, anywhere, providing you with insights whenever you need them.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <div className="mx-auto w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mb-4">
                             <HeadsetIcon className="h-8 w-8 text-brand-primary" />
                        </div>
                        <h3 className="font-serif text-xl font-bold text-brand-heading mt-4 mb-2">Emergency Support</h3>
                        <p className="text-brand-text mb-4">Direct line to medical professionals for urgent cases identified by our AI analysis.</p>
                    </div>
                </div>
            </div>
        </section>
        
      </main>

      <footer className="bg-brand-heading text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p>&copy; {new Date().getFullYear()} NEVOS. All Rights Reserved.</p>
              <p className="text-sm text-gray-300 mt-2">
                <strong>Disclaimer:</strong> NEVOS is an informational tool and does not provide medical advice. Consult a healthcare professional for any health concerns.
              </p>
          </div>
      </footer>
    </div>
  );
};

export default LandingPage;