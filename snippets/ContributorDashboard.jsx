import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase.js';
/**
 * ContributorDashboard — authenticated content gap browser
 *
 * Shows content gaps from content.content_gap, sortable by priority,
 * difficulty, and region. Authenticated users can claim a gap to write about.
 *
 * Usage in MDX:
 *   import { ContributorDashboard } from '/snippets/ContributorDashboard.jsx';
 *   <ContributorDashboard />
 *
 * Requires: user must be signed in via Supabase Auth (shared Mukoko identity).
 */
const priorityConfig = {
  critical: { label: 'Critical',  color: 'text-red-600 dark:text-red-400',    bg: 'bg-red-50 dark:bg-red-900/20',    border: 'border-red-200 dark:border-red-800' },
  high:     { label: 'High',      color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800' },
  medium:   { label: 'Medium',    color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20',  border: 'border-amber-200 dark:border-amber-800' },
  low:      { label: 'Low',       color: 'text-gray-500 dark:text-gray-400',   bg: 'bg-gray-50 dark:bg-gray-800',       border: 'border-gray-200 dark:border-gray-700' },
};
const gapTypeLabels = {
  missing_article:    'Missing article',
  incomplete_content: 'Incomplete content',
  outdated_content:   'Outdated content',
  missing_photos:     'Missing photos',
  missing_data:       'Missing data',
};
// ---------------------------------------------------------------------------
// Auth gate — shows login prompt if not signed in
// ---------------------------------------------------------------------------
const AuthGate = ({ onSignIn, loading }) => (
  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
      <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    </div>
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Sign in to contribute</h3>
    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
      The contributor dashboard shows what content Zimbabwe needs most. Sign in with your Mukoko account to browse gaps and claim writing assignments.
    </p>
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <a
        href="https://business.mukoko.com/contribute"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
      >
        Open contributor dashboard →
      </a>
      <button
        onClick={onSignIn}
        disabled={loading}
        className="px-6 py-3 border border-primary-600 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors font-medium disabled:opacity-50"
      >
        {loading ? 'Signing in...' : 'Sign in here'}
      </button>
    </div>
  </div>
);
// ---------------------------------------------------------------------------
// Gap card
// ---------------------------------------------------------------------------
const GapCard = ({ gap, onClaim, claiming }) => {
  const priority = priorityConfig[gap.priority] || priorityConfig.low;
  const typeLabel = gapTypeLabels[gap.gap_type] || gap.gap_type;
  return (
    <div className={`rounded-xl border p-5 ${priority.border} ${priority.bg} transition-shadow hover:shadow-md`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className={`text-xs font-bold uppercase tracking-wide ${priority.color}`}>
              {priority.label} priority
            </span>
            <span className="px-2 py-0.5 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full border border-gray-200 dark:border-gray-700">
              {typeLabel}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
            {gap.title || 'Untitled gap'}
          </h3>
          {gap.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{gap.description}</p>
          )}
          {gap.entity_id && gap.entity_schema === 'places' && (
            <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <a
                href={`https://travel.mukoko.com/place/${gap.entity_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary-600 dark:text-primary-400"
              >
                View on map →
              </a>
            </div>
          )}
        </div>
        <button
          onClick={() => onClaim(gap)}
          disabled={claiming === gap.id || gap.status === 'claimed'}
          className="flex-shrink-0 px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {gap.status === 'claimed' ? 'Claimed' : claiming === gap.id ? 'Claiming...' : 'Claim'}
        </button>
      </div>
    </div>
  );
};
// ---------------------------------------------------------------------------
// Main ContributorDashboard
// ---------------------------------------------------------------------------
export const ContributorDashboard = () => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [gaps, setGaps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [claiming, setClaiming] = useState(null);
  const [claimedGaps, setClaimedGaps] = useState(new Set());
  const [filters, setFilters] = useState({ priority: '', gap_type: '' });
  // Auth check
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);
  // Fetch gaps when authenticated
  const fetchGaps = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let query = supabase
        .schema('content')
        .from('content_gap')
        .select(`
          id,
          gap_type,
          priority,
          status,
          title,
          description,
          entity_id,
          entity_type,
          entity_schema
        `)
        .in('status', ['open', 'claimed'])
        .order('priority', { ascending: false })
        .limit(30);
      if (filters.priority) query = query.eq('priority', filters.priority);
      if (filters.gap_type) query = query.eq('gap_type', filters.gap_type);
      const { data, error: err } = await query;
      if (err) throw err;
      setGaps(data || []);
    } catch (err) {
      setError('Unable to load content gaps. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filters]);
  useEffect(() => {
    if (user) fetchGaps();
  }, [user, fetchGaps]);
  const handleSignIn = async () => {
    setAuthLoading(true);
    // Redirect to Mukoko auth — shared identity across all apps
    window.location.href = 'https://business.mukoko.com/sign-in?redirect=' + encodeURIComponent(window.location.href);
  };
  const handleClaim = async (gap) => {
    if (!user) return;
    setClaiming(gap.id);
    try {
      const { error: err } = await supabase
        .schema('content')
        .from('content_gap')
        .update({ status: 'claimed', claimed_by: user.id, claimed_at: new Date().toISOString() })
        .eq('id', gap.id);
      if (err) throw err;
      setClaimedGaps((prev) => new Set([...prev, gap.id]));
      setGaps((prev) => prev.map((g) => g.id === gap.id ? { ...g, status: 'claimed' } : g));
      // Redirect to write the article
      window.open(`https://business.mukoko.com/contribute/${gap.id}`, '_blank');
    } catch (err) {
      setError('Unable to claim this gap. Please try again.');
    } finally {
      setClaiming(null);
    }
  };
  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }
  if (!user) {
    return <AuthGate onSignIn={handleSignIn} loading={authLoading} />;
  }
  const openGaps = gaps.filter((g) => g.status === 'open' || claimedGaps.has(g.id) === false);
  return (
    <div className="space-y-6">
      {/* User bar */}
      <div className="flex items-center justify-between p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-200 dark:border-primary-800">
        <div>
          <p className="text-sm font-medium text-primary-800 dark:text-primary-300">
            Signed in as {user.email}
          </p>
          <p className="text-xs text-primary-600 dark:text-primary-400">
            Claim a gap below and write the article on business.mukoko.com
          </p>
        </div>
        <button
          onClick={() => supabase.auth.signOut()}
          className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
        >
          Sign out
        </button>
      </div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={filters.priority}
          onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
        >
          <option value="">All priorities</option>
          {Object.entries(priorityConfig).map(([k, { label }]) => (
            <option key={k} value={k}>{label}</option>
          ))}
        </select>
        <select
          value={filters.gap_type}
          onChange={(e) => setFilters((f) => ({ ...f, gap_type: e.target.value }))}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
        >
          <option value="">All gap types</option>
          {Object.entries(gapTypeLabels).map(([k, label]) => (
            <option key={k} value={k}>{label}</option>
          ))}
        </select>
      </div>
      {/* Stats */}
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {openGaps.length} open gap{openGaps.length !== 1 ? 's' : ''} — claim one to start writing
      </p>
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
        </div>
      ) : gaps.length > 0 ? (
        <div className="space-y-4">
          {gaps.map((gap) => (
            <GapCard
              key={gap.id}
              gap={{ ...gap, status: claimedGaps.has(gap.id) ? 'claimed' : gap.status }}
              onClaim={handleClaim}
              claiming={claiming}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">No open content gaps matching your filters.</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Check back soon — new gaps are detected automatically.</p>
        </div>
      )}
    </div>
  );
};
