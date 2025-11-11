import React, { useState, useEffect, useCallback } from 'react';
import { SpinnerIcon } from '../components/icons/SpinnerIcon';
import { findNearbyHospitals } from '../services/geminiService';
import { HospitalInfo } from '../types';
import { PhoneIcon } from '../components/icons/PhoneIcon';
import { LocationIcon } from '../components/icons/LocationIcon';
import { WebsiteIcon } from '../components/icons/WebsiteIcon';

const HospitalsPage: React.FC = () => {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [hospitals, setHospitals] = useState<HospitalInfo[]>([]);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [loadingHospitals, setLoadingHospitals] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLocation = useCallback((forceRefresh = false) => {
    setError(null);
    setLoadingLocation(true);

    const cachedLocation = localStorage.getItem('userLocation');
    if (cachedLocation && !forceRefresh) {
      setLocation(JSON.parse(cachedLocation));
      setLoadingLocation(false);
      return;
    }

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        localStorage.setItem('userLocation', JSON.stringify(newLocation));
        setLocation(newLocation);
        setLoadingLocation(false);
      },
      (geoError) => {
        setError('Unable to retrieve location. Please enable location services.');
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  useEffect(() => {
    const fetchHospitals = async () => {
      if (location) {
        setLoadingHospitals(true);
        setHospitals([]);
        setError(null);
        try {
          const results = await findNearbyHospitals(location.lat, location.lon);
          setHospitals(results);
        } catch (err) {
          setError('Could not find nearby hospitals. The AI service may be temporarily down.');
          console.error(err);
        } finally {
          setLoadingHospitals(false);
        }
      }
    };

    fetchHospitals();
  }, [location]);

  const mapSrc = location
    ? `https://maps.google.com/maps?q=dermatologist+hospitals&ll=${location.lat},${location.lon}&z=13&output=embed`
    : '';

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold text-brand-heading">Find Nearby Hospitals</h1>
          <p className="text-brand-text mt-1">Explore hospitals and clinics with dermatology departments near you.</p>
        </div>
        <button
          onClick={() => getLocation(true)}
          className="bg-white border border-brand-secondary text-brand-text font-semibold py-2 px-4 rounded-lg hover:bg-brand-background transition-colors self-start sm:self-center"
        >
          Refresh My Location
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden w-full h-[50vh] min-h-[400px] flex items-center justify-center">
        {loadingLocation && !location && (
          <div className="flex flex-col items-center justify-center text-brand-text">
            <SpinnerIcon className="h-10 w-10 animate-spin text-brand-primary mb-3" />
            <p>Getting your location...</p>
          </div>
        )}

        {error && !location && (
          <div className="text-center p-4">
            <h3 className="font-semibold text-red-600">Location Error</h3>
            <p className="text-brand-text">{error}</p>
          </div>
        )}

        {!loadingLocation && location && (
          <iframe
            width="100%"
            height="100%"
            title="map of nearby hospitals"
            src={mapSrc}
            className="border-0"
            loading="lazy"
          ></iframe>
        )}
      </div>

      <div className="space-y-4">
        {loadingHospitals && (
          <div className="flex flex-col items-center justify-center text-brand-text p-8">
            <SpinnerIcon className="h-10 w-10 animate-spin text-brand-primary mb-3" />
            <p>Searching for hospitals near you using AI...</p>
          </div>
        )}

        {!loadingHospitals && error && hospitals.length === 0 && (
           <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
            <h3 className="font-semibold text-red-700">Search Error</h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loadingHospitals && hospitals.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hospitals.map((hospital, index) => (
              <div key={index} className="bg-white shadow-md rounded-lg p-6 flex flex-col">
                <h3 className="text-xl font-serif font-semibold text-brand-heading mb-3">{hospital.name}</h3>
                <div className="space-y-3 text-sm text-brand-text flex-grow">
                   <p className="flex items-start">
                    <LocationIcon className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0 text-brand-primary" />
                    <span>{hospital.address}</span>
                  </p>
                  <p className="flex items-center">
                    <PhoneIcon className="h-5 w-5 mr-3 flex-shrink-0 text-brand-primary" />
                    <span>{hospital.phone}</span>
                  </p>
                   <p className="flex items-center">
                    <WebsiteIcon className="h-5 w-5 mr-3 flex-shrink-0 text-brand-primary" />
                    <a href={hospital.website} target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline truncate">
                      Visit Website
                    </a>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalsPage;