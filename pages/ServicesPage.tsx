import React, { useState } from 'react';
import { SpinnerIcon } from '../components/icons/SpinnerIcon';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';
import { Appointment } from '../types';

const ServicesPage: React.FC = () => {
  const { user } = useAuth();
  const [serviceType, setServiceType] = useState('General Dermatology Consultation');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [reason, setReason] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        setError("You must be logged in to book an appointment.");
        return;
    }
    if (!appointmentDate || !appointmentTime) {
        setError("Please select a date and time for your appointment.");
        return;
    }

    setLoading(true);
    setSuccess(false);
    setError(null);

    const newAppointment: Appointment = {
      user_id: user.id,
      service_type: serviceType,
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      reason: reason,
    };

    const { error: insertError } = await supabase.from('appointments').insert([newAppointment]);

    if (insertError) {
      setError("Failed to book appointment. Please try again.");
      console.error("Appointment booking error:", insertError);
    } else {
      setSuccess(true);
      // Reset form
      setServiceType('General Dermatology Consultation');
      setAppointmentDate('');
      setAppointmentTime('');
      setReason('');
    }

    setLoading(false);
  };
  
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-serif font-bold text-brand-heading">Book an Appointment</h1>
        <p className="text-brand-text mt-1">Schedule a consultation for one of our services.</p>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
        {success && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-6" role="alert">
                <p className="font-bold">Request Submitted!</p>
                <p>Your appointment request has been sent. The clinic will contact you shortly to confirm the details.</p>
            </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="serviceType" className="block text-sm font-medium text-brand-text">Service Type</label>
                <select 
                    id="serviceType" 
                    value={serviceType} 
                    onChange={(e) => setServiceType(e.target.value)} 
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                >
                    <option>General Dermatology Consultation</option>
                    <option>Skin Cancer Screening</option>
                    <option>Follow-up on AI Analysis</option>
                    <option>Acne Treatment</option>
                    <option>Cosmetic Dermatology</option>
                </select>
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-brand-text">Preferred Date</label>
                    <input 
                        type="date" 
                        id="date" 
                        value={appointmentDate} 
                        onChange={(e) => setAppointmentDate(e.target.value)} 
                        min={getMinDate()}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm" 
                    />
                </div>
                <div>
                    <label htmlFor="time" className="block text-sm font-medium text-brand-text">Preferred Time</label>
                    <input 
                        type="time" 
                        id="time" 
                        value={appointmentTime} 
                        onChange={(e) => setAppointmentTime(e.target.value)} 
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm" 
                    />
                </div>
            </div>
             <div>
                <label htmlFor="reason" className="block text-sm font-medium text-brand-text">Reason for Visit (Optional)</label>
                <textarea 
                    id="reason" 
                    rows={4} 
                    value={reason} 
                    onChange={(e) => setReason(e.target.value)} 
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm" 
                    placeholder="e.g., Follow-up on recent analysis, new skin concern..."
                ></textarea>
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

export default ServicesPage;