
import React, { useState } from 'react';
import { SpinnerIcon } from '../components/icons/SpinnerIcon';

const AppointmentPage: React.FC = () => {
  const [doctor, setDoctor] = useState('Dr. Emily Carter, MD');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    // Mock API call
    setTimeout(() => {
      if (date && time && reason) {
        setSuccess(true);
        setDoctor('Dr. Emily Carter, MD');
        setDate('');
        setTime('');
        setReason('');
      } else {
        setError('Please fill out all fields.');
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-serif font-bold text-brand-heading">Book an Appointment</h1>
        <p className="text-brand-text mt-1">Schedule a consultation with a dermatology specialist.</p>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
        {success && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-6" role="alert">
                <p className="font-bold">Success!</p>
                <p>Your appointment request has been sent. The clinic will contact you shortly to confirm.</p>
            </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="doctor" className="block text-sm font-medium text-brand-text">Doctor</label>
                <select id="doctor" value={doctor} onChange={(e) => setDoctor(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm">
                    <option>Dr. Emily Carter, MD</option>
                    <option>Dr. Benjamin Lee</option>
                    <option>Downtown Dermatology Clinic</option>
                    <option>Uptown Skin Specialists</option>
                </select>
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-brand-text">Preferred Date</label>
                    <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="time" className="block text-sm font-medium text-brand-text">Preferred Time</label>
                    <input type="time" id="time" value={time} onChange={(e) => setTime(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm" />
                </div>
            </div>
             <div>
                <label htmlFor="reason" className="block text-sm font-medium text-brand-text">Reason for Visit</label>
                <textarea id="reason" rows={4} value={reason} onChange={(e) => setReason(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm" placeholder="e.g., Follow-up on recent analysis, new skin concern..."></textarea>
            </div>
             {error && <p className="text-sm text-red-600">{error}</p>}
             <div className="flex justify-end">
                <button 
                  type="submit" 
                  className="bg-brand-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-brand-primary-dark transition-colors flex items-center disabled:bg-gray-400"
                  disabled={loading}
                >
                  {loading && <SpinnerIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />}
                  {loading ? 'Submitting...' : 'Submit Request'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentPage;