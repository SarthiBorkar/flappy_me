import { EXTERNAL_URLS } from './constants';

/**
 * Generate Twitter share URL
 */
export const getTwitterShareUrl = (
  score: number,
  playerName: string,
  nftUrl?: string
): string => {
  const text = nftUrl
    ? `I just scored ${score} points in Flappy Bird on @Celo and minted it as an NFT! 🐦🎮 Can you beat my score?`
    : `I just scored ${score} points in Flappy Bird on @Celo! 🐦🎮 Can you beat my score?`;

  const url = nftUrl || EXTERNAL_URLS.APP_URL;

  const params = new URLSearchParams({
    text,
    url,
    hashtags: 'FlappyBird,Celo,Web3Gaming,MiniPay',
  });

  return `${EXTERNAL_URLS.TWITTER_INTENT}?${params.toString()}`;
};

/**
 * Generate WhatsApp share URL
 */
export const getWhatsAppShareUrl = (score: number, playerName: string): string => {
  const text = `I just scored ${score} points in Flappy Bird on Celo! 🐦🎮 Can you beat my score? ${EXTERNAL_URLS.APP_URL}`;

  return `https://wa.me/?text=${encodeURIComponent(text)}`;
};

/**
 * Generate Telegram share URL
 */
export const getTelegramShareUrl = (score: number, playerName: string): string => {
  const text = `I just scored ${score} points in Flappy Bird on Celo! 🐦🎮`;
  const url = EXTERNAL_URLS.APP_URL;

  return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(
    text
  )}`;
};

/**
 * Generate shareable text
 */
export const getShareText = (
  score: number,
  playerName: string,
  includeUrl: boolean = true
): string => {
  const baseText = `${playerName} scored ${score} points in Flappy Bird on Celo! 🐦🎮`;
  return includeUrl ? `${baseText}\n${EXTERNAL_URLS.APP_URL}` : baseText;
};

/**
 * Use Web Share API (mobile native sharing)
 */
export const shareViaWebAPI = async (
  score: number,
  playerName: string
): Promise<boolean> => {
  if (!navigator.share) {
    console.warn('Web Share API not supported');
    return false;
  }

  try {
    await navigator.share({
      title: 'Flappy Bird Score',
      text: getShareText(score, playerName, false),
      url: EXTERNAL_URLS.APP_URL,
    });

    return true;
  } catch (error) {
    // User cancelled or error occurred
    console.log('Share cancelled or failed:', error);
    return false;
  }
};

/**
 * Copy share link to clipboard
 */
export const copyShareLink = async (score: number, playerName: string): Promise<boolean> => {
  const text = getShareText(score, playerName, true);

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};
