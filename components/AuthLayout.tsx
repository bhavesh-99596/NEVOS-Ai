
import React from 'react';
import { LogoIcon } from './icons/LogoIcon';

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-brand-background flex items-center justify-center p-4">
      <div className="w-full max-w-5xl flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
            <div className="flex items-center space-x-3 mb-8 self-start">
                <LogoIcon className="h-9 w-9" />
                <span className="font-serif font-semibold text-2xl text-brand-heading">NEVOS</span>
            </div>
            {children}
        </div>
        
        {/* Image Section */}
        <div 
          className="hidden md:block md:w-1/2 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1538688423619-a81d3f23454b?q=80&w=2070&auto=format&fit=crop')" }}
        >
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;