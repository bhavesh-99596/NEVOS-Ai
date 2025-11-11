import React, { useState, useEffect } from 'react';
import { SpinnerIcon } from '../components/icons/SpinnerIcon';

const DoctorsPage: React.FC = () => {
  const [location, setLocation] = useState<{ lat: number, lon: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }

    // Get current position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
        setLoading(false);
      },
      (geoError) => {
        setError('Unable to retrieve your location. Please enable location services in your browser settings and refresh the page.');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);
  
  // Construct the Google Maps search URL. It searches for "dermatologist hospitals"
  // centered on the user's current latitude and longitude with a zoom level of 13.
  const mapSrc = location 
    ? `https://maps.google.com/maps?q=dermatologist+hospitals&ll=${location.lat},${location.lon}&z=13&output=embed` 
    : '';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-serif font-bold text-brand-heading">Find Dermatologist Hospitals</h1>
        <p className="text-brand-text mt-1">Explore dermatologist hospitals and clinics near your current location.</p>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden w-full h-[60vh] min-h-[500px] flex items-center justify-center">
        {loading && (
          <div className="flex flex-col items-center justify-center text-brand-text">
            <SpinnerIcon className="h-10 w-10 animate-spin text-brand-primary mb-3" />
            <p>Getting your location to find nearby hospitals...</p>
          </div>
        )}

        {error && (
          <div className="text-center p-4">
            <h3 className="font-semibold text-red-600">Location Error</h3>
            <p className="text-brand-text">{error}</p>
          </div>
        )}

        {!loading && !error && location && (
           <iframe
              width="100%"
              height="100%"
              title="map of nearby dermatologist hospitals"
              src={mapSrc}
              className="border-0"
              loading="lazy"
            ></iframe>
        )}
      </div>
    </div>
  );
};

export default DoctorsPage;