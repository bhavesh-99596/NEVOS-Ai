import React from 'react';
import { PhoneIcon } from './icons/PhoneIcon';
import { EmailIcon } from './icons/EmailIcon';
import { LocationIcon } from './icons/LocationIcon';


const TopBar: React.FC = () => {
    return (
        <div className="bg-brand-heading text-white py-2 px-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
                <div className="flex items-center space-x-6">
                    <a href="mailto:support@nevos.com" className="flex items-center space-x-2 hover:text-gray-300 transition-colors">
                        <EmailIcon className="h-4 w-4" />
                        <span>support@nevos.com</span>
                    </a>
                     <div className="hidden md:flex items-center space-x-2">
                        <LocationIcon className="h-4 w-4" />
                        <span>Address TA-134/A, New York, USA</span>
                    </div>
                </div>
                <div className="hidden sm:flex items-center space-x-2">
                    <PhoneIcon className="h-4 w-4" />
                    <span>Call Now: 823-4565-13456</span>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
