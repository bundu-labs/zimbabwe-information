import { useEffect, useState } from 'react';
import { supabase } from './supabase.js';
const getDifficultyColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'easy':
      return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
    case 'moderate':
      return 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300';
    case 'challenging':
      return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300';
    case 'expert':
      return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
    default:
      return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
  }
};
export const ItineraryView = ({ itineraryId }) => {
  const [itinerary, setItinerary] = useState(null);
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        setLoading(true);
        const { data: itinData, error: itinError } = await supabase
          .schema('content')
          .from('itinerary')
          .select('*')
          .eq('id', itineraryId)
          .single();
        if (itinError) throw itinError;
        setItinerary(itinData);
        const { data: stopsData, error: stopsError } = await supabase
          .schema('content')
          .from('itinerary_stop')
          .select(
            `
            id,
            itinerary_id,
            day_number,
            stop_order,
            place_id,
            title,
            description,
            duration_hours,
            travel_time_from_prev_hours,
            accommodation_id,
            activities,
            places(name, latitude, longitude)
          `
          )
          .eq('itinerary_id', itineraryId)
          .order('day_number', { ascending: true })
          .order('stop_order', { ascending: true });
        if (stopsError) throw stopsError;
        setStops(stopsData || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (itineraryId) {
      fetchItinerary();
    }
  }, [itineraryId]);
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-gray-300 dark:border-gray-600 border-t-teal-500 rounded-full"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-800 dark:text-red-200">
        <p className="font-semibold">Unable to load itinerary</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }
  if (!itinerary) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">Itinerary not found.</p>
      </div>
    );
  }
  const groupedStops = stops.reduce((acc, stop) => {
    const day = stop.day_number;
    if (!acc[day]) acc[day] = [];
    acc[day].push(stop);
    return acc;
  }, {});
  const days = Object.keys(groupedStops)
    .map(Number)
    .sort((a, b) => a - b);
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{itinerary.title}</h1>
          {itinerary.description && (
            <p className="text-gray-600 dark:text-gray-400 mt-2">{itinerary.description}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          {itinerary.duration_days && (
            <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg">
              <span className="font-semibold text-blue-900 dark:text-blue-200">Duration:</span>
              <span className="text-blue-800 dark:text-blue-300">
                {itinerary.duration_days} {itinerary.duration_days === 1 ? 'day' : 'days'}
              </span>
            </div>
          )}
          {itinerary.difficulty && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${getDifficultyColor(itinerary.difficulty)}`}>
              <span className="font-semibold">Difficulty:</span>
              <span className="capitalize">{itinerary.difficulty}</span>
            </div>
          )}
          {itinerary.target_audience && (
            <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/20 px-4 py-2 rounded-lg">
              <span className="font-semibold text-purple-900 dark:text-purple-200">For:</span>
              <span className="text-purple-800 dark:text-purple-300">{itinerary.target_audience}</span>
            </div>
          )}
          {itinerary.total_distance_km && (
            <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-lg">
              <span className="font-semibold text-green-900 dark:text-green-200">Distance:</span>
              <span className="text-green-800 dark:text-green-300">{itinerary.total_distance_km} km</span>
            </div>
          )}
        </div>
      </div>
      {/* Timeline */}
      {days.length > 0 ? (
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-500 to-teal-300 dark:to-teal-700"></div>
          <div className="space-y-8">
            {days.map((dayNum) => (
              <div key={dayNum} className="space-y-4">
                {/* Day header */}
                <div className="flex items-center gap-4 ml-20 md:ml-24">
                  <div className="absolute left-1 md:left-2 w-12 h-12 md:w-14 md:h-14 bg-teal-600 hover:bg-teal-700 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg transition-colors">
                    Day {dayNum}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Day {dayNum}</h2>
                  </div>
                </div>
                {/* Stops for this day */}
                <div className="ml-20 md:ml-24 space-y-4">
                  {groupedStops[dayNum].map((stop, stopIndex) => {
                    const isLastStop = stopIndex === groupedStops[dayNum].length - 1;
                    const nextDayIndex = days.indexOf(dayNum) + 1;
                    const showTravelTime =
                      !isLastStop && stopIndex < groupedStops[dayNum].length - 1;
                    return (
                      <div key={stop.id} className="space-y-3">
                        {/* Travel time from previous */}
                        {stopIndex > 0 && stop.travel_time_from_prev_hours && (
                          <div className="pl-4 border-l-2 border-amber-400 py-2 ml-4">
                            <p className="text-sm text-amber-700 dark:text-amber-300 font-semibold">
                              ➜ Travel time: {stop.travel_time_from_prev_hours}h
                            </p>
                          </div>
                        )}
                        {/* Stop card */}
                        <div className="bg-white dark:bg-gray-950 border-2 border-gray-200 dark:border-gray-800 rounded-lg p-5 space-y-3 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                {stop.title || (stop.places?.name ? stop.places.name : 'Stop')}
                              </h3>
                              {stop.places?.name && stop.title && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {stop.places.name}
                                </p>
                              )}
                            </div>
                            {stop.duration_hours && (
                              <div className="bg-teal-100 dark:bg-teal-900/30 px-3 py-1 rounded text-sm font-semibold text-teal-800 dark:text-teal-300 whitespace-nowrap">
                                {stop.duration_hours}h
                              </div>
                            )}
                          </div>
                          {stop.description && (
                            <p className="text-sm text-gray-700 dark:text-gray-300">{stop.description}</p>
                          )}
                          {stop.activities && stop.activities.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Activities:</p>
                              <div className="flex flex-wrap gap-2">
                                {stop.activities.map((activity, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full"
                                  >
                                    {activity}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {stop.accommodation_id && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded border border-blue-200 dark:border-blue-800 text-sm text-blue-800 dark:text-blue-300">
                              <p className="font-semibold">Accommodation arranged for this stop</p>
                            </div>
                          )}
                          {stop.places && (stop.places.latitude || stop.places.longitude) && (
                            <a
                              href={`https://travel.mukoko.com/place/${stop.place_id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block text-sm px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded font-semibold transition-colors"
                            >
                              View on Map
                            </a>
                          )}
                        </div>
                        {/* Travel time to next day */}
                        {isLastStop &&
                          nextDayIndex < days.length &&
                          groupedStops[days[nextDayIndex]] &&
                          groupedStops[days[nextDayIndex]][0]?.travel_time_from_prev_hours && (
                            <div className="pl-4 border-l-2 border-amber-400 py-2 ml-4">
                              <p className="text-sm text-amber-700 dark:text-amber-300 font-semibold">
                                ➜ Travel to next stop: {groupedStops[days[nextDayIndex]][0].travel_time_from_prev_hours}h
                              </p>
                            </div>
                          )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">No stops scheduled for this itinerary.</p>
        </div>
      )}
    </div>
  );
};
