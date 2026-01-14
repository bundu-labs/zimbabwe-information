'use client';

import React from 'react';

console.log('🧪 TestComponent.jsx module loaded');

export const TestComponent = () => {
  console.log('🧪 TestComponent rendering');

  return (
    <div className="border-4 border-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg my-4">
      <h3 className="text-red-700 dark:text-red-300 font-bold text-lg mb-2">
        🧪 TEST COMPONENT IS WORKING!
      </h3>
      <p className="text-red-600 dark:text-red-400 text-sm">
        If you can see this message, it means:
      </p>
      <ul className="list-disc list-inside text-red-600 dark:text-red-400 text-sm mt-2 space-y-1">
        <li>React components are loading correctly</li>
        <li>The _components directory is being recognized</li>
        <li>JSX is being processed properly</li>
      </ul>
      <p className="text-red-600 dark:text-red-400 text-xs mt-3 font-mono">
        Check the browser console for additional debug logs (🟢🟡🔵✅)
      </p>
    </div>
  );
}
