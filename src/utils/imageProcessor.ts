/**
 * Image Processing Utilities
 * Handles pixelation and profile picture processing
 */

export interface PixelationOptions {
  pixelSize: number; // Size of each pixel block
  outputSize: number; // Final output size
}

/**
 * Load image from URL
 */
export const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
};

/**
 * Pixelate an image using canvas
 */
export const pixelateImage = async (
  imageUrl: string,
  options: PixelationOptions = { pixelSize: 4, outputSize: 40 }
): Promise<string> => {
  try {
    // Load image
    const img = await loadImage(imageUrl);

    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    const { pixelSize, outputSize } = options;

    // Calculate intermediate size for pixelation
    const pixelatedSize = Math.floor(outputSize / pixelSize);

    // Step 1: Draw image at small size (creates pixelation effect)
    canvas.width = pixelatedSize;
    canvas.height = pixelatedSize;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, 0, 0, pixelatedSize, pixelatedSize);

    // Step 2: Scale back up (maintains pixelation)
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    if (!tempCtx) {
      throw new Error('Could not get temp canvas context');
    }

    tempCanvas.width = outputSize;
    tempCanvas.height = outputSize;
    tempCtx.imageSmoothingEnabled = false;
    tempCtx.drawImage(canvas, 0, 0, outputSize, outputSize);

    // Return as data URL
    return tempCanvas.toDataURL('image/png');
  } catch (error) {
    console.error('Pixelation failed:', error);
    throw error;
  }
};

/**
 * Create circular crop of image
 */
export const cropToCircle = async (imageUrl: string, size: number): Promise<string> => {
  try {
    const img = await loadImage(imageUrl);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    canvas.width = size;
    canvas.height = size;

    // Create circular clipping path
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // Draw image
    ctx.drawImage(img, 0, 0, size, size);

    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Circle crop failed:', error);
    throw error;
  }
};

/**
 * Get dominant color from image
 */
export const getDominantColor = async (imageUrl: string): Promise<string> => {
  try {
    const img = await loadImage(imageUrl);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    canvas.width = 1;
    canvas.height = 1;

    // Draw scaled down image
    ctx.drawImage(img, 0, 0, 1, 1);

    // Get pixel data
    const data = ctx.getImageData(0, 0, 1, 1).data;

    // Return as RGB string
    return `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
  } catch (error) {
    console.error('Get dominant color failed:', error);
    return 'rgb(255, 200, 50)'; // Default yellow
  }
};

/**
 * Convert image to blob
 */
export const imageUrlToBlob = async (imageUrl: string): Promise<Blob> => {
  const response = await fetch(imageUrl);
  return response.blob();
};

/**
 * Validate image URL
 */
export const isValidImageUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    const extension = urlObj.pathname.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '');
  } catch {
    return false;
  }
};

/**
 * Get default bird image (fallback)
 */
export const getDefaultBirdImage = (): string => {
  // Create a simple bird sprite using canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return '';
  }

  canvas.width = 40;
  canvas.height = 40;

  // Draw a simple yellow bird
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.arc(20, 20, 15, 0, Math.PI * 2);
  ctx.fill();

  // Eye
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(25, 15, 3, 0, Math.PI * 2);
  ctx.fill();

  // Beak
  ctx.fillStyle = '#FF8C00';
  ctx.beginPath();
  ctx.moveTo(32, 20);
  ctx.lineTo(40, 18);
  ctx.lineTo(32, 22);
  ctx.closePath();
  ctx.fill();

  return canvas.toDataURL('image/png');
};
