'use client';

import React from 'react';
import { verificationTiers } from './supabase.js';

/**
 * VerificationBadge — mineral-colored trust badge from system.verification_tier
 *
 * Renders a single checkmark badge whose color corresponds to the entity's
 * verification level across the Mukoko platform. Five tiers:
 *   unverified → community (Terracotta) → otp (Cobalt) → government (Gold) → licensed (Tanzanite)
 *
 * Usage:
 *   import { VerificationBadge } from '/snippets/VerificationBadge.jsx';
 *   <VerificationBadge tier="licensed" size="md" showLabel={true} />
 *
 * Props:
 *   tier      — 'unverified' | 'community' | 'otp' | 'government' | 'licensed'
 *   size      — 'sm' | 'md' | 'lg' (default: 'md')
 *   showLabel — show tier label text next to badge (default: false)
 *   darkMode  — force dark mode colors (default: auto via CSS class)
 */
export const VerificationBadge = ({ tier = 'unverified', size = 'md', showLabel = false }) => {
  const tierInfo = verificationTiers[tier] || verificationTiers.unverified;

  const sizes = {
    sm: { badge: 'w-4 h-4', text: 'text-xs', gap: 'gap-1' },
    md: { badge: 'w-5 h-5', text: 'text-sm', gap: 'gap-1.5' },
    lg: { badge: 'w-6 h-6', text: 'text-base', gap: 'gap-2' },
  };
  const s = sizes[size] || sizes.md;

  const icons = {
    circle: (
      <circle cx="12" cy="12" r="9" strokeWidth="2" stroke="currentColor" fill="none" />
    ),
    users: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    ),
    phone: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 8V5z" />
    ),
    'shield-check': (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    ),
    award: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    ),
  };

  return (
    <span
      className={`inline-flex items-center ${s.gap} flex-shrink-0`}
      title={`${tierInfo.label}${tierInfo.mineral ? ` — ${tierInfo.mineral}` : ''}`}
    >
      <svg
        className={`${s.badge} flex-shrink-0`}
        style={{ color: tierInfo.darkColor }}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-label={`${tierInfo.label} verification`}
      >
        {icons[tierInfo.icon] || icons.circle}
      </svg>
      {showLabel && (
        <span
          className={`${s.text} font-medium`}
          style={{ color: tierInfo.darkColor }}
        >
          {tierInfo.label}
        </span>
      )}
    </span>
  );
};
