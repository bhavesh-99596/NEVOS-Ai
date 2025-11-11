import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';
import { SpinnerIcon } from '../components/icons/SpinnerIcon';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        setError("Could not load your profile information.");
      } else if (data) {
        setFullName(data.full_name || '');
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user]);


  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSaving(true);
    setError(null);
    setSuccess(null);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ full_name: fullName, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (updateError) {
      setError("Failed to update profile. Please try again.");
      console.error("Profile update error:", updateError);
    } else {
      setSuccess("Profile updated successfully!");
      // This ensures the user object in the auth context is also updated.
      await supabase.auth.updateUser({ data: { fullName } });
    }
    setSaving(false);
  };

  if (loading) {
    return (
       <div className="flex items-center justify-center p-10">
        <SpinnerIcon className="h-10 w-10 animate-spin text-brand-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-serif font-bold text-brand-heading">Profile Settings</h1>
        <p className="text-brand-text mt-1">Manage your account information and preferences.</p>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-serif font-semibold mb-4 text-brand-heading">Personal Information</h2>
        <form className="space-y-4" onSubmit={handleSaveChanges}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-brand-text">Full Name</label>
            <input 
              type="text" 
              name="name" 
              id="name" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm" 
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-brand-text">Email Address</label>
            <input 
              type="email" 
              name="email" 
              id="email" 
              defaultValue={user?.email || ''} 
              disabled
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-brand-subtle sm:text-sm cursor-not-allowed" 
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
          <div className="flex justify-end">
            <button 
              type="submit" 
              className="bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-primary-dark transition-colors flex items-center disabled:bg-gray-400"
              disabled={saving}
            >
              {saving && <SpinnerIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
       <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-serif font-semibold mb-4 text-brand-heading">Account Actions</h2>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button onClick={() => alert("Data export not implemented.")} className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">Export My Data</button>
            <button onClick={() => alert("Account deletion not implemented.")} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">Delete Account</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;