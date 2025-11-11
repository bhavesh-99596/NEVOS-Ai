import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ScanIcon } from '../components/icons/ScanIcon';
import { CalendarIcon } from '../components/icons/CalendarIcon';
import { ClockIcon } from '../components/icons/ClockIcon';
import { HeadsetIcon } from '../components/icons/HeadsetIcon';

const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const userName = user?.user_metadata?.fullName?.split(' ')[0] || 'User';

  return (
    <div className="px-4 sm:px-0">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center text-center text-white bg-brand-heading min-h-[50vh] overflow-hidden rounded-lg shadow-lg">
        <img 
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop" 
            alt="Doctor consulting with a patient"
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10"></div>
        <div className="relative z-20 px-4 animate-fade-in-up max-w-3xl">
            <h1 className="font-serif text-4xl md:text-6xl font-bold mt-2 mb-6 leading-tight">
                Welcome back, {userName}!
            </h1>
            <p className="text-lg text-white/90 max-w-lg mx-auto mb-8">
                Ready to check your skin? Perform a new scan or book an appointment with a specialist.
            </p>
            <div className="flex justify-center">
                <button
                  onClick={() => navigate('/analysis')}
                  className="flex items-center justify-center bg-brand-primary text-white font-bold py-3 px-6 rounded-lg text-base hover:bg-brand-primary-dark transition-transform transform hover:scale-105"
                >
                  <ScanIcon className="h-5 w-5 mr-2" />
                  Scan Now
                </button>
            </div>
        </div>
      </section>

      {/* Info Cards Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="mx-auto w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mb-4">
                  <CalendarIcon className="h-8 w-8 text-brand-primary" />
              </div>
              <h3 className="font-serif text-xl font-bold text-brand-heading mt-4 mb-2">Online Appointment</h3>
              <p className="text-brand-text mb-4">Book appointments with top dermatologists directly through our platform.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <div className="mx-auto w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mb-4">
                    <ClockIcon className="h-8 w-8 text-brand-primary" />
                </div>
              <h3 className="font-serif text-xl font-bold text-brand-heading mt-4 mb-2">24/7 Available</h3>
              <p className="text-brand-text mb-4">AI analysis available anytime, providing insights whenever you need them.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <div className="mx-auto w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mb-4">
                    <HeadsetIcon className="h-8 w-8 text-brand-primary" />
                </div>
              <h3 className="font-serif text-xl font-bold text-brand-heading mt-4 mb-2">Emergency Support</h3>
              <p className="text-brand-text mb-4">Connect with medical professionals for urgent cases identified by our AI.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;