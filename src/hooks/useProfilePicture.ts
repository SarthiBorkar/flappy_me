'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getProfilePicture,
  uploadCustomProfilePicture,
  clearCachedProfilePicture,
} from '@/utils/profilePictureUtils';
import type { ProfilePicture } from '@/types';

export interface UseProfilePictureReturn {
  profilePicture: ProfilePicture | null;
  isLoading: boolean;
  error: string | null;
  uploadPicture: (file: File) => Promise<void>;
  clearPicture: () => void;
  refresh: () => Promise<void>;
}

export const useProfilePicture = (): UseProfilePictureReturn => {
  const [profilePicture, setProfilePicture] = useState<ProfilePicture | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfilePicture = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const picture = await getProfilePicture();
      setProfilePicture(picture);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load profile picture';
      setError(message);
      console.error('Profile picture load error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const uploadPicture = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const processed = await uploadCustomProfilePicture(file);
      setProfilePicture(processed);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to upload picture';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearPicture = useCallback(() => {
    clearCachedProfilePicture();
    loadProfilePicture();
  }, [loadProfilePicture]);

  const refresh = useCallback(async () => {
    clearCachedProfilePicture();
    await loadProfilePicture();
  }, [loadProfilePicture]);

  // Load on mount
  useEffect(() => {
    loadProfilePicture();
  }, [loadProfilePicture]);

  return {
    profilePicture,
    isLoading,
    error,
    uploadPicture,
    clearPicture,
    refresh,
  };
};
