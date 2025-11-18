import {
  createPublicClient,
  createWalletClient,
  http,
  custom,
  formatEther,
  parseEther,
  type PublicClient,
  type WalletClient,
  type Address,
} from 'viem';
import { celo, celoAlfajores } from 'viem/chains';
import { stableTokenABI } from '@celo/abis';
import {
  NETWORK_ENV,
  CURRENT_CHAIN,
  CURRENT_NETWORK,
  CUSD_CONTRACT_ADDRESS,
  IS_DEBUG,
} from './constants';

// ============================================
// TYPE DEFINITIONS
// ============================================

declare global {
  interface Window {
    ethereum?: {
      isMiniPay?: boolean;
      isMetaMask?: boolean;
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on?: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}

// ============================================
// CHAIN CONFIGURATION
// ============================================

export const getChain = () => {
  return NETWORK_ENV === 'mainnet' ? celo : celoAlfajores;
};

export const getRPCUrl = () => {
  return CURRENT_NETWORK.rpcUrl;
};

// ============================================
// PUBLIC CLIENT (READ-ONLY)
// ============================================

let publicClientInstance: PublicClient | null = null;

export const getPublicClient = (): PublicClient => {
  if (!publicClientInstance) {
    publicClientInstance = createPublicClient({
      chain: getChain(),
      transport: http(getRPCUrl()),
    });

    if (IS_DEBUG) {
      console.log('✅ Public client created:', {
        chain: getChain().name,
        rpcUrl: getRPCUrl(),
      });
    }
  }

  return publicClientInstance;
};

// ============================================
// WALLET CLIENT (WRITE OPERATIONS)
// ============================================

let walletClientInstance: WalletClient | null = null;

export const getWalletClient = (): WalletClient | null => {
  if (typeof window === 'undefined') {
    console.warn('⚠️ Cannot create wallet client: Not in browser environment');
    return null;
  }

  if (!window.ethereum) {
    console.warn('⚠️ Cannot create wallet client: No wallet detected');
    return null;
  }

  if (!walletClientInstance) {
    walletClientInstance = createWalletClient({
      chain: getChain(),
      transport: custom(window.ethereum),
    });

    if (IS_DEBUG) {
      console.log('✅ Wallet client created:', {
        chain: getChain().name,
        isMiniPay: window.ethereum.isMiniPay,
      });
    }
  }

  return walletClientInstance;
};

// Reset wallet client (useful after disconnection)
export const resetWalletClient = () => {
  walletClientInstance = null;
};

// ============================================
// MINIPAY DETECTION
// ============================================

export const detectMiniPay = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  // Check for MiniPay flag
  if (window.ethereum?.isMiniPay) {
    return true;
  }

  // Fallback: Check user agent
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes('minipay') || userAgent.includes('opera mini');
};

// ============================================
// WALLET CONNECTION
// ============================================

export const connectWallet = async (): Promise<Address | null> => {
  try {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('No wallet detected');
    }

    // Request accounts using standard EIP-1102
    const accounts = (await window.ethereum.request({
      method: 'eth_requestAccounts',
      params: [],
    })) as string[];

    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found');
    }

    const address = accounts[0] as Address;

    if (IS_DEBUG) {
      console.log('✅ Wallet connected:', address);
    }

    return address;
  } catch (error) {
    console.error('❌ Wallet connection failed:', error);
    throw error;
  }
};

// ============================================
// GET CURRENT ACCOUNT
// ============================================

export const getCurrentAccount = async (): Promise<Address | null> => {
  try {
    if (typeof window === 'undefined' || !window.ethereum) {
      return null;
    }

    const accounts = (await window.ethereum.request({
      method: 'eth_accounts',
      params: [],
    })) as string[];

    return accounts && accounts.length > 0 ? (accounts[0] as Address) : null;
  } catch (error) {
    console.error('❌ Failed to get current account:', error);
    return null;
  }
};

// ============================================
// BALANCE QUERIES
// ============================================

/**
 * Get cUSD balance for an address
 * Uses the official Celo stableTokenABI
 */
export const getCUSDBalance = async (address: Address): Promise<string> => {
  try {
    const publicClient = getPublicClient();

    // Read balance from cUSD contract
    const balanceInBigInt = (await publicClient.readContract({
      address: CUSD_CONTRACT_ADDRESS,
      abi: stableTokenABI,
      functionName: 'balanceOf',
      args: [address],
    })) as bigint;

    // Format to human-readable (18 decimals)
    const balanceInEther = formatEther(balanceInBigInt);

    if (IS_DEBUG) {
      console.log('✅ cUSD Balance:', {
        address,
        balance: balanceInEther,
        raw: balanceInBigInt.toString(),
      });
    }

    return balanceInEther;
  } catch (error) {
    console.error('❌ Failed to get cUSD balance:', error);
    throw error;
  }
};

/**
 * Get native CELO balance
 */
