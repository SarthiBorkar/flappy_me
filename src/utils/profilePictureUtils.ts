import { pixelateImage, getDefaultBirdImage } from './imageProcessor';
import { STORAGE_KEYS } from './constants';
import type { ProfilePicture } from '@/types';

/**
 * Get profile picture from MiniPay
 * Note: This is a placeholder - actual implementation depends on MiniPay API
 */
export const getMiniPayProfilePicture = async (): Promise<string | null> => {
  try {
    // Check if MiniPay provides profile picture
    // This is implementation-specific and may need to be adjusted
    // based on actual MiniPay SDK/API

    // For now, return null (will use default or uploaded image)
    return null;
  } catch (error) {
    console.error('Failed to get MiniPay profile picture:', error);
    return null;
  }
};

/**
 * Get cached profile picture from localStorage
 */
export const getCachedProfilePicture = (): ProfilePicture | null => {
  try {
    const cached = localStorage.getItem(STORAGE_KEYS.PROFILE_PICTURE);
    if (cached) {
      return JSON.parse(cached) as ProfilePicture;
    }
    return null;
  } catch (error) {
    console.error('Failed to get cached profile picture:', error);
    return null;
  }
};

/**
 * Cache profile picture to localStorage
 */
export const cacheProfilePicture = (profilePicture: ProfilePicture): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE_PICTURE, JSON.stringify(profilePicture));
  } catch (error) {
    console.error('Failed to cache profile picture:', error);
  }
};

/**
 * Process and pixelate profile picture
 */
export const processProfilePicture = async (
  imageUrl: string
): Promise<ProfilePicture> => {
  try {
    // Pixelate the image
    const pixelated = await pixelateImage(imageUrl, {
      pixelSize: 4,
      outputSize: 40,
    });

    const profilePicture: ProfilePicture = {
      original: imageUrl,
      pixelated,
      cached: true,
    };

    // Cache it
    cacheProfilePicture(profilePicture);

    return profilePicture;
  } catch (error) {
    console.error('Failed to process profile picture:', error);
    throw error;
  }
};

/**
 * Get or create profile picture
 * Priority: Cached > MiniPay > Default
 */
export const getProfilePicture = async (): Promise<ProfilePicture> => {
  // Try cached first
  const cached = getCachedProfilePicture();
  if (cached) {
    return cached;
  }

  // Try MiniPay
  const miniPayPic = await getMiniPayProfilePicture();
  if (miniPayPic) {
    return processProfilePicture(miniPayPic);
  }

  // Use default
  const defaultImage = getDefaultBirdImage();
  return {
    original: defaultImage,
    pixelated: defaultImage,
    cached: false,
  };
};

/**
 * Upload and process custom profile picture
 */
export const uploadCustomProfilePicture = async (
  file: File
): Promise<ProfilePicture> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const dataUrl = e.target?.result as string;
        const processed = await processProfilePicture(dataUrl);
        resolve(processed);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Clear cached profile picture
 */
export const clearCachedProfilePicture = (): void => {
  localStorage.removeItem(STORAGE_KEYS.PROFILE_PICTURE);
};
