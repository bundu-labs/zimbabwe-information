// For snippets folder: snippets/trustpilot.js

import React, { useEffect } from 'react';

export default function Trustpilot({ 
  locale = "en-US",
  templateId = "56278e9abfbbba0bdcd568bc",
  businessunitId = "67f9200dd68b154e79a25462",
  styleHeight = "52px",
  styleWidth = "100%",
  variant = "review-collector" // Options: "review-collector", "mini", "carousel", etc.
}) {
  useEffect(() => {
    // Load Trustpilot script if not already loaded
    if (!window.Trustpilot) {
      const script = document.createElement('script');
      script.src = '//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js';
      script.async = true;
      script.onload = () => {
        // Initialize Trustpilot widgets after script loads
        if (window.Trustpilot) {
          window.Trustpilot.loadFromElement(document.querySelector('.trustpilot-widget'));
        }
      };
      document.head.appendChild(script);
    } else {
      // If script is already loaded, just reinitialize
      window.Trustpilot.loadFromElement(document.querySelector('.trustpilot-widget'));
    }

    // Cleanup function
    return () => {
      // Optional: cleanup if needed
    };
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
          Trustpilot
        </a>
      </div>
    </div>
  );
}

// Alternative simplified version for basic usage
export function TrustpilotSimple() {
  useEffect(() => {
    // Load Trustpilot script
    const script = document.createElement('script');
    script.src = '//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js';
    script.async = true;
    document.head.appendChild(script);
  }, []);

  return (
    <div className="trustpilot-widget my-4" 
         data-locale="en-US" 
         data-template-id="56278e9abfbbba0bdcd568bc" 
         data-businessunit-id="67f9200dd68b154e79a25462" 
         data-style-height="52px" 
         data-style-width="100%">
      <a href="https://www.trustpilot.com/review/travel-info.co.zw" 
         target="_blank" 
         rel="noopener noreferrer"
         className="text-blue-600 hover:text-blue-800 underline">
        Trustpilot Reviews for Zimbabwe Travel Information
      </a>
    </div>
  );
}