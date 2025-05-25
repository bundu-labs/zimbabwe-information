// For components folder: components/Trustpilot.js

import React, { useEffect } from 'react';

export default function Trustpilot({ 
  locale = "en-US",
  templateId = "56278e9abfbbba0bdcd568bc",
  businessunitId = "67f9200dd68b154e79a25462",
  styleHeight = "52px",
  styleWidth = "100%"
}) {
  useEffect(() => {
    // Load Trustpilot script if not already loaded
    if (typeof window !== 'undefined' && !window.trustpilotLoaded) {
      const script = document.createElement('script');
      script.src = '//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js';
      script.async = true;
      script.onload = () => {
        window.trustpilotLoaded = true;
        // Initialize Trustpilot widgets after script loads
        if (window.Trustpilot) {
          window.Trustpilot.loadFromElement(document.querySelectorAll('.trustpilot-widget'));
        }
      };
      document.head.appendChild(script);
    } else if (typeof window !== 'undefined' && window.Trustpilot) {
      // If script is already loaded, just reinitialize
      setTimeout(() => {
        if (window.Trustpilot) {
          window.Trustpilot.loadFromElement(document.querySelectorAll('.trustpilot-widget'));
        }
      }, 100);
    }
  }, []);

  return (
    <div className="my-4">
      <div 
        className="trustpilot-widget" 
        data-locale={locale}
        data-template-id={templateId}
        data-businessunit-id={businessunitId}
        data-style-height={styleHeight}
        data-style-width={styleWidth}
      >
        <a 
          href="https://www.trustpilot.com/review/travel-info.co.zw" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Trustpilot Reviews for Zimbabwe Travel Information
        </a>
      </div>
    </div>
  );
}