// For components folder: components/HelpDeskForm.js

import React, { useEffect, useRef } from 'react';

export default function HelpDeskForm() {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    const iframe = iframeRef.current;
    const handleIframeLoad = () => {
      try {
        const computedStyle = window.getComputedStyle(document.body);
        
        const styleToSend = {
          fontFamily: computedStyle.fontFamily,
          color: computedStyle.color,
          backgroundColor: computedStyle.backgroundColor,
          fontSize: computedStyle.fontSize
        };
        
        iframe.contentWindow.postMessage({
          type: 'APPLY_PARENT_STYLES',
          styles: styleToSend
        }, 'https://forms.helpdesk.com');
      } catch (error) {
        console.error('Error sending styles to iframe:', error);
      }
    };

    iframe.addEventListener('load', handleIframeLoad);

    return () => {
      iframe.removeEventListener('load', handleIframeLoad);
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto my-6 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
      <iframe 
        ref={iframeRef}
        sandbox="allow-scripts allow-popups allow-forms allow-same-origin" 
        width="100%" height="670px"
        className="w-full h-[670px] border-0 dark:bg-gray-900"
        src="https://forms.helpdesk.com?licenseID=2046191682&contactFormID=b016bbb4-e37a-4519-8259-fe4a2e6693ce"
        title="Helpdesk Support Form"
      >
      </iframe>
    </div>
  );
}
