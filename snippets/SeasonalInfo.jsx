'use client';

import { useEffect, useState } from 'react';
import { supabase } from './supabase.js';

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const getRatingColor = (rating) => {
  switch (rating) {
    case 'excellent':
      return 'bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700';
    case 'good':
      return 'bg-teal-100 dark:bg-teal-900 border-teal-300 dark:border-teal-700';
    case 'fair':
      return 'bg-amber-100 dark:bg-amber-900 border-amber-300 dark:border-amber-700';
    case 'poor':
      return 'bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700';
    default:
      return 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700';
  }
};

const getRatingTextColor = (rating) => {
  switch (rating) {
    case 'excellent':
      return 'text-green-800 dark:text-green-200';
    case 'good':
      return 'text-teal-800 dark:text-teal-200';
    case 'fair':
      return 'text-amber-800 dark:text-amber-200';
    case 'poor':
      return 'text-red-800 dark:text-red-200';
    default:
      return 'text-gray-800 dark:text-gray-200';
  }
};

export const SeasonalInfo = ({ placeId }) => {
  const [seasonalData, setSeasonalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSeasonalData = async () => {
      try {
        setLoading(true);
        const { data, error: queryError } = await supabase
          .schema('places')
          .from('seasonal_info')
          .select('*')
          .eq('entity_id', placeId)
          .order('month', { ascending: true });

        if (queryError) throw queryError;

        const sortedData = Array(12).fill(null);
        data?.forEach((item) => {
          if (item.month >= 1 && item.month <= 12) {
            sortedData[item.month - 1] = item;
          }
        });

        setSeasonalData(sortedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (placeId) {
      fetchSeasonalData();
    }
  }, [placeId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-gray-300 dark:border-gray-600 border-t-teal-500 rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-800 dark:text-red-200">
        <p className="font-semibold">Unable to load seasonal information</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (seasonalData.every((item) => item === null)) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">No seasonal information available for this location.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {seasonalData.map((item, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border-2 transition-all ${
              item ? getRatingColor(item.visit_rating) : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
            }`}
          >
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">{monthLabels[index]}</p>
            {item ? (
              <div className="space-y-1">
                <p className={`text-xs font-bold capitalize ${getRatingTextColor(item.visit_rating)}`}>
                  {item.visit_rating}
                </p>
                <p className="text-xs text-gray-700 dark:text-gray-300">
                  {item.max_temp_c}°C / {item.min_temp_c}°C
                </p>
                {item.rainfall_mm && <p className="text-xs text-gray-600 dark:text-gray-400">{item.rainfall_mm}mm</p>}
                {item.crowd_level && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                    {item.crowd_level} crowds
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-gray-400 dark:text-gray-500">No data</p>
            )}
          </div>
        ))}
      </div>

      {seasonalData.some((item) => item?.notes) && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="font-semibold text-blue-900 dark:text-blue-200 mb-3">Seasonal Notes</p>
          <ul className="space-y-2">
            {seasonalData.map((item, index) => (
              item?.notes && (
                <li key={index} className="text-sm text-blue-800 dark:text-blue-300">
                  <span className="font-semibold">{monthLabels[index]}:</span> {item.notes}
                </li>
              )
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
