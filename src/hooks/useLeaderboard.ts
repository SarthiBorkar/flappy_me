'use client';

import { useState, useEffect, useCallback } from 'react';
import { getLeaderboard, getPlayerRank } from '@/utils/contractInteraction';
import type { LeaderboardEntry } from '@/types';
import type { Address } from 'viem';

export interface UseLeaderboardReturn {
  leaderboard: LeaderboardEntry[];
  playerRank: number;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useLeaderboard = (
  playerAddress?: Address | null,
  limit: number = 10
): UseLeaderboardReturn => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [playerRank, setPlayerRank] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getLeaderboard(limit);
      setLeaderboard(data);

      // Fetch player rank if address provided
      if (playerAddress) {
        const rank = await getPlayerRank(playerAddress);
        setPlayerRank(rank);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch leaderboard';
      setError(message);
      console.error('Leaderboard fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [playerAddress, limit]);

  const refresh = useCallback(async () => {
    await fetchLeaderboard();
  }, [fetchLeaderboard]);

  // Load on mount
  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return {
    leaderboard,
    playerRank,
    isLoading,
    error,
    refresh,
  };
};