export const getCELOBalance = async (address: Address): Promise<string> => {
  try {
    const publicClient = getPublicClient();

    const balanceInBigInt = await publicClient.getBalance({
      address,
    });

    const balanceInEther = formatEther(balanceInBigInt);

    if (IS_DEBUG) {
      console.log('✅ CELO Balance:', {
        address,
        balance: balanceInEther,
        raw: balanceInBigInt.toString(),
      });
    }

    return balanceInEther;
  } catch (error) {
    console.error('❌ Failed to get CELO balance:', error);
    throw error;
  }
};

/**
 * Get both cUSD and CELO balances
 */
export const getBalances = async (
  address: Address
): Promise<{ cUSD: string; CELO: string }> => {
  try {
    const [cUSD, CELO] = await Promise.all([
      getCUSDBalance(address),
      getCELOBalance(address),
    ]);

    return { cUSD, CELO };
  } catch (error) {
    console.error('❌ Failed to get balances:', error);
    throw error;
  }
};

// ============================================
// NETWORK VERIFICATION
// ============================================

/**
 * Check if user is on the correct network
 */
export const verifyNetwork = async (): Promise<boolean> => {
  try {
    if (typeof window === 'undefined' || !window.ethereum) {
      return false;
    }

    const chainId = (await window.ethereum.request({
      method: 'eth_chainId',
      params: [],
    })) as string;

    const currentChainId = parseInt(chainId, 16);
    const expectedChainId = getChain().id;

    if (IS_DEBUG) {
      console.log('🔍 Network verification:', {
        current: currentChainId,
        expected: expectedChainId,
        match: currentChainId === expectedChainId,
      });
    }

    return currentChainId === expectedChainId;
  } catch (error) {
    console.error('❌ Network verification failed:', error);
    return false;
  }
};

/**
 * Request network switch
 */
export const switchNetwork = async (): Promise<boolean> => {
  try {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('No wallet detected');
    }

    const chain = getChain();
    const chainIdHex = `0x${chain.id.toString(16)}`;

    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainIdHex }],
    });

    if (IS_DEBUG) {
      console.log('✅ Network switched to:', chain.name);
    }

    return true;
  } catch (error) {
    console.error('❌ Network switch failed:', error);
    return false;
  }
};

// ============================================
// EVENT LISTENERS
// ============================================

export type AccountChangedHandler = (accounts: Address[]) => void;
export type ChainChangedHandler = (chainId: string) => void;
export type DisconnectHandler = () => void;

/**
 * Listen for account changes
 */
export const onAccountsChanged = (handler: AccountChangedHandler) => {
  if (typeof window !== 'undefined' && window.ethereum?.on) {
    window.ethereum.on('accountsChanged', handler as (...args: unknown[]) => void);
  }
};

/**
 * Listen for chain changes
 */
export const onChainChanged = (handler: ChainChangedHandler) => {
  if (typeof window !== 'undefined' && window.ethereum?.on) {
    window.ethereum.on('chainChanged', handler as (...args: unknown[]) => void);
  }
};

/**
 * Listen for disconnection
 */
export const onDisconnect = (handler: DisconnectHandler) => {
  if (typeof window !== 'undefined' && window.ethereum?.on) {
    window.ethereum.on('disconnect', handler as (...args: unknown[]) => void);
  }
};

/**
 * Remove event listener
 */
export const removeListener = (event: string, handler: (...args: unknown[]) => void) => {
  if (typeof window !== 'undefined' && window.ethereum?.removeListener) {
    window.ethereum.removeListener(event, handler);
  }
};

// ============================================
// GAS ESTIMATION WITH FEE CURRENCY
// ============================================

/**
 * Estimate gas for a transaction with cUSD as fee currency
 * This follows Celo best practices for fee estimation
 */
export const estimateGasWithFeeCurrency = async (transaction: {
  account: Address;
  to: Address;
  data?: `0x${string}`;
  value?: bigint;
}): Promise<bigint> => {
  try {
    const publicClient = getPublicClient();

    const gasEstimate = await publicClient.estimateGas({
      ...transaction,
      feeCurrency: CUSD_CONTRACT_ADDRESS, // Pay fees in cUSD
    });

    if (IS_DEBUG) {
      console.log('✅ Gas estimated:', gasEstimate.toString());
    }

    return gasEstimate;
  } catch (error) {
    console.error('❌ Gas estimation failed:', error);
    throw error;
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Convert human-readable amount to Wei
 */
export const toWei = (amount: string): bigint => {
  return parseEther(amount);
};

/**
 * Convert Wei to human-readable amount
 */
export const fromWei = (amount: bigint): string => {
  return formatEther(amount);
};

/**
 * Shorten address for display (0x1234...5678)
 */
export const shortenAddress = (address: string, chars = 4): string => {
  if (!address) return '';
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
};

/**
 * Check if address is valid
 */
export const isValidAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};
