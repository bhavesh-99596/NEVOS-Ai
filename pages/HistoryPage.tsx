
import React, { useState, useEffect, useMemo } from 'react';
import { AnalysisRecord, Severity } from '../types';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';
import { SpinnerIcon } from '../components/icons/SpinnerIcon';

const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching history:", error);
      } else if (data) {
        setHistory(data as AnalysisRecord[]);
      }
      setLoading(false);
    };

    fetchHistory();
  }, [user]);
    
  const severityStyles = useMemo(() => ({
    [Severity.Normal]: 'bg-green-100 text-green-800',
    [Severity.Mild]: 'bg-yellow-100 text-yellow-800',
    [Severity.Moderate]: 'bg-orange-100 text-orange-800',
    [Severity.Serious]: 'bg-red-100 text-red-800',
  }), []);

  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-4xl font-serif font-bold text-brand-heading">Analysis History</h1>
            <p className="text-brand-text mt-1">Review your past skin health analyses.</p>
        </div>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                           <tr>
                            <td colSpan={4} className="text-center py-10">
                              <SpinnerIcon className="h-8 w-8 animate-spin text-brand-primary mx-auto" />
                            </td>
                          </tr>
                        ) : history.length > 0 ? (
                          history.map((item) => (
                              <tr key={item.id}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-text">{new Date(item.created_at).toLocaleDateString()}</td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                      <img className="h-10 w-10 rounded-full object-cover" src={item.image_preview} alt="Analyzed mole" />
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.condition_name}</td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${severityStyles[item.severity]}`}>
                                          {item.severity}
                                      </span>
                                  </td>
                              </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="text-center py-10 text-gray-500">
                              You have no past analyses. Get started by performing a new analysis.
                            </td>
                          </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default HistoryPage;