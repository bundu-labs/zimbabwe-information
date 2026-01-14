'use client';

import React from 'react';

/**
 * LocationMap - Embeds an OpenStreetMap for a destination
 *
 * @param {number} lat - Latitude coordinate
 * @param {number} lng - Longitude coordinate
 * @param {number} zoom - Zoom level (1-18, default 12)
 * @param {string} title - Location name for accessibility
 * @param {boolean} showMarker - Whether to show a marker pin (default true)
 * @param {string} height - Map height (default "400px")
 *
 * Usage in MDX:
 * import { LocationMap } from '/snippets/LocationMap.jsx';
 * <LocationMap lat={-17.9243} lng={25.8572} zoom={14} title="Victoria Falls" />
 */
export const LocationMap = ({
  lat,
  lng,
  zoom = 12,
  title = "Location",
  showMarker = true,
  height = "400px"
}) => {
  if (!lat || !lng) {
    return (
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center text-gray-600 dark:text-gray-400">
        Map coordinates not available
      </div>
    );
  }

  // Calculate bounding box for the embed (rough approximation based on zoom)
  // Higher zoom = smaller bbox
  const delta = 0.5 / Math.pow(2, zoom - 10);
  const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`;

  // Build OpenStreetMap embed URL
  let mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik`;
  if (showMarker) {
    mapUrl += `&marker=${lat},${lng}`;
  }

  // Link to full map
  const fullMapUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=${zoom}/${lat}/${lng}`;

  return (
    <div className="my-6">
      {/* GPS Coordinates Display */}
      <div className="flex flex-wrap items-center gap-4 mb-3 text-sm">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="font-mono">
            {lat.toFixed(4)}°{lat >= 0 ? 'N' : 'S'}, {lng.toFixed(4)}°{lng >= 0 ? 'E' : 'W'}
          </span>
        </div>
        <a
          href={fullMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 hover:underline"
        >
          View larger map →
        </a>
      </div>

      {/* Map Container */}
      <div
        className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
        style={{ height }}
      >
        <iframe
          src={mapUrl}
          style={{
            width: '100%',
            height: '100%',
            border: 0
          }}
          title={`Map of ${title}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>

      {/* Attribution */}
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
        Map data © <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          OpenStreetMap contributors
        </a>
      </div>
    </div>
  );
}
