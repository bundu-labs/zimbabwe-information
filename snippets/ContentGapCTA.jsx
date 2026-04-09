import { useEffect, useState } from 'react';
import { supabase } from './supabase.js';
const getPriorityColor = (priority) => {
  switch (priority) {
    case 'critical':
      return 'bg-red-100 dark:bg-red-900/20 border-red-300 dark:border-red-800 text-red-800 dark:text-red-200';
    case 'high':
      return 'bg-orange-100 dark:bg-orange-900/20 border-orange-300 dark:border-orange-800 text-orange-800 dark:text-orange-200';
    case 'medium':
      return 'bg-amber-100 dark:bg-amber-900/20 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200';
    case 'low':
      return 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200';
    default:
      return 'bg-gray-100 dark:bg-gray-900/20 border-gray-300 dark:border-gray-800 text-gray-800 dark:text-gray-200';
  }
};
const getPriorityLabel = (priority) => {
  switch (priority) {
    case 'critical':
      return 'Critical';
    case 'high':
      return 'High Priority';
    case 'medium':
      return 'Medium Priority';
    case 'low':
      return 'Low Priority';
    default:
      return priority;
  }
};
export const ContentGapCTA = ({ placeId }) => {
  const [gaps, setGaps] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchGaps = async () => {
      try {
        setLoading(true);
        const { data, error: queryError } = await supabase
          .schema('content')
          .from('content_gap')
          .select('*')
          .eq('entity_id', placeId)
          .eq('status', 'open')
          .order('priority', { ascending: true });
        if (!queryError && data) {
          setGaps(data);
        }
      } catch (err) {
        // Silent error handling - just don't show the CTA if there's an issue
      } finally {
        setLoading(false);
      }
    };
    if (placeId) {
      fetchGaps();
    }
  }, [placeId]);
  if (loading || gaps.length === 0) {
    return null;
  }
  const hasCriticalGaps = gaps.some((gap) => gap.priority === 'critical');
  return (
    <div
      className={`border-2 rounded-lg p-6 space-y-4 ${
        hasCriticalGaps
          ? 'bg-red-50 dark:bg-red-900/10 border-red-300 dark:border-red-800'
          : 'bg-blue-50 dark:bg-blue-900/10 border-blue-300 dark:border-blue-800'
      }`}
    >
      <div className="space-y-1">
        <h3 className={`font-semibold text-lg ${hasCriticalGaps ? 'text-red-900 dark:text-red-200' : 'text-blue-900 dark:text-blue-200'}`}>
          Help Improve This Page
        </h3>
        <p
          className={`text-sm ${
            hasCriticalGaps ? 'text-red-800 dark:text-red-300' : 'text-blue-800 dark:text-blue-300'
          }`}
        >
          We're working to make this information complete and accurate. {gaps.length} content{' '}
          {gaps.length === 1 ? 'gap' : 'gaps'} identified.
        </p>
      </div>
      {gaps.length > 0 && (
        <div className="space-y-2">
          {gaps.slice(0, 3).map((gap) => (
            <div
              key={gap.id}
              className={`text-sm p-3 rounded border ${getPriorityColor(gap.priority)} flex items-start gap-2`}
            >
              <span className="font-semibold min-w-fit">{getPriorityLabel(gap.priority)}:</span>
              <span>{gap.description || gap.gap_type}</span>
            </div>
          ))}
          {gaps.length > 3 && (
            <p className="text-xs text-gray-600 dark:text-gray-400 italic">
              ...and {gaps.length - 3} more {gaps.length - 3 === 1 ? 'gap' : 'gaps'}
            </p>
          )}
        </div>
      )}
      <a
        href="https://business.mukoko.com/contribute"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
      >
        Contribute Missing Information
      </a>
      <p className="text-xs text-gray-600 dark:text-gray-400 italic">
        Your contributions help keep Zimbabwe Travel Information accurate and comprehensive.
      </p>
    </div>
  );
};
