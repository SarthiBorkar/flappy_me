/**
 * IPFS Upload Utilities
 * Uses NFT.Storage API for decentralized storage
 */

export interface IPFSUploadResult {
  imageUrl: string;
  metadataUrl: string;
  imageHash: string;
  metadataHash: string;
}

/**
 * Upload to IPFS via NFT.Storage
 * Note: This is a placeholder - you'll need to implement the actual API call
 */
export const uploadToIPFS = async (
  imageFile: File,
  metadata: object
): Promise<IPFSUploadResult> => {
  try {
    // This would use NFT.Storage API
    // For now, return mock data
    // In production, you would:
    // 1. Upload image to NFT.Storage
    // 2. Get image IPFS hash
    // 3. Upload metadata with image hash
    // 4. Get metadata IPFS hash

    console.warn('IPFS upload is mocked - implement NFT.Storage integration');

    // Mock result
    const mockImageHash = `Qm${Math.random().toString(36).substring(2, 15)}`;
    const mockMetadataHash = `Qm${Math.random().toString(36).substring(2, 15)}`;

    return {
      imageUrl: `ipfs://${mockImageHash}`,
      metadataUrl: `ipfs://${mockMetadataHash}`,
      imageHash: mockImageHash,
      metadataHash: mockMetadataHash,
    };
  } catch (error) {
    console.error('IPFS upload failed:', error);
    throw error;
  }
};

/**
 * Upload to IPFS via server-side API route
 */
export const uploadToIPFSViaAPI = async (
  imageDataUrl: string,
  metadata: object
): Promise<IPFSUploadResult> => {
  try {
    const response = await fetch('/api/uploadToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: imageDataUrl,
        metadata,
      }),
    });

    if (!response.ok) {
      throw new Error('IPFS upload failed');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('IPFS API upload failed:', error);
    throw error;
  }
};

/**
 * Get IPFS gateway URL
 */
export const getIPFSGatewayUrl = (ipfsUrl: string): string => {
  if (ipfsUrl.startsWith('ipfs://')) {
    const hash = ipfsUrl.replace('ipfs://', '');
    return `https://ipfs.io/ipfs/${hash}`;
  }
  return ipfsUrl;
};
