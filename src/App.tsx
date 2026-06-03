/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  BatteryCharging, 
  Clock, 
  Sun, 
  Send, 
  Youtube, 
  Twitter, 
  Calendar, 
  Coins, 
  Users, 
  Wallet, 
  ChevronRight, 
  Sparkles, 
  Languages, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Crown, 
  Award, 
  Trophy,
  User,
  Pen,
  Play, 
  Info, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  ArrowUpRight,
  TrendingUp,
  RotateCcw,
  Egg,
  Flame,
  ShieldAlert,
  ArrowUpDown,
  Lock,
  Tv,
  RefreshCw
} from 'lucide-react';
import { GameState, UpgradeItem, SocialTask, WithdrawalRecord } from './types';
import { UPGRADE_ITEMS, SOCIAL_TASKS, getUpgradeCost, formatNumber, MINE_CARDS, MineCard, getCardUpgradeCost } from './data';
import { translations } from './translations';

// Custom component to dynamically render the corresponding Lucide icons
function LucideIcon({ name, className }: { name: string; className?: string }) {
  const iconMap: Record<string, any> = {
    Zap,
    BatteryCharging,
    Clock,
    Sun,
    Send,
    Youtube,
    Twitter,
    Calendar,
    Coins,
    Users,
    Wallet,
    TrendingUp,
    ShieldAlert,
    Sparkles,
    Flame,
    CheckCircle2
  };
  const IconComponent = iconMap[name] || Egg;
  return <IconComponent className={className} />;
}

interface ClickBubbles {
  id: number;
  x: number;
  y: number;
  value: number;
}

// Initial mock withdrawals for visual immersion
const INITIAL_WITHDRAWALS: WithdrawalRecord[] = [
  {
    id: "tx-b0492",
    phone: "UQda7...8K1b",
    operator: "TON Space",
    eggAmount: 15600,
    bdtAmount: 6.24,
    status: "completed",
    timestamp: Date.now() - 3600000 * 2, // 2 hours ago
    trxId: "EQCf7K29ZpdL1o9"
  },
  {
    id: "tx-n2813",
    phone: "UQbc8...7X2o",
    operator: "Tonkeeper",
    eggAmount: 85000,
    bdtAmount: 34.00,
    status: "approved",
    timestamp: Date.now() - 3600000 * 0.5, // 30 mins ago
    trxId: "EQA2n9Msd7yF9Z"
  },
  {
    id: "tx-r8491",
    phone: "UQzf3...2L9p",
    operator: "MyTonWallet",
    eggAmount: 5000,
    bdtAmount: 2.00,
    status: "pending",
    timestamp: Date.now() - 60000, // 1 min ago
    trxId: "EQDa93Md87Bh9K"
  }
];

export interface LeagueInfo {
  name: string;
  badgeBg: string;
  emoji: string;
}

export function getLeagueInfo(balance: number): LeagueInfo {
  if (balance < 100000) {
    return {
      name: "Bronze",
      badgeBg: "bg-amber-700/25 border-amber-700/30 text-amber-500",
      emoji: "🟫"
    };
  } else if (balance < 1000000) {
    return {
      name: "Silver",
      badgeBg: "bg-slate-400/25 border-slate-400/30 text-slate-300",
      emoji: "⬜"
    };
  } else if (balance < 5000000) {
    return {
      name: "Gold",
      badgeBg: "bg-yellow-500/20 border-yellow-500/30 text-yellow-400",
      emoji: "🟨"
    };
  } else if (balance < 10000000) {
    return {
      name: "Platinum",
      badgeBg: "bg-cyan-500/20 border-cyan-500/30 text-cyan-300",
      emoji: "💿"
    };
  } else {
    return {
      name: "Diamond",
      badgeBg: "bg-indigo-500/30 border-indigo-500/40 text-indigo-300 animate-pulse",
      emoji: "💎"
    };
  }
}

const MOCK_LEADERBOARD_PLAYERS = [
  { username: "TonWhale", balance: 18500000, avatarColor: "from-blue-500 to-indigo-600" },
  { username: "EggLord", balance: 12000000, avatarColor: "from-amber-400 to-yellow-600" },
  { username: "CryptoHatcher", balance: 7800000, avatarColor: "from-emerald-400 to-teal-600" },
  { username: "GigaFarmer", balance: 4500000, avatarColor: "from-indigo-400 to-blue-600" },
  { username: "NotDim", balance: 2900000, avatarColor: "from-rose-400 to-pink-600" },
  { username: "DimMaster", balance: 1600000, avatarColor: "from-violet-400 to-purple-600" },
  { username: "CyberRooster", balance: 850000, avatarColor: "from-cyan-400 to-blue-600" },
  { username: "NestClaimer", balance: 420000, avatarColor: "from-orange-400 to-amber-600" },
  { username: "GoldenTap", balance: 180000, avatarColor: "from-yellow-400 to-amber-500" },
  { username: "SolDigger", balance: 65000, avatarColor: "from-fuchsia-400 to-pink-600" },
  { username: "EggFarmingNoob", balance: 5000, avatarColor: "from-zinc-500 to-slate-700" }
];

export default function App() {
  // Load initial state with default values, or fetch from local storage if existing
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('takar_dim_game_state_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure standard fields are populated
        return {
          streakCount: 0,
          lastClaimedStreakDate: null,
          profit_per_hour: 0,
          last_claim_timestamp: new Date().toISOString(),
          mine_cards_owned: [],
          usdt_balance: 0,
          username: "You",
          monetag_ads_watched: 0,
          monetag_completed_ids: [],
          monetag_last_watched_timestamp: null,
          monetag_slots_timestamps: {},
          ...parsed,
          lastSaved: Date.now()
        };
      } catch (e) {
        // Fallback below
      }
    }
    
    // Default fresh start state
    return {
      balance: 1000, // Give Starter Bonus
      lifetimeEggs: 1000,
      energy: 1000,
      maxEnergy: 1000,
      energyRechargeRate: 1,
      tapMultiplier: 1,
      autoClickRate: 0,
      lang: 'en',
      levels: {
        multitap: 1,
        energyTank: 1,
        autoNest: 0,
        rechargeSpeed: 1
      },
      referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      referredBy: null,
      referralRewardClaimed: false,
      tasksCompleted: [],
      streakCount: 0,
      lastClaimedStreakDate: null,
      profit_per_hour: 0,
      last_claim_timestamp: new Date().toISOString(),
      mine_cards_owned: [],
      usdt_balance: 0,
      username: "You",
      monetag_ads_watched: 0,
      monetag_completed_ids: [],
      monetag_last_watched_timestamp: null,
      monetag_slots_timestamps: {},
      lastSaved: Date.now()
    };
  });

  const [activeTab, setActiveTab] = useState<'tap' | 'mine' | 'earn' | 'boost' | 'invite' | 'wallet' | 'leaderboard'>('tap');
  const [mineCategory, setMineCategory] = useState<'Markets' | 'PR & Team' | 'Legal' | 'Specials'>('Markets');
  const [showOfflineClaimModal, setShowOfflineClaimModal] = useState<boolean>(false);
  const [offlineEarnedEggs, setOfflineEarnedEggs] = useState<number>(0);
  const [offlineElapsedSeconds, setOfflineElapsedSeconds] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showStreakModal, setShowStreakModal] = useState<boolean>(false);
  const [clickBubbles, setClickBubbles] = useState<ClickBubbles[]>([]);
  const [isTapping, setIsTapping] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);
  
  // Custom states for Social Tasks
  const [verifyingTaskId, setVerifyingTaskId] = useState<string | null>(null);
  
  // Custom states for Withdrawals
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>(() => {
    const saved = localStorage.getItem('takar_dim_withdrawals_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_WITHDRAWALS;
      }
    }
    return INITIAL_WITHDRAWALS;
  });
  const [withdrawalOperator, setWithdrawalOperator] = useState<'TON Space' | 'Tonkeeper' | 'MyTonWallet'>('TON Space');
  const [withdrawalWalletAddress, setWithdrawalWalletAddress] = useState<string>('');
  const [withdrawalAmount, setWithdrawalAmount] = useState<string>('');
  
  // States for Live Swap and Simulated Video Ads
  const [swapDirection, setSwapDirection] = useState<'eggToUsdt' | 'usdtToEgg'>('eggToUsdt');
  const [swapAmount, setSwapAmount] = useState<string>('');
  const [isAdPlaying, setIsAdPlaying] = useState<boolean>(false);
  const [adCountdown, setAdCountdown] = useState<number>(0);
  const [adsRemainingToday, setAdsRemainingToday] = useState<number>(5);
  
  // Custom states for inviting UI & referrals
  const [copyFeedback, setCopyFeedback] = useState<boolean>(false);
  const [friendInputs, setFriendInputs] = useState<string>(''); // For simulation purposes

  // States for renaming custom username on the leaderboard
  const [isEditingUsername, setIsEditingUsername] = useState<boolean>(false);
  const [newUsernameInput, setNewUsernameInput] = useState<string>('');

  // Celebration state for mine card upgrades
  const [showUpgradeCelebration, setShowUpgradeCelebration] = useState<{
    card: MineCard;
    level: number;
    prevLvl: number;
  } | null>(null);

  // Auto-dismiss the celebration after 3.5 seconds
  useEffect(() => {
    if (showUpgradeCelebration) {
      const timer = setTimeout(() => {
        setShowUpgradeCelebration(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [showUpgradeCelebration]);

  // Monetag Ad Task State declarations
  const [monetagCountdown, setMonetagCountdown] = useState<number>(0);
  const [isMonetagAdPlaying, setIsMonetagAdPlaying] = useState<boolean>(false);
  const [monetagTicker, setMonetagTicker] = useState<number>(0);

  // Tick the component every second to let countdowns live-update
  useEffect(() => {
    const interval = setInterval(() => {
      setMonetagTicker(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getSlotCooldownSeconds = (slotId: number): number => {
    const timestamps = gameState.monetag_slots_timestamps || {};
    const timestampStr = timestamps[slotId];
    if (!timestampStr) return 0;
    
    const lastWatched = new Date(timestampStr).getTime();
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - lastWatched) / 1000);
    const remainingSecs = 3600 - elapsedSeconds;
    return remainingSecs > 0 ? remainingSecs : 0;
  };

  const timerRef = useRef<number | null>(null);

  // Sync game state to localStorage
  useEffect(() => {
    localStorage.setItem('takar_dim_game_state_v3', JSON.stringify(gameState));
  }, [gameState]);

  // Sync withdrawals to localStorage
  useEffect(() => {
    localStorage.setItem('takar_dim_withdrawals_v3', JSON.stringify(withdrawals));
  }, [withdrawals]);

  // Automatic Daily Login Streak Calculator
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yYear = yesterday.getFullYear();
    const yMonth = String(yesterday.getMonth() + 1).padStart(2, '0');
    const yDay = String(yesterday.getDate()).padStart(2, '0');
    const yesterdayStr = `${yYear}-${yMonth}-${yDay}`;

    const lastClaimed = gameState.lastClaimedStreakDate;

    // Evaluate streak validity
    if (!lastClaimed) {
      setShowStreakModal(true);
    } else if (lastClaimed === todayStr) {
      // Already claimed today
    } else if (lastClaimed === yesterdayStr) {
      setShowStreakModal(true);
    } else {
      // Streak broken. Reset streak count!
      setGameState(prev => ({
        ...prev,
        streakCount: 0
      }));
      setShowStreakModal(true);
    }
  }, []);

  // Calculate offline passive mine earnings on mount (up to max 3 hours)
  useEffect(() => {
    const lastSavedTime = gameState.lastSaved;
    if (lastSavedTime && gameState.profit_per_hour > 0) {
      const elapsedSec = Math.floor((Date.now() - lastSavedTime) / 1000);
      
      // Count if away for at least 15 seconds
      if (elapsedSec >= 15) {
        const maxSec = 3 * 3600; // Cap at 3 hours of offline accum
        const activeSeconds = Math.min(elapsedSec, maxSec);
        const earnedEggs = Math.floor((gameState.profit_per_hour / 3600) * activeSeconds);

        if (earnedEggs > 0) {
          setOfflineEarnedEggs(earnedEggs);
          setOfflineElapsedSeconds(elapsedSec);
          setShowOfflineClaimModal(true);
        }
      }
    }
  }, []);

  // Toast auto-clear
  useEffect(() => {
    if (toastMessage) {
      const handle = setTimeout(() => {
        setToastMessage(null);
      }, 3500);
      return () => clearTimeout(handle);
    }
  }, [toastMessage]);

  // Game Loop: Idle Eggs income accumulation and Energy recharge rate
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => {
        const timeDelta = 1; // 1 second intervals
        
        // 1. Calculate energy recovery
        const currentRechargeRate = prev.levels.rechargeSpeed; // +1 point/sec per level (starts at 1)
        const currentMaxEnergy = 1000 + (prev.levels.energyTank - 1) * 500;
        const newEnergy = Math.min(prev.energy + currentRechargeRate, currentMaxEnergy);
        
        // 2. Calculate passive incubator nest level earnings (+2 eggs/sec per level)
        const incubatorRate = prev.levels.autoNest * 2;
        const incubatorEarnings = incubatorRate * timeDelta;

        // 3. Calculate Mine Cards profit-per-hour (PPH) live earnings
        const minePphRatePerSec = prev.profit_per_hour / 3600;
        const mineEarnings = minePphRatePerSec * timeDelta;

        const totalPassiveEarnings = incubatorEarnings + mineEarnings;
        
        return {
          ...prev,
          energy: newEnergy,
          balance: prev.balance + totalPassiveEarnings,
          lifetimeEggs: prev.lifetimeEggs + totalPassiveEarnings,
          maxEnergy: currentMaxEnergy,
          energyRechargeRate: currentRechargeRate,
          tapMultiplier: prev.levels.multitap,
          autoClickRate: incubatorRate + minePphRatePerSec,
          lastSaved: Date.now()
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const t = (key: string): string => {
    const lang = gameState.lang;
    return translations[lang][key] || key;
  };

  // Sound Engine
  const playEggCrackSound = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(580, ctx.currentTime + 0.08);
      
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.13);
    } catch (e) {
      // Ignored if browser policy blocks autoplay before interaction or context is absent
    }
  };

  const playRewardSound = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
      osc.frequency.setValueAtTime(554.37, ctx.currentTime + 0.05); // C#5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
      
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.28);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      // Catch empty contexts
    }
  };

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToastMessage({ text, type });
  };

  // Egg Level Visual Customization
  const getEggLevelInfo = (lifetime: number) => {
    if (lifetime < 5000) {
      return {
        nameEn: "White Farm Egg",
        nameBn: "স্বাভাবিক সাদা ডিম",
        colorClass: "from-amber-50 to-orange-100 border-amber-200 shadow-amber-100",
        glowColor: "rgba(255, 230, 200, 0.4)",
        min: 0,
        max: 5000,
        badge: "Bronze Hatch",
        eggSvg: (
          <svg className="w-full h-full drop-shadow-2xl filter" viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="eggGrad1" cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="60%" stopColor="#FFF2DC" />
                <stop offset="100%" stopColor="#E6C89E" />
              </radialGradient>
            </defs>
            <path d="M50 5 Q15 65 15 85 A35 35 0 0 0 85 85 Q85 65 50 5 Z" fill="url(#eggGrad1)" />
            <path d="M25 80 Q50 65 75 80" stroke="#DFBA8A" strokeWidth="2" strokeDasharray="3 3" fill="none" opacity="0.6"/>
          </svg>
        )
      };
    } else if (lifetime < 25000) {
      return {
        nameEn: "Magical Copper Egg",
        nameBn: "অলৌকিক তামাটের ডিম",
        colorClass: "from-orange-400 to-amber-700 border-orange-500 shadow-orange-300",
        glowColor: "rgba(249, 115, 22, 0.5)",
        min: 5000,
        max: 25000,
        badge: "Silver Nestler",
        eggSvg: (
          <svg className="w-full h-full drop-shadow-2xl" viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="eggGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFBA82" />
                <stop offset="50%" stopColor="#CC621B" />
                <stop offset="100%" stopColor="#7C2D12" />
              </linearGradient>
            </defs>
            <path d="M50 5 Q15 65 15 85 A35 35 0 0 0 85 85 Q85 65 50 5 Z" fill="url(#eggGrad2)" />
            {/* Crack decorative lines */}
            <path d="M50 25 L45 45 L55 55 L40 75" fill="none" stroke="#FED7AA" strokeWidth="2.5" opacity="0.8" />
          </svg>
        )
      };
    } else if (lifetime < 100000) {
      return {
        nameEn: "Royal Gold Nugget Egg",
        nameBn: "রাজকীয় সোনার ডিম",
        colorClass: "from-yellow-300 to-amber-500 border-yellow-400 shadow-yellow-200",
        glowColor: "rgba(234, 179, 8, 0.7)",
        min: 25000,
        max: 100000,
        badge: "Gold Sovereign",
        eggSvg: (
          <svg className="w-full h-full drop-shadow-2xl" viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="eggGrad3" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="40%" stopColor="#EAB308" />
                <stop offset="85%" stopColor="#CA8A04" />
                <stop offset="100%" stopColor="#854D0E" />
              </radialGradient>
            </defs>
            <path d="M50 5 Q15 65 15 85 A35 35 0 0 0 85 85 Q85 65 50 5 Z" fill="url(#eggGrad3)" />
            {/* Cracks & premium sparkles */}
            <path d="M50 15 L53 35 L48 50 L57 65 L45 85" fill="none" stroke="#FEF08A" strokeWidth="2" opacity="0.9" />
            <circle cx="28" cy="45" r="1.5" fill="#FFF" opacity="0.8"/>
            <circle cx="72" cy="65" r="2" fill="#FFF" opacity="0.9"/>
          </svg>
        )
      };
    } else {
      return {
        nameEn: "Cyber Crypto Diamond Egg",
        nameBn: "সাইবার হীরা ক্রিপ্টো ডিম",
        colorClass: "from-cyan-300 via-pink-400 to-indigo-600 border-cyan-400 shadow-cyan-300",
        glowColor: "rgba(34, 211, 238, 0.8)",
        min: 100000,
        max: 500000,
        badge: "Diamond Overlord",
        eggSvg: (
          <svg className="w-full h-full drop-shadow-2xl" viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="eggGrad4" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22D3EE" />
                <stop offset="35%" stopColor="#EC4899" />
                <stop offset="70%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#312E81" />
              </linearGradient>
            </defs>
            <path d="M50 5 Q15 65 15 85 A35 35 0 0 0 85 85 Q85 65 50 5 Z" fill="url(#eggGrad4)" />
            {/* Grid neon lines */}
            <path d="M50 5 Q25 65 25 85" fill="none" stroke="#CCFBF1" strokeWidth="1" strokeDasharray="2 2" opacity="0.6"/>
            <path d="M50 5 Q75 65 75 85" fill="none" stroke="#CCFBF1" strokeWidth="1" strokeDasharray="2 2" opacity="0.6"/>
            <path d="M50 5 L50 120" fill="none" stroke="#FFF" strokeWidth="1.5" opacity="0.4" />
            <path d="M15 85 Q50 100 85 85" fill="none" stroke="#FFF" strokeWidth="1" opacity="0.5" />
            {/* Shimmer overlay */}
            <polygon points="50,15 58,40 50,55 42,40" fill="#FFF" opacity="0.3" />
          </svg>
        )
      };
    }
  };

  const eggInfo = getEggLevelInfo(gameState.lifetimeEggs);
  const currentMaxEnergy = 1000 + (gameState.levels.energyTank - 1) * 500;
  const energyPercentage = Math.round((gameState.energy / currentMaxEnergy) * 100);

  // Handle Egg Tapping inside Applet Viewport
  const handleEggTap = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    // Check energy constraint
    if (gameState.energy < gameState.tapMultiplier) {
      showToast(gameState.lang === 'en' ? "Low Energy! Wait for recharge panels." : "শক্তি কম! রিচার্জের জন্য অপেক্ষা করুন।", "error");
      return;
    }

    // Trigger tap scaling feedback inside browser
    setIsTapping(true);
    setTimeout(() => setIsTapping(false), 80);

    // Get click positions for float bubbles visual
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      if (e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    // Bound coordinates appropriately within the egg target rect
    const target = e.currentTarget.getBoundingClientRect();
    const x = clientX - target.left;
    const y = clientY - target.top;

    // Increments balance
    const pointsGained = gameState.tapMultiplier;
    
    setGameState(prev => ({
      ...prev,
      balance: prev.balance + pointsGained,
      lifetimeEggs: prev.lifetimeEggs + pointsGained,
      energy: Math.max(0, prev.energy - pointsGained)
    }));

    // Trigger crack sound pop
    playEggCrackSound();

    // Trigger floating bubble addition
    const bubbleId = Date.now() + Math.random();
    setClickBubbles(current => [
      ...current,
      { id: bubbleId, x: x || 100, y: y || 100, value: pointsGained }
    ]);

    // Async prune floating bubble after animation finishes to conserve react efficiency
    setTimeout(() => {
      setClickBubbles(current => current.filter(b => b.id !== bubbleId));
    }, 1200);
  };

  // Upgrading boosters
  const handlePurchaseUpgrade = (item: UpgradeItem) => {
    const currentLvl = gameState.levels[item.id] || 0;
    const upgradeCost = getUpgradeCost(item, currentLvl);

    if (gameState.balance < upgradeCost) {
      showToast(
        gameState.lang === 'en' 
          ? "Inadequate Egg Balance! Keep tapping the gold egg." 
          : "পর্যাপ্ত ব্যালেন্স নেই! ডিম ফাটানো বজায় রাখুন।", 
        "error"
      );
      return;
    }

    playRewardSound();
    
    setGameState(prev => {
      const updatedLevels = {
        ...prev.levels,
        [item.id]: currentLvl + 1
      };

      // recalculate immediate fields based on custom purchase guidelines
      const newMultitap = updatedLevels.multitap;
      const newMaxEnergy = 1000 + (updatedLevels.energyTank - 1) * 500;
      const newRechargeRate = updatedLevels.rechargeSpeed;
      const newAutoSec = updatedLevels.autoNest * 2;

      return {
        ...prev,
        balance: prev.balance - upgradeCost,
        levels: updatedLevels,
        tapMultiplier: newMultitap,
        maxEnergy: newMaxEnergy,
        energyRechargeRate: newRechargeRate,
        autoClickRate: newAutoSec
      };
    });

    showToast(
      gameState.lang === 'en'
        ? `Upgraded ${item.nameEn} to Level ${currentLvl + 1}!`
        : `${item.nameBn} সফলভাবে লেভেল ${currentLvl + 1}-এ উন্নীত!`,
      "success"
    );
  };

  // Daily login consecutive streak reward engine
  const handleClaimStreak = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;

    const lastClaimed = gameState.lastClaimedStreakDate;

    if (lastClaimed === todayStr) {
      showToast(
        gameState.lang === 'en' 
          ? "You already claimed your check-in reward today!" 
          : "আপনি আজ ইতিপূর্বেই হাজিরা বোনাস নিয়েছেন!",
        "error"
      );
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yYear = yesterday.getFullYear();
    const yMonth = String(yesterday.getMonth() + 1).padStart(2, '0');
    const yDay = String(yesterday.getDate()).padStart(2, '0');
    const yesterdayStr = `${yYear}-${yMonth}-${yDay}`;

    // Determine consecutive login streak count
    let newStreak = 1;
    if (lastClaimed === yesterdayStr) {
      newStreak = (gameState.streakCount || 0) + 1;
    }

    // Reward scaling based on consecutive days: Day 1-7+
    const streakRewards: Record<number, number> = {
      1: 1500,
      2: 3000,
      3: 5000,
      4: 8000,
      5: 12000,
      6: 20000
    };
    const rewardAmt = newStreak >= 7 ? 35000 : (streakRewards[newStreak] || 1500);

    playRewardSound();

    setGameState(prev => {
      // Ensure daily_reward task is marked as completed today so the indicator lists complete status if checked
      const checkedTasks = prev.tasksCompleted.includes('daily_reward') 
        ? prev.tasksCompleted 
        : [...prev.tasksCompleted, 'daily_reward'];

      return {
        ...prev,
        balance: prev.balance + rewardAmt,
        lifetimeEggs: prev.lifetimeEggs + rewardAmt,
        streakCount: newStreak,
        lastClaimedStreakDate: todayStr,
        tasksCompleted: checkedTasks
      };
    });

    showToast(
      gameState.lang === 'en'
        ? `Day ${newStreak} Streak Claimed! +${formatNumber(rewardAmt)} Eggs loaded.`
        : `টানা ${newStreak} দিনের হাজিরা বোনাস! +${formatNumber(rewardAmt)} ডিম সফলভাবে যোগ হয়েছে।`,
      "success"
    );

    setShowStreakModal(false);
  };

  // Completing social tasks
  const handleVerifyTask = (task: SocialTask) => {
    if (gameState.tasksCompleted.includes(task.id)) return;

    if (task.id === 'daily_reward') {
      setShowStreakModal(true);
      return;
    }

    // Standard task verification simulation
    setVerifyingTaskId(task.id);
    
    // Redirect user to the channel or action link using simple timeout imitation
    // We do NOT use window.open directly on trigger to respect iframe constraints, but guide them to click first
    setTimeout(() => {
      setVerifyingTaskId(null);
      playRewardSound();
      setGameState(prev => ({
        ...prev,
        balance: prev.balance + task.reward,
        lifetimeEggs: prev.lifetimeEggs + task.reward,
        tasksCompleted: [...prev.tasksCompleted, task.id]
      }));
      showToast(
        gameState.lang === 'en' 
          ? `Verified! +${formatNumber(task.reward)} Eggs Credited.` 
          : `যাচাইকরণ সফল! +${formatNumber(task.reward)} ডিম দেওয়া হয়েছে।`, 
        "success"
      );
    }, 2000);
  };

  // Copy referral URL to clipboard
  const handleCopyLink = () => {
    const inviteLink = `https://t.me/EggFarmingBot/app?startapp=ref_${gameState.referralCode}`;
    navigator.clipboard.writeText(inviteLink);
    setCopyFeedback(true);
    showToast(t("copied"), "success");
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  // Simulated Friend joining logic inside the app to showcase the mechanism dynamically
  const simulationSimulateInviteJoin = () => {
    if (!friendInputs.trim()) {
      showToast(gameState.lang === 'en' ? "Please type a friendly name to simulate" : "দয়া করে বান্ধবের নাম টাইপ করুন", "info");
      return;
    }
    
    const friendName = friendInputs.trim();
    playRewardSound();
    
    setGameState(prev => ({
      ...prev,
      balance: prev.balance + 5000,
      lifetimeEggs: prev.lifetimeEggs + 5000
    }));

    showToast(
      gameState.lang === 'en'
        ? `${friendName} joined! Received +5,000 Referral Eggs bonus.`
        : `${friendName} আপনার লিংকে যোগ দিয়েছেন! +৫,০০০ ডিম বোনাস যুক্ত হয়েছে।`,
      "success"
    );

    setFriendInputs('');
  };

  // Withdrawals engine
  const handleRequestWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();

    const eggAmt = parseInt(withdrawalAmount);
    if (isNaN(eggAmt) || eggAmt < 5000) {
      showToast(t("minAmountError"), "error");
      return;
    }

    if (gameState.balance < eggAmt) {
      showToast(t("insufficientFunds"), "error");
      return;
    }

    // Alphanumeric TON wallet address validation
    const walletAddressRegex = /^[a-zA-Z0-9_-]{30,60}$/;
    if (!walletAddressRegex.test(withdrawalWalletAddress)) {
      showToast(t("invalidPhone"), "error");
      return;
    }

    // Conversion: 1,000,000 Eggs = 1.00 USDT (Est.)
    const usdtValue = parseFloat((eggAmt / 1000000).toFixed(6));
    
    // Generate simulated TON hash
    const randomHex = "EQ" + Math.random().toString(36).substring(2, 12).toUpperCase();

    const newRecord: WithdrawalRecord = {
      id: `tx-${Math.random().toString(36).substring(2, 7)}`,
      phone: withdrawalWalletAddress.substring(0, 7) + "..." + withdrawalWalletAddress.substring(withdrawalWalletAddress.length - 4),
      operator: withdrawalOperator,
      eggAmount: eggAmt,
      bdtAmount: usdtValue,
      status: 'pending',
      timestamp: Date.now(),
      trxId: randomHex
    };

    // Deduct balance and register record
    setGameState(prev => ({
      ...prev,
      balance: prev.balance - eggAmt,
      lastSaved: Date.now()
    }));

    setWithdrawals(prev => [newRecord, ...prev]);
    setWithdrawalAmount('');
    setWithdrawalWalletAddress('');
    showToast(t("successWithdrawal"), "success");
    playRewardSound();

    // Auto simulate network state progress (Approved/completed) inside of 25 seconds for visual satisfaction!
    setTimeout(() => {
      setWithdrawals(currentList => {
        return currentList.map(item => {
          if (item.id === newRecord.id) {
            return { ...item, status: 'approved' };
          }
          return item;
        });
      });
    }, 10000);

    setTimeout(() => {
      setWithdrawals(currentList => {
        return currentList.map(item => {
          if (item.id === newRecord.id) {
            return { ...item, status: 'completed' };
          }
          return item;
        });
      });
      // Play a small delayed notification beep
      playRewardSound();
    }, 22000);
  };

  // Format cooldown helper
  const formatCooldown = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Live swap mechanism (Egg <-> USDT) and video ads
  const handlePerformSwap = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(swapAmount);
    if (isNaN(amount) || amount <= 0) {
      showToast(gameState.lang === 'en' ? "Please enter a valid amount." : "অনুগ্রহ করে একটি সঠিক পরিমাণ লিখুন।", "error");
      return;
    }

    if (swapDirection === 'eggToUsdt') {
      if (gameState.balance < amount) {
        showToast(gameState.lang === 'en' ? "Insufficient Eggs to swap!" : "সোয়াপ করার জন্য পর্যাপ্ত ডিম নেই!", "error");
        return;
      }
      const usdtEarned = amount / 1000000;
      setGameState(prev => ({
        ...prev,
        balance: prev.balance - amount,
        usdt_balance: (prev.usdt_balance || 0) + usdtEarned,
        lastSaved: Date.now()
      }));
      showToast(gameState.lang === 'en' ? `Swapped ${formatNumber(amount)} Eggs for ${usdtEarned.toFixed(6)} USDT!` : `${formatNumber(amount)} ডিম সফলভাবে ${usdtEarned.toFixed(6)} USDT-তে রুপান্তর করা হয়েছে!`, "success");
    } else {
      const currentUsdt = gameState.usdt_balance || 0;
      if (currentUsdt < amount) {
        showToast(gameState.lang === 'en' ? "Insufficient USDT to swap!" : "সোয়াপ করার জন্য পর্যাপ্ত USDT নেই!", "error");
        return;
      }
      const eggsEarned = Math.floor(amount * 1000000);
      setGameState(prev => ({
        ...prev,
        balance: prev.balance + eggsEarned,
        usdt_balance: currentUsdt - amount,
        lastSaved: Date.now()
      }));
      showToast(gameState.lang === 'en' ? `Swapped ${amount} USDT for ${formatNumber(eggsEarned)} Eggs!` : `${amount} USDT সফলভাবে ${formatNumber(eggsEarned)} ডিমে রুপান্তর করা হয়েছে!`, "success");
    }

    playRewardSound();
    setSwapAmount('');
  };

  const handleWatchVideoAd = () => {
    if (adsRemainingToday <= 0) {
      showToast(gameState.lang === 'en' ? "No ads left for today! Reset in 24 hours." : "আজকের জন্য আর কোন স্পনসর অ্যাড অবশিষ্ট নেই!", "error");
      return;
    }
    if (isAdPlaying) return;

    setIsAdPlaying(true);
    setAdCountdown(8);

    const interval = setInterval(() => {
      setAdCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsAdPlaying(false);
          setGameState(state => ({
            ...state,
            balance: state.balance + 10000,
            lifetimeEggs: state.lifetimeEggs + 10000,
            lastSaved: Date.now()
          }));
          setAdsRemainingToday(rem => Math.max(0, rem - 1));
          showToast(gameState.lang === 'en' ? "Success! +10,000 Eggs awarded for watching sponsor ad." : "অভিনন্দন! স্পনসর ভিডিও অ্যাড দেখার জন্য +১০,০০০ ডিম যুক্ত হয়েছে।", "success");
          playRewardSound();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleWatchMonetagAd = (adNum: number) => {
    const remainingSeconds = getSlotCooldownSeconds(adNum);
    if (remainingSeconds > 0) {
      const minutes = Math.floor(remainingSeconds / 60);
      const seconds = remainingSeconds % 60;
      const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      showToast(
        gameState.lang === 'en'
          ? `Sponsor Ad Task #${adNum} is on cooldown! Next run available in ${timeStr}.`
          : `স্পনসর অ্যাড #${adNum} এখনো বিরতিতে আছে! পরবর্তী সুযোগ পেতে আরও ${timeStr} অপেক্ষা করুন।`,
        "error"
      );
      return;
    }

    if (isMonetagAdPlaying || isAdPlaying) return;

    setIsMonetagAdPlaying(true);
    setMonetagCountdown(10); // 10 seconds premium smart link simulation

    const interval = setInterval(() => {
      setMonetagCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsMonetagAdPlaying(false);
          setGameState(state => {
            const nextTimestamps = {
              ...(state.monetag_slots_timestamps || {}),
              [adNum]: new Date().toISOString()
            };
            const nextWatched = (state.monetag_ads_watched || 0) + 1;
            const currentCompletedIds = state.monetag_completed_ids || [];
            const nextCompleted = currentCompletedIds.includes(adNum) 
              ? currentCompletedIds 
              : [...currentCompletedIds, adNum];

            return {
              ...state,
              balance: state.balance + 10000,
              lifetimeEggs: state.lifetimeEggs + 10000,
              monetag_ads_watched: nextWatched,
              monetag_completed_ids: nextCompleted,
              monetag_slots_timestamps: nextTimestamps,
              monetag_last_watched_timestamp: new Date().toISOString(),
              lastSaved: Date.now()
            };
          });
          showToast(
            gameState.lang === 'en'
              ? `Completed Ad #${adNum}! +10,000 Eggs loaded from Monetag Ad network.`
              : `অ্যাড #${adNum} সফলভাবে সম্পূর্ণ! মনেট্যাগ অ্যাড দেখার জন্য +১০,০০০ ডিম যুক্ত হয়েছে।`,
            "success"
          );
          playRewardSound();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Global dynamic leaderboard calculator
  const getLeaderboardData = () => {
    const userEntry = {
      username: gameState.username || "You",
      balance: Math.floor(gameState.balance),
      avatarColor: "bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black",
      isCurrentUser: true
    };
    
    const combined = [
      ...MOCK_LEADERBOARD_PLAYERS.map(p => ({ 
        ...p, 
        avatarColor: `bg-gradient-to-r ${p.avatarColor} text-white font-medium`,
        isCurrentUser: false 
      })),
      userEntry
    ];
    
    // Sort descending by balance
    combined.sort((a, b) => b.balance - a.balance);
    
    const ranked = combined.map((player, index) => ({
      ...player,
      rank: index + 1
    }));
    
    const currentUserRankInfo = ranked.find(p => p.isCurrentUser);
    
    return {
      top10: ranked.slice(0, 10),
      currentUserRank: currentUserRankInfo ? currentUserRankInfo.rank : ranked.length,
      currentUserData: currentUserRankInfo
    };
  };

  const handleUpdateUsername = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newUsernameInput.trim().replace(/[^\w\s\d\-@]/g, '');
    if (!cleanName || cleanName.length < 2) {
      showToast(gameState.lang === 'en' ? "Please enter a valid handle (at least 2 characters)." : "অনুগ্রহ করে একটি সঠিক নাম লিখুন (কমপক্ষে ২ অক্ষর)।", "error");
      return;
    }
    setGameState(prev => ({
      ...prev,
      username: cleanName,
      lastSaved: Date.now()
    }));
    setIsEditingUsername(false);
    showToast(gameState.lang === 'en' ? `Leaderboard username set to @${cleanName}!` : `লিডারবোর্ড প্রোফাইল নাম সফলভাবে @${cleanName} হয়েছে!`, "success");
    playRewardSound();
  };

  const getStatusColor = (status: WithdrawalRecord['status']) => {
    switch (status) {
      case 'pending': return 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
      case 'approved': return 'bg-blue-500/10 text-blue-400 border border-blue-500/30';
      case 'completed': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
      case 'rejected': return 'bg-rose-500/10 text-rose-400 border border-rose-500/30';
      default: return 'bg-zinc-500/10 text-zinc-400';
    }
  };

  // Purchase mine card
  const handlePurchaseMineCard = (card: MineCard) => {
    const ownedEntry = (gameState.mine_cards_owned || []).find(c => c.card_id === card.id);
    const currentLvl = ownedEntry ? ownedEntry.current_level : 0;
    const upgradeCost = getCardUpgradeCost(card, currentLvl);

    if (gameState.balance < upgradeCost) {
      showToast(
        gameState.lang === 'en'
          ? "Inadequate Egg Balance to invest in this card!"
          : "এটি কেনার জন্য আপনার কাছে পর্যাপ্ত ডিমের ব্যালেন্স নেই!",
        "error"
      );
      return;
    }

    playRewardSound();

    setGameState(prev => {
      const updatedCards = [...(prev.mine_cards_owned || [])];
      const matchIndex = updatedCards.findIndex(c => c.card_id === card.id);
      if (matchIndex >= 0) {
        updatedCards[matchIndex] = {
          ...updatedCards[matchIndex],
          current_level: currentLvl + 1
        };
      } else {
        updatedCards.push({ card_id: card.id, current_level: 1 });
      }

      const newPph = (prev.profit_per_hour || 0) + card.basePph;

      return {
        ...prev,
        balance: prev.balance - upgradeCost,
        mine_cards_owned: updatedCards,
        profit_per_hour: newPph,
        lastSaved: Date.now()
      };
    });

    showToast(
      gameState.lang === 'en'
        ? `Upgraded ${card.nameEn} to Level ${currentLvl + 1}! PPH +${card.basePph}/hr`
        : `${card.nameBn} সফলভাবে লেভেল ${currentLvl + 1}-এ উন্নীত! ঘণ্টাপ্রতি আয় +${card.basePph} ডিম বেড়ল!`,
      "success"
    );

    // Trigger visual confetti success glow overlay celebration
    setShowUpgradeCelebration({
      card,
      level: currentLvl + 1,
      prevLvl: currentLvl
    });
  };

  // Claim offline mine production yield
  const handleClaimOfflineEarnings = () => {
    playRewardSound();
    setGameState(prev => ({
      ...prev,
      balance: prev.balance + offlineEarnedEggs,
      lifetimeEggs: prev.lifetimeEggs + offlineEarnedEggs,
      last_claim_timestamp: new Date().toISOString(),
      lastSaved: Date.now()
    }));
    showToast(
      gameState.lang === 'en'
        ? `Harvested +${formatNumber(offlineEarnedEggs)} Eggs from offline production!`
        : `অফলাইনে উৎপাদিত +${formatNumber(offlineEarnedEggs)} ডিম সফলভাবে সংগ্রহ করা হয়েছে!`,
      "success"
    );
    setShowOfflineClaimModal(false);
  };

  // Reset Game Helper for Debugging and playtesting
  const handleResetGame = () => {
    if (confirm(gameState.lang === 'en' ? "Are you sure you want to reset your egg farm history?" : "আপনি কি নিশ্চিত যে আপনার সেভিং গেম রিসেট করতে চান?")) {
      localStorage.removeItem('takar_dim_game_state_v3');
      localStorage.removeItem('takar_dim_withdrawals_v3');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col items-center justify-center p-0 md:p-6 select-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-zinc-950 overflow-x-hidden" id="takar_dim_app">
      
      {/* Absolute floating toast banners */}
      {toastMessage && (
        <div 
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-2xl shadow-2xl transition-all duration-300 animate-bounce ${
            toastMessage.type === 'success' 
              ? 'bg-emerald-500/90 text-white backdrop-blur-md border border-emerald-400/30' 
              : toastMessage.type === 'error'
              ? 'bg-rose-500/90 text-white backdrop-blur-md border border-rose-400/30'
              : 'bg-indigo-600/90 text-white backdrop-blur-md border border-indigo-400/30'
          }`}
          id="system-toast"
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
          ) : toastMessage.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-200 shrink-0" />
          ) : (
            <Sparkles className="w-5 h-5 text-yellow-200 shrink-0 animate-spin" />
          )}
          <span className="text-sm font-semibold tracking-wide">{toastMessage.text}</span>
        </div>
      )}

      {/* Main viewport frame wrapping the Telegram mobile style mini-app */}
      <div 
        className="w-full max-w-md bg-slate-900/40 md:border md:border-slate-800/80 md:rounded-[42px] overflow-hidden shadow-[0_0_80px_rgba(30,41,59,0.3)] flex flex-col relative aspect-[9/19] md:aspect-auto md:min-h-[820px] backdrop-blur-lg"
        id="takar_dim_phone_frame"
      >
        
        {/* Top Header Information Rail */}
        <div className="px-5 pt-5 pb-3 flex items-center justify-between border-b border-white/5 bg-slate-950/40 relative z-10" id="header_controls">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 via-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/10">
                <Crown className="w-5 h-5 text-slate-950 animate-pulse" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-indigo-500 text-[9px] font-bold px-1 py-0.5 rounded-md border border-slate-900 scale-90">
                BOT
              </div>
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
                {t("appName")}
              </h1>
              <p className="text-[10px] text-slate-400 font-medium">
                {t("subtitle")}
              </p>
            </div>
          </div>

          {/* Bilingual Language Control and Sounds System toggler */}
          <div className="flex items-center gap-2">
            {/* Consecutive Login Streak Counter Display */}
            <button
              onClick={() => setShowStreakModal(true)}
              className="px-2.5 py-2 rounded-xl bg-gradient-to-r from-orange-500/10 to-amber-500/15 hover:from-orange-500/25 hover:to-amber-500/30 text-orange-400 transition-all border border-orange-500/20 active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-sm shadow-orange-500/5 hover:border-orange-500/40"
              title="Daily Login Streak"
              id="header_streak_badge"
            >
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse shrink-0" />
              <span className="text-xs font-black tracking-tight">{gameState.streakCount || 0}d</span>
            </button>

            <button 
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                showToast(soundEnabled ? "Sfx muted" : "Sfx enabled", "info");
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-all border border-white/5 active:scale-95"
              title="Toggle Audio"
              id="audio_toggle_btn"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-amber-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>

            <button 
              onClick={() => {
                setGameState(prev => ({
                  ...prev,
                  lang: prev.lang === 'en' ? 'bn' : 'en'
                }));
                showToast(gameState.lang === 'en' ? "ভাষা পরিবর্তন করা হয়েছে" : "Language changed to English", "success");
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 flex items-center gap-1 transition-all border border-white/5 active:scale-95"
              id="lang_switch_btn"
            >
              <Languages className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-black uppercase tracking-wider">{gameState.lang === 'en' ? 'BN' : 'EN'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic developer tag with personalized workspace credentials */}
        <div className="px-5 py-2 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-950/50 flex items-center justify-between border-b border-white/5" id="user_identity_hud">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-300 font-mono truncate">
                <span className="text-zinc-500">Farmer:</span> <span className="text-amber-400 font-black">@{gameState.username || "You"}</span>
              </span>
              {(() => {
                const league = getLeagueInfo(gameState.balance);
                return (
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase font-sans border flex items-center gap-0.5 ${league.badgeBg}`}>
                    <span>{league.emoji}</span>
                    <span>{league.name}</span>
                  </span>
                );
              })()}
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <p className="text-[9px] text-zinc-500 font-mono">
              isimran1218@gmail.com
            </p>
          </div>
        </div>

        {/* Global Live Stats Card */}
        <div className="mx-4 mt-4 p-4 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950/40 border border-indigo-950/50 shadow-inner flex flex-col gap-3 relative overflow-hidden" id="stats_dashboard">
          
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-300">
                {t("balance")}
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-6 h-6 shrink-0 relative animate-pulse">
                  <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 5 Q15 65 15 85 A35 35 0 0 0 85 85 Q85 65 50 5 Z" fill="#FBBF24" />
                  </svg>
                </div>
                <span className="text-2xl font-black font-mono tracking-tight text-white drop-shadow">
                  {formatNumber(Math.floor(gameState.balance))}
                </span>
                <span className="text-[11px] font-extrabold text-amber-400 lowercase italic">
                  {t("eggs")}
                </span>
              </div>
            </div>

            <div className="text-right flex flex-col items-end">
              <span className="text-[9px] uppercase font-semibold text-slate-400 tracking-wider">
                Est. Value
              </span>
              <span className="text-sm font-bold text-emerald-400 font-mono">
                ${formatNumber(parseFloat((gameState.balance / 1000000).toFixed(6)))} {t("bdt")}
              </span>
              <span className="text-[9px] text-zinc-400 font-mono">
                {t("exchangeRate")}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-white/5 relative z-10" id="stats_dashboard_grid">
            <div className="bg-slate-950/40 p-1.5 py-2 rounded-xl flex items-center justify-between" id="dashboard_stat_tap">
              <div>
                <p className="text-[8px] sm:text-[9px] text-slate-400 font-bold uppercase leading-none">{t("tapPower")}</p>
                <p className="text-xs font-black font-mono text-zinc-100 mt-1">+{formatNumber(gameState.tapMultiplier)}</p>
              </div>
              <Zap className="w-3.5 h-3.5 text-yellow-400 shrink-0 ml-1" />
            </div>

            <div className="bg-slate-950/40 p-1.5 py-2 rounded-xl flex items-center justify-between" id="dashboard_stat_nest">
              <div>
                <p className="text-[8px] sm:text-[9px] text-slate-400 font-bold uppercase leading-none">{t("passiveRate")}</p>
                <p className="text-xs font-black font-mono text-cyan-400 mt-1">+{parseFloat((gameState.levels.autoNest * 2).toFixed(1))}/s</p>
              </div>
              <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0 ml-1" />
            </div>

            <div className="bg-slate-950/40 p-1.5 py-2 rounded-xl flex items-center justify-between" id="dashboard_stat_pph">
              <div>
                <p className="text-[8px] sm:text-[9px] text-slate-400 font-bold uppercase leading-none">{t("profitPerHour")}</p>
                <p className="text-xs font-black font-mono text-emerald-400 mt-1">+{formatNumber(gameState.profit_per_hour || 0)}</p>
              </div>
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />
            </div>
          </div>
        </div>

        {/* Primary View Containers */}
        <div className="flex-1 flex flex-col p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 290px)' }} id="scroll_content_viewport">
          
          {/* 1. TAB: TAP ARENA */}
          {activeTab === 'tap' && (
            <div className="flex-1 flex flex-col items-center justify-between py-2 gap-4" id="view_tap">
              
              {/* Egg custom shell representation with level badges */}
              <div className="text-center">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-800/60 border border-slate-700/50 text-xs font-bold text-slate-200">
                  <Award className="w-3.5 h-3.5 text-yellow-500" />
                  {eggInfo.badge} — {gameState.lang === 'en' ? eggInfo.nameEn : eggInfo.nameBn}
                </span>

                <div className="mt-3 w-48 mx-auto bg-slate-950/60 px-3 py-1 rounded-2xl border border-white/5 flex items-center justify-center gap-1.5 shadow-inner">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                    {t("autoClickActive")}
                  </span>
                </div>
              </div>

              {/* Egg Container Tapper Centerpiece */}
              <div 
                className="relative w-64 h-64 my-4 flex items-center justify-center cursor-pointer transition-transform duration-100 ease-out active:scale-95 touch-none"
                onMouseDown={handleEggTap}
                onTouchStart={handleEggTap}
                id="egg_tapper_target"
              >
                {/* Golden glowing radial halo background */}
                <div 
                  className="absolute w-56 h-56 rounded-full blur-[40px] pointer-events-none transition-all"
                  style={{ 
                    backgroundColor: eggInfo.glowColor, 
                    transform: isTapping ? 'scale(1.2)' : 'scale(1)',
                    opacity: isTapping ? 0.9 : 0.6
                  }} 
                />

                {/* SVG Egg dynamic render */}
                <div 
                  className={`w-48 h-56 transition-all duration-75 select-none ${
                    isTapping ? 'scale-90 rotate-2' : 'hover:scale-105 active:scale-95'
                  }`}
                >
                  {eggInfo.eggSvg}
                </div>

                {/* Real-time coordinates floating numbers overlay */}
                {clickBubbles.map(bubble => (
                  <div
                    key={bubble.id}
                    className="absolute text-2xl font-black font-mono tracking-tight pointer-events-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] filter transition-all duration-1000 ease-out z-30 animate-float"
                    style={{
                      left: bubble.x,
                      top: bubble.y - 20,
                      color: gameState.lifetimeEggs > 100000 ? '#22D3EE' : gameState.lifetimeEggs > 25000 ? '#FBBF24' : '#FFF',
                    }}
                  >
                    +{bubble.value}
                  </div>
                ))}
              </div>

              {/* Energy bar meter and instructional guidelines */}
              <div className="w-full flex flex-col gap-2 bg-slate-950/30 p-3 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                  <span className="flex items-center gap-1">
                    <BatteryCharging className="w-4 h-4 text-emerald-400" />
                    {t("energy")}
                  </span>
                  <span className="font-mono">{formatNumber(gameState.energy)} / {formatNumber(currentMaxEnergy)} ({energyPercentage}%)</span>
                </div>

                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 transition-all duration-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]" 
                    style={{ width: `${energyPercentage}%` }}
                  />
                </div>

                <div className="mt-1 flex items-start gap-1.5 opacity-70">
                  <Info className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-zinc-300 leading-relaxed font-medium">
                    {t("helpGuide")}
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* MINE TAB: PASSIVE INCOME & INVESTMENT CARDS */}
          {activeTab === 'mine' && (
            <div className="flex-1 flex flex-col gap-4 animate-fade-in" id="view_mine">
              {/* Header Overview with PPH Tracker */}
              <div className="bg-gradient-to-br from-emerald-950/20 via-slate-900 to-indigo-950/30 p-4 rounded-2xl border border-indigo-900/40 flex flex-col gap-2 relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex items-center gap-2 text-emerald-400">
                  <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0" />
                  <h3 className="text-sm font-black uppercase tracking-wider">
                    {t("tabMine")}
                  </h3>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {gameState.lang === 'en' 
                    ? "Purchase and upgrade incubation mine cards to continuously earn passive Eggs even when you are offline! Auto-accumulates for up to 3 hours maximum."
                    : "আপনার খামার ও ব্যবসায়ের কার্ডগুলো আপগ্রেড করুন, যা আপনি ৩ ঘণ্টা অফলাইনে থাকলেও স্বয়ংক্রিয়ভাবে ডিম বৃদ্ধি করতে সাহায্য করবে!"
                  }
                </p>

                {/* Stat Display Box */}
                <div className="mt-1.5 flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-white/5">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Current PPH Yield:</span>
                  <div className="flex items-center gap-1">
                    <span className="w-3.5 h-3.5 relative">
                      <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
                        <path d="M50 5 Q15 65 15 85 A35 35 0 0 0 85 85 Q85 65 50 5 Z" fill="#34D399" />
                      </svg>
                    </span>
                    <span className="text-xs font-black font-mono text-emerald-400 tracking-wide">+{formatNumber(gameState.profit_per_hour || 0)}/hr</span>
                  </div>
                </div>
              </div>

              {/* Subtabs Swiper for Markets, PR, Legal, Specials */}
              <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950/60 rounded-xl border border-white/5 shadow-inner" id="mine_categories_nav">
                {(['Markets', 'PR & Team', 'Legal', 'Specials'] as const).map(cat => {
                  const isActive = mineCategory === cat;
                  const catLabel = cat === 'Markets' ? t("cardMarkets") : cat === 'PR & Team' ? t("cardPRTeam") : cat === 'Legal' ? t("cardLegal") : t("cardSpecials");
                  
                  return (
                    <button
                      key={cat}
                      onClick={() => setMineCategory(cat)}
                      className={`py-2 px-0.5 rounded-lg text-[9px] font-black uppercase tracking-tight transition-all active:scale-95 cursor-pointer text-center truncate ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-500/15 to-teal-500/10 border border-emerald-500/30 text-emerald-400 shadow-md shadow-emerald-500/5'
                          : 'text-slate-400 hover:text-slate-200 border border-transparent'
                      }`}
                    >
                      {catLabel}
                    </button>
                  );
                })}
              </div>

              {/* Grid of upgrade cards */}
              <div className="grid grid-cols-2 gap-2.5 pb-4" id="mine_cards_grid">
                {MINE_CARDS.filter(card => card.category === mineCategory).map(card => {
                  const ownedEntry = (gameState.mine_cards_owned || []).find(c => c.card_id === card.id);
                  const currentLvl = ownedEntry ? ownedEntry.current_level : 0;
                  const upgradeCost = getCardUpgradeCost(card, currentLvl);
                  const isAffordable = gameState.balance >= upgradeCost;

                  return (
                    <div 
                      key={card.id}
                      className="p-3 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-slate-800 flex flex-col justify-between gap-3 relative transition-all shadow-md group overflow-hidden"
                    >
                      {/* Subtle blur decoration */}
                      <div className="absolute -top-12 -left-12 w-20 h-20 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

                      {/* Top elements */}
                      <div className="flex flex-col gap-2 relative z-10">
                        <div className="flex items-start justify-between gap-2">
                          <div className="w-9 h-9 rounded-xl bg-slate-950 flex items-center justify-center border border-white/5">
                            <LucideIcon name={card.icon} className="w-5.5 h-5.5 text-emerald-400 shrink-0" />
                          </div>
                          
                          <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-mono font-black text-emerald-400 uppercase">
                            {t("level")} {currentLvl}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-[11px] font-black text-slate-100 uppercase tracking-tight leading-snug truncate">
                            {gameState.lang === 'en' ? card.nameEn : card.nameBn}
                          </h4>
                          <p className="text-[8px] text-zinc-400 leading-tight mt-0.5 max-h-[28px] overflow-hidden line-clamp-2">
                            {gameState.lang === 'en' ? card.descriptionEn : card.descriptionBn}
                          </p>
                        </div>
                      </div>

                      {/* Bottom yields & upgrade button */}
                      <div className="mt-1 pt-2 border-t border-white/5 flex flex-col gap-1.5 relative z-10">
                        <div className="flex items-center justify-between text-[9px]">
                          <span className="text-zinc-500 font-bold">PPH Yield:</span>
                          <span className="font-mono text-emerald-400 font-extrabold">+{formatNumber(card.basePph)}/hr</span>
                        </div>

                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1 justify-center bg-slate-950/40 py-1 px-1.5 rounded-lg border border-white/5">
                            <span className="w-3.5 h-3.5 relative">
                              <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
                                <path d="M50 5 Q15 65 15 85 A35 35 0 0 0 85 85 Q85 65 50 5 Z" fill="#FBBF24" />
                              </svg>
                            </span>
                            <span className="text-[10px] font-extrabold font-mono text-amber-300">
                              {formatNumber(upgradeCost)}
                            </span>
                          </div>

                          <button
                            onClick={() => handlePurchaseMineCard(card)}
                            className={`w-full py-2 px-2.5 rounded-xl text-[9px] font-black transition-all active:scale-95 flex items-center justify-center gap-0.5 ${
                              isAffordable 
                                ? 'bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 cursor-pointer shadow-md shadow-emerald-400/10' 
                                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-60'
                            }`}
                          >
                            {currentLvl === 0 ? "Unlock" : "Upgrade"}
                            <ArrowUpRight className="w-2.5 h-2.5 shrink-0" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. TAB: SOCIAL EARN QUESTS */}
          {activeTab === 'earn' && (
            <div className="flex-1 flex flex-col gap-4" id="view_earn">
              <div className="bg-gradient-to-r from-indigo-950/40 to-slate-950 p-4 rounded-2xl border border-indigo-950">
                <h3 className="text-sm font-black text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  {t("earnTasks")}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {t("completeTaskReward")}
                </p>
              </div>

              {/* MONETAG SPONSOR AD PORTAL */}
              <div className="bg-gradient-to-br from-indigo-950/90 via-slate-900 to-slate-950 p-4 rounded-2xl border border-indigo-500/30 shadow-lg relative overflow-hidden" id="monetag_ads_block">
                <div className="absolute top-0 right-0 w-28 h-28 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-400/30 flex items-center justify-center">
                      <Tv className="w-4 h-4 text-indigo-400 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-indigo-300 uppercase tracking-wider flex items-center gap-1">
                        Monetag Smart Ad Hub
                      </h4>
                      <span className="text-[9px] font-bold text-zinc-400 tracking-tight block">
                        {gameState.lang === 'en' ? "10 High eCPM Sponsor Ad Tasks — 1 Ad / Hour" : "১০টি স্পনসরড অ্যাড টাস্ক — প্রতি ঘন্টায় ১টি অ্যাড"}
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-[8px] font-mono font-black text-indigo-300 uppercase border border-indigo-500/30">
                    Live Partner
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="bg-slate-950/50 p-2.5 rounded-xl border border-white/5 flex flex-col justify-between text-left">
                    <span className="text-[8.5px] font-bold text-zinc-500 uppercase tracking-wider">
                      {gameState.lang === 'en' ? "PER VIEW REWARD" : "প্রতি অ্যাড রিওয়ার্ড"}
                    </span>
                    <span className="text-xs font-black font-mono text-emerald-400 mt-1 flex items-center gap-1">
                      <Egg className="w-3.5 h-3.5 text-amber-400 text-shadow-sm inline" />
                      +10,000 Eggs
                    </span>
                  </div>
                  <div className="bg-slate-950/50 p-2.5 rounded-xl border border-white/5 flex flex-col justify-between text-left">
                    <span className="text-[8.5px] font-bold text-zinc-500 uppercase tracking-wider">
                      {gameState.lang === 'en' ? "DAILY TASKS CAP" : "দৈনিক সর্বোচ্চ সীমা"}
                    </span>
                    <span className="text-xs font-black font-mono text-indigo-300 mt-1 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-indigo-400 inline" />
                      10 Ads / Day
                    </span>
                  </div>
                </div>

                {/* Progress bar and counter */}
                <div className="mt-3 bg-slate-950/80 p-3 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center text-[10px] mb-1.5 font-sans">
                    <span className="text-zinc-400 font-extrabold uppercase tracking-wide">
                      {gameState.lang === 'en' ? "Active Cooldowns" : "সক্রিয় বিরতীর সংখ্যা"}
                    </span>
                    <span className="font-mono text-indigo-300 font-black">
                      {(() => {
                        let count = 0;
                        for (let i = 1; i <= 10; i++) {
                          if (getSlotCooldownSeconds(i) > 0) count++;
                        }
                        return `${count} / 10 Locks`;
                      })()}
                    </span>
                  </div>
                  
                  {/* Grid blocks representing actual live cooldown slots */}
                  <div className="grid grid-cols-10 gap-1 mt-1">
                    {Array.from({ length: 10 }).map((_, i) => {
                      const adNum = i + 1;
                      const secsLeft = getSlotCooldownSeconds(adNum);
                      const isLock = secsLeft > 0;
                      return (
                        <div 
                          key={i} 
                          className={`h-2.5 rounded-sm transition-all duration-300 ${
                            isLock 
                              ? "bg-amber-500/80 shadow shadow-amber-400/20 animate-pulse" 
                              : "bg-emerald-500 shadow shadow-emerald-400/20"
                          }`}
                          title={`Slot ${adNum}: ${isLock ? `${Math.ceil(secsLeft / 60)}m left` : 'Ready'}`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Info Tip block */}
                <div className="mt-3 bg-indigo-950/20 border border-indigo-500/10 rounded-xl p-2.5 flex items-start gap-2.5">
                  <span className="text-sm shrink-0">💡</span>
                  <div className="text-left">
                    <p className="text-[10px] text-zinc-300 leading-normal">
                      {gameState.lang === 'en' 
                        ? "Each slot can be played independently! Once played, only that specific slot locks for 1 hour while others remain fully clickable." 
                        : "প্রতিটি স্লট স্বাধীনভাবে খেলা যাবে! একবার খেললে শুধুমাত্র সেই নির্দিষ্ট স্লটটি ১ ঘন্টার জন্য লক হবে, অন্যগুলো খোলা থাকবে।"}
                    </p>
                  </div>
                </div>

                {/* Non-sequential List of 10 Ads */}
                <div className="mt-3.5 flex flex-col gap-2 max-h-[310px] overflow-y-auto pr-1 custom-scrollbar">
                  {(() => {
                    const bengaliNumbers = ['১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯', '১০'];
                    return Array.from({ length: 10 }).map((_, i) => {
                      const adNum = i + 1;
                      const secsLeft = getSlotCooldownSeconds(adNum);
                      const isLocked = secsLeft > 0;

                      // Format slot individual countdown timer
                      const mins = Math.floor(secsLeft / 60);
                      const secs = secsLeft % 60;
                      const countdownStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

                      return (
                        <div 
                          key={i}
                          className={`flex items-center justify-between p-2.5 rounded-xl border transition-all duration-300 gap-3 text-left ${
                            isLocked 
                              ? "bg-slate-950/80 border-amber-500/10 opacity-75" 
                              : "bg-indigo-950/30 border-indigo-500/20 hover:border-indigo-400/40 shadow shadow-indigo-500/5 group"
                          }`}
                        >
                          {/* Inner Left Layout details */}
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            {/* Icon representation */}
                            {isLocked ? (
                              <div className="w-8.5 h-8.5 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                                <Clock className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
                              </div>
                            ) : (
                              <div className="w-8.5 h-8.5 rounded-full bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/10 group-hover:scale-105 transition-transform duration-300">
                                <Play className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400/20 ml-0.5" />
                              </div>
                            )}

                            <div className="flex flex-col">
                              <span className="text-[11px] font-black text-slate-100 flex items-center gap-1.5 leading-tight">
                                {gameState.lang === 'en' ? `Sponsor Ad Slot #${adNum}` : `স্পনসরড অ্যাড স্লট #${bengaliNumbers[i]}`}
                                {!isLocked && (
                                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping shrink-0" />
                                )}
                              </span>
                              <span className="text-[9.5px] font-medium block leading-tight mt-0.5">
                                {isLocked ? (
                                  <span className="text-amber-500 font-extrabold flex items-center gap-1 animate-pulse">
                                    <Clock className="w-3 h-3" />
                                    {gameState.lang === 'en' ? `Locked countdown: ${countdownStr}` : `লকড কাউন্টডাউন: ${countdownStr}`}
                                  </span>
                                ) : (
                                  <span className="text-indigo-300 font-extrabold flex items-center gap-0.5">
                                    {gameState.lang === 'en' ? "Ready — Earn +10,000 Eggs" : `প্রস্তুত — অর্জন করুন +১০,০০০ ডিম`}
                                  </span>
                                )}
                              </span>
                            </div>
                          </div>

                          {/* Action Button representers */}
                          <div>
                            {isLocked ? (
                              <div className="flex flex-col items-end gap-0.5">
                                <span className="text-[8px] font-black font-mono px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 uppercase tracking-wider animate-pulse">
                                  COOLING
                                </span>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleWatchMonetagAd(adNum)}
                                disabled={isMonetagAdPlaying || isAdPlaying}
                                className="py-1.5 px-3.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white font-extrabold text-[9.5px] uppercase tracking-wider rounded-lg transition-all active:scale-95 shadow shadow-indigo-500/15 border border-indigo-400/25 cursor-pointer flex items-center gap-1 group-hover:shadow-indigo-500/30"
                              >
                                <span>{gameState.lang === 'en' ? "Watch" : "দেখুন"}</span>
                                <ArrowUpRight className="w-2.5 h-2.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              <div className="space-y-3" id="social_tasks_list">
                {SOCIAL_TASKS.map(task => {
                  const isCompleted = gameState.tasksCompleted.includes(task.id);
                  const isVerifying = verifyingTaskId === task.id;

                  return (
                    <div 
                      key={task.id} 
                      className={`p-3.5 rounded-2xl border transition-all flex flex-col gap-3 relative overflow-hidden backdrop-blur-sm ${
                        isCompleted 
                          ? 'bg-slate-950/40 border-slate-900/60 opacity-60' 
                          : 'bg-slate-900/50 border-white/5 hover:border-slate-800'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center border border-white/5 shrink-0">
                          {task.type === 'telegram' ? (
                            <Send className="w-5 h-5 text-sky-400" />
                          ) : task.type === 'youtube' ? (
                            <Youtube className="w-5 h-5 text-rose-500" />
                          ) : task.type === 'twitter' ? (
                            <Twitter className="w-5 h-5 text-sky-100" />
                          ) : (
                            <Calendar className="w-5 h-5 text-amber-400" />
                          )}
                        </div>

                        <div className="flex-1">
                          <h4 className="text-xs font-black text-slate-100 leading-snug">
                            {gameState.lang === 'en' ? task.titleEn : task.titleBn}
                          </h4>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="w-3.5 h-3.5 relative">
                              <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
                                <path d="M50 5 Q15 65 15 85 A35 35 0 0 0 85 85 Q85 65 50 5 Z" fill="#FBBF24" />
                              </svg>
                            </span>
                            <span className="text-xs font-black text-amber-400 font-mono">
                              +{formatNumber(task.reward)} Eggs
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 justify-end pt-1.5 border-t border-white/5">
                        {isCompleted ? (
                          <span className="text-[11px] font-extrabold text-emerald-400 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Completed
                          </span>
                        ) : (
                          <>
                            {task.type !== 'daily' && (
                              <a 
                                href={task.actionUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                onClick={() => showToast(gameState.lang === 'en' ? "Redirecting... Tap verification below when joined." : "নির্ধারিত পেইজে নিয়ে যাওয়া হচ্ছে। ফিরে এসে ভেরিফাই করুন।", "info")}
                                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-white rounded-xl text-[11px] font-bold border border-white/5 transition-all inline-flex items-center gap-1"
                              >
                                {task.type === 'telegram' ? t("joinBtn") : task.type === 'youtube' ? t("subscribeBtn") : t("followBtn")}
                                <ArrowUpRight className="w-3 h-3" />
                              </a>
                            )}
                            
                            <button
                              onClick={() => handleVerifyTask(task)}
                              disabled={isVerifying}
                              className={`px-3.5 py-1.5 rounded-xl text-[11px] font-extrabold active:scale-95 transition-all flex items-center gap-1 ${
                                isVerifying 
                                  ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed' 
                                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md shadow-amber-400/10'
                              }`}
                            >
                              {isVerifying ? (
                                <>
                                  <span className="w-3 h-3 border-2 border-zinc-500 border-t-zinc-200 rounded-full animate-spin shrink-0" />
                                  {t("verifying")}
                                </>
                              ) : (
                                <>
                                  {task.type === 'daily' ? t("claimDaily") : t("verifyBtn")}
                                </>
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. TAB: BOOSTERS / UPGRADE SHOP */}
          {activeTab === 'boost' && (
            <div className="flex-1 flex flex-col gap-4" id="view_boost">
              <div className="bg-gradient-to-r from-amber-950/20 to-slate-950 p-4 rounded-2xl border border-amber-950/40">
                <h3 className="text-sm font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  {t("shopTitle")}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {t("shopSubtitle")}
                </p>
              </div>

              <div className="space-y-3" id="booster_upgrades_list">
                {UPGRADE_ITEMS.map(item => {
                  const currentLvl = gameState.levels[item.id] || 0;
                  const upgradeCost = getUpgradeCost(item, currentLvl);
                  const isAffordable = gameState.balance >= upgradeCost;

                  return (
                    <div 
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-slate-800/80 flex items-center justify-between gap-3 relative transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-xl bg-slate-950 flex items-center justify-center border border-white/5 shrink-0 shadow-inner">
                          <LucideIcon name={item.icon} className="w-5.5 h-5.5 text-indigo-400" />
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-black text-slate-100">
                              {gameState.lang === 'en' ? item.nameEn : item.nameBn}
                            </h4>
                            <span className="px-1.5 py-0.5 rounded bg-indigo-500/15 border border-indigo-500/30 text-[9px] font-mono font-bold text-indigo-400 shrink-0">
                              {t("level")} {currentLvl}
                            </span>
                          </div>
                          
                          <p className="text-[10px] text-slate-400 mt-0.5 leading-normal max-w-[190px]">
                            {gameState.lang === 'en' ? item.descriptionEn : item.descriptionBn}
                          </p>

                          <div className="flex items-center gap-1.5 mt-1.5">
                            <span className="text-[11px] text-zinc-400 font-bold shrink-0">Cost:</span>
                            <span className="w-3.5 h-3.5 relative">
                              <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
                                <path d="M50 5 Q15 65 15 85 A35 35 0 0 0 85 85 Q85 65 50 5 Z" fill="#FBBF24" />
                              </svg>
                            </span>
                            <span className="text-xs font-black font-mono text-amber-400">
                              {formatNumber(upgradeCost)} Eggs
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handlePurchaseUpgrade(item)}
                        className={`py-2 px-3.5 rounded-xl text-xs font-black transition-all active:scale-95 shrink-0 flex items-center gap-1 ${
                          isAffordable 
                            ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 cursor-pointer shadow-md shadow-amber-400/15' 
                            : 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50'
                        }`}
                      >
                        Buy
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. TAB: INVITATION / REFERRAL */}
          {activeTab === 'invite' && (
            <div className="flex-1 flex flex-col gap-4" id="view_invite">
              <div className="bg-gradient-to-r from-violet-950/20 to-slate-950 p-4 rounded-2xl border border-violet-950/40">
                <h3 className="text-sm font-black text-violet-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-violet-400" />
                  {t("referralLink")}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {t("referralBonusInfo")}
                </p>
              </div>

              {/* Unique invite linkage copying box */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 flex flex-col gap-3">
                <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                  {t("referralLink")}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`https://t.me/EggFarmingBot/app?startapp=ref_${gameState.referralCode}`}
                    className="flex-1 bg-slate-900 border border-white/5 rounded-xl px-3 py-2 text-xs font-mono text-zinc-300 select-all outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="p-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all active:scale-95 flex items-center justify-center shrink-0"
                    title={t("copyLink")}
                  >
                    {copyFeedback ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Developer testing simulation of referrers joining */}
              <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-950/40 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-indigo-300 uppercase tracking-widest flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4" />
                    Simulate Invites (Playtest)
                  </h4>
                  <span className="text-[9px] bg-indigo-600/30 text-indigo-300 px-1.5 py-0.5 rounded font-mono uppercase">Developer Option</span>
                </div>
                <p className="text-[10px] text-zinc-400">
                  Simulate inviting a friend instantly to receive the 5,000 Eggs bonus immediately! Enter your friend's name below:
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Friend's Name (e.g. Shakib)"
                    value={friendInputs}
                    onChange={(e) => setFriendInputs(e.target.value)}
                    className="flex-1 bg-slate-900 border border-white/5 rounded-xl px-3 py-2 text-xs text-zinc-300 outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') simulationSimulateInviteJoin();
                    }}
                  />
                  <button
                    onClick={simulationSimulateInviteJoin}
                    className="py-2 px-3.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-black text-white active:scale-95 transition-all shrink-0"
                  >
                    Simulate Join
                  </button>
                </div>
              </div>

              {/* List of simulated joined friends */}
              <div className="flex-1">
                <h4 className="text-xs font-black uppercase text-indigo-400 tracking-wider mb-2 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  {t("referredCount")}
                </h4>

                <div className="bg-slate-950/40 rounded-2xl border border-white/5 p-4 text-center">
                  <p className="text-xs text-zinc-400">
                    {t("noReferrals")}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 5. TAB: CRYPTO WALLET WITHDRAWAL & LIVE SWAPS */}
          {activeTab === 'wallet' && (
            <div className="flex-1 flex flex-col gap-4 text-left" id="view_wallet">
              {/* Wallet Header & Balance Indicators */}
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-white/5 relative overflow-hidden flex flex-col gap-3">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                  <h3 className="text-xs font-black text-zinc-300 uppercase tracking-widest flex items-center gap-1.5">
                    <Wallet className="w-4 h-4 text-emerald-400" />
                    Web3 DeFi Terminal
                  </h3>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-mono font-black text-emerald-400 uppercase tracking-widest">
                    Live Rates
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5 flex flex-col">
                    <span className="text-[9px] text-zinc-400 font-black uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Egg className="w-3 h-3 text-amber-400 text-shadow-sm" />
                      Egg Farm Balance
                    </span>
                    <span className="text-sm font-black font-mono text-slate-100">
                      {formatNumber(gameState.balance)}
                    </span>
                  </div>

                  <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5 flex flex-col">
                    <span className="text-[9px] text-zinc-400 font-black uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Coins className="w-3 h-3 text-emerald-400" />
                      Swapped USDT Balance
                    </span>
                    <span className="text-sm font-black font-mono text-emerald-400 text-glow">
                      ${(gameState.usdt_balance || 0).toFixed(6)}
                    </span>
                  </div>
                </div>
              </div>

              {/* LIVE SWAP MODULE */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                    <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400" />
                    Interactive Egg Swap
                  </h4>
                  <span className="text-[9px] font-mono font-medium text-indigo-300">
                    {swapDirection === 'eggToUsdt' ? "Egg ➔ USDT" : "USDT ➔ Egg"}
                  </span>
                </div>

                <form onSubmit={handlePerformSwap} className="flex flex-col gap-3">
                  {/* From Field */}
                  <div className="flex flex-col gap-1.5 bg-slate-900/40 p-3 rounded-xl border border-white/5 relative">
                    <label className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
                      {swapDirection === 'eggToUsdt' ? "You Sell (Eggs)" : "You Sell (USDT)"}
                    </label>
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="number"
                        step="any"
                        required
                        placeholder="0.00"
                        value={swapAmount}
                        onChange={(e) => setSwapAmount(e.target.value)}
                        className="bg-transparent text-sm text-zinc-200 font-mono font-black outline-none w-full"
                      />
                      <span className="text-xs font-black font-mono text-zinc-300">
                        {swapDirection === 'eggToUsdt' ? "EGGS" : "USDT"}
                      </span>
                    </div>

                    {/* Presets buttons */}
                    <div className="flex gap-2.5 mt-2 border-t border-white/5 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          const maxAmt = swapDirection === 'eggToUsdt' 
                            ? Math.floor(gameState.balance * 0.25)
                            : parseFloat(((gameState.usdt_balance || 0) * 0.25).toFixed(6));
                          setSwapAmount(maxAmt.toString());
                        }}
                        className="text-[9px] font-mono font-black py-0.5 px-2 rounded bg-slate-900 hover:bg-slate-800 text-zinc-400 hover:text-white transition-all border border-white/5 active:scale-95 cursor-pointer"
                      >
                        25%
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const maxAmt = swapDirection === 'eggToUsdt' 
                            ? Math.floor(gameState.balance * 0.5)
                            : parseFloat(((gameState.usdt_balance || 0) * 0.5).toFixed(6));
                          setSwapAmount(maxAmt.toString());
                        }}
                        className="text-[9px] font-mono font-black py-0.5 px-2 rounded bg-slate-900 hover:bg-slate-800 text-zinc-400 hover:text-white transition-all border border-white/5 active:scale-95 cursor-pointer"
                      >
                        50%
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const maxAmt = swapDirection === 'eggToUsdt' 
                            ? Math.floor(gameState.balance)
                            : parseFloat(((gameState.usdt_balance || 0)).toFixed(6));
                          setSwapAmount(maxAmt.toString());
                        }}
                        className="text-[9px] font-mono font-black py-0.5 px-2 rounded bg-slate-900 hover:bg-slate-800 text-zinc-400 hover:text-white transition-all border border-white/5 active:scale-95 cursor-pointer flex gap-1 items-center"
                      >
                        100% (MAX)
                      </button>
                    </div>
                  </div>

                  {/* Switch Direction Button */}
                  <div className="flex justify-center -my-1.5 relative z-10">
                    <button
                      type="button"
                      onClick={() => {
                        setSwapDirection(prev => prev === 'eggToUsdt' ? 'usdtToEgg' : 'eggToUsdt');
                        setSwapAmount('');
                      }}
                      className="w-8 h-8 rounded-full bg-indigo-500 hover:bg-indigo-400 border-2 border-slate-950 text-slate-950 font-black flex items-center justify-center transition-all transform active:rotate-180 active:scale-95 cursor-pointer shadow-lg shadow-indigo-500/20"
                      title="Switch swap direction"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>

                  {/* To Field */}
                  <div className="flex flex-col gap-1.5 bg-slate-900/40 p-3 rounded-xl border border-white/5">
                    <label className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
                      {swapDirection === 'eggToUsdt' ? "You Receive (USDT)" : "You Receive (Eggs)"}
                    </label>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold font-mono text-emerald-400">
                        {swapAmount && !isNaN(parseFloat(swapAmount))
                          ? (swapDirection === 'eggToUsdt' 
                              ? (parseFloat(swapAmount) / 1000000).toFixed(6) 
                              : formatNumber(Math.floor(parseFloat(swapAmount) * 1000000)))
                          : "0.00"
                        }
                      </span>
                      <span className="text-xs font-black font-mono text-zinc-300">
                        {swapDirection === 'eggToUsdt' ? "USDT" : "EGGS"}
                      </span>
                    </div>
                    <p className="text-[8px] text-zinc-500 font-mono mt-1 leading-none">
                      Conversion rate: 1,000,000 Eggs = 1.00 USDT
                    </p>
                  </div>

                  {/* Perform Swap Action */}
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 text-slate-950 font-black text-xs rounded-xl transition-all active:scale-95 shadow-md shadow-indigo-500/10 uppercase tracking-wider cursor-pointer mt-1"
                  >
                    Swap Assets Instantly
                  </button>
                </form>
              </div>

              {/* NEW AD BLOCK */}
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-white/5 flex flex-col gap-2.5 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Tv className="w-4 h-4 text-amber-400" />
                    Sponsor Marketing Hub
                  </h4>
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[8px] font-mono font-black text-amber-400 uppercase">
                    Reward Active
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 leading-relaxed">
                  Support future block confirmation operations by viewing a sponsored partner advert. Each ad confirmed earns you <strong className="text-amber-400 font-black">+10,000 Eggs</strong>.
                </p>

                <button
                  type="button"
                  onClick={handleWatchVideoAd}
                  disabled={isAdPlaying || adsRemainingToday <= 0}
                  className={`w-full py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all active:scale-95 border uppercase tracking-wider ${
                    adsRemainingToday > 0 
                      ? 'bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 border-transparent shadow shadow-amber-500/15 cursor-pointer'
                      : 'bg-zinc-900 border-white/5 text-zinc-600 cursor-not-allowed'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-black" />
                  Watch Sponsored Ad ({adsRemainingToday}/5 Left)
                </button>
              </div>

              {/* BLURRED COMING SOON WITHDRAWAL SECTIONS */}
              <div className="flex flex-col gap-2.5">
                <h4 className="text-xs font-black uppercase text-zinc-400 tracking-wider">
                  Blockchain Withdrawals
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Option 1: Withdraw Egg Balance */}
                  <div className="relative overflow-hidden p-4 rounded-2xl bg-slate-950/40 border border-white/5 min-h-[110px] flex flex-col justify-between">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-3">
                      <Lock className="w-5 h-5 text-indigo-400 animate-pulse mb-1" />
                      <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest">
                        Coming Soon at TGE
                      </span>
                      <span className="text-[8px] text-zinc-400 mt-0.5 max-w-[120px]">
                        Egg withdrawals unlocked inside future smart contracts
                      </span>
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-zinc-500">Withdraw Eggs</h5>
                      <p className="text-[10px] text-zinc-600 mt-1">Convert farm earnings directly to $EGGS tokens on TON Smart Contract</p>
                    </div>
                  </div>

                  {/* Option 2: Withdraw USD/USDT Balance */}
                  <div className="relative overflow-hidden p-4 rounded-2xl bg-slate-950/40 border border-white/5 min-h-[110px] flex flex-col justify-between">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-3">
                      <Lock className="w-5 h-5 text-emerald-400 animate-pulse mb-1" />
                      <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest">
                        Coming Soon
                      </span>
                      <span className="text-[8px] text-zinc-400 mt-0.5 max-w-[120px]">
                        Locked until liquidity bridge is provisioned
                      </span>
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-zinc-500">Withdraw USD / USDT</h5>
                      <p className="text-[10px] text-zinc-600 mt-1">Transfer Swapped USDT to external wallets (TON keeper, MyTonWallet)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 6. TAB: LEADERBOARD */}
          {activeTab === 'leaderboard' && (() => {
            const { top10, currentUserRank } = getLeaderboardData();
            return (
              <div className="flex-1 flex flex-col gap-4 text-left animate-fade-in" id="view_leaderboard">
                {/* Leaderboard Header */}
                <div className="bg-gradient-to-r from-amber-500/10 to-indigo-500/10 p-4 rounded-2xl border border-amber-500/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Trophy className="w-4.5 h-4.5 text-amber-500 animate-pulse" />
                      {t("leaderboardTitle")}
                    </h3>
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-[9px] font-mono font-black text-amber-300">
                      Top 10 Farmers
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {t("leaderboardSubtitle")}
                  </p>
                </div>

                {/* Nickname Setter/Editor Block */}
                {isEditingUsername ? (
                  <form onSubmit={handleUpdateUsername} className="p-4 rounded-2xl bg-slate-950/80 border border-indigo-500/20 flex flex-col gap-3 animate-fade-in">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] text-zinc-300 font-black uppercase tracking-wider flex items-center gap-1">
                        <User className="w-3 h-3 text-indigo-400" />
                        {gameState.lang === 'en' ? "Set Your Leaderboard Handle" : "আপনার লিডারবোর্ড নাম সেট করুন"}
                      </label>
                      <button 
                        type="button" 
                        onClick={() => setIsEditingUsername(false)}
                        className="text-zinc-500 hover:text-rose-400"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        maxLength={15}
                        placeholder={gameState.lang === 'en' ? "Enter username (e.g. ShakibPro)" : "ইউজারনেম দিন (যেমনঃ ShakibPro)"}
                        value={newUsernameInput}
                        onChange={(e) => setNewUsernameInput(e.target.value)}
                        className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-200 outline-none focus:border-indigo-500 transition-all font-mono"
                      />
                      <button
                        type="submit"
                        className="py-2 px-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-black text-white hover:shadow-md hover:shadow-indigo-600/20 active:scale-95 transition-all"
                      >
                        {gameState.lang === 'en' ? "Save" : "সংরক্ষণ"}
                      </button>
                    </div>
                  </form>
                ) : null}

                {/* Local Display of the Current User's Rank Card (Sticky Highlight) */}
                <div className="bg-slate-950/90 border-2 border-amber-500/30 p-3.5 rounded-2xl flex items-center justify-between relative shadow-lg shadow-amber-500/5 overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-amber-500/5 to-transparent rounded-full blur-xl pointer-events-none" />
                  
                  <div className="flex items-center gap-3">
                    {/* Position Shield */}
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col items-center justify-center text-center">
                      <span className="text-[8px] text-amber-500 font-extrabold uppercase leading-none">Rank</span>
                      <span className="text-sm font-black text-amber-400 font-mono">#{currentUserRank}</span>
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-black text-slate-100 uppercase tracking-tight">
                          {gameState.username || "You"}
                        </span>
                        {(() => {
                          const league = getLeagueInfo(gameState.balance);
                          return (
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase font-sans border flex items-center gap-0.5 ${league.badgeBg}`}>
                              <span>{league.emoji}</span>
                              <span>{league.name}</span>
                            </span>
                          );
                        })()}
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-[7px] font-mono font-black text-amber-400 uppercase">
                          You
                        </span>
                      </div>
                      <span className="text-[10px] sm:text-xs font-bold font-mono text-zinc-400 flex items-center gap-1 mt-0.5">
                        <Egg className="w-3.5 h-3.5 text-amber-500 text-shadow-sm shrink-0" />
                        {formatNumber(Math.floor(gameState.balance))} Eggs
                      </span>
                    </div>
                  </div>

                  {!isEditingUsername && (
                    <button
                      type="button"
                      onClick={() => {
                        setNewUsernameInput(gameState.username || "You");
                        setIsEditingUsername(true);
                      }}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-all active:scale-95 cursor-pointer flex items-center gap-1 border border-white/5"
                    >
                      <Pen className="w-3 h-3 text-amber-400" />
                      <span className="text-[9px] font-bold uppercase tracking-wider hidden sm:inline">Rename</span>
                    </button>
                  )}
                </div>

                {/* Top 10 List Section */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center px-1">
                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                      <Crown className="w-3 h-3 text-indigo-400" />
                      Glory Standings
                    </h4>
                    <span className="text-[9px] font-mono font-medium text-zinc-500">
                      Updated live
                    </span>
                  </div>

                  <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1" id="leaderboard_list">
                    {top10.map((player) => {
                      return (
                        <div 
                          key={player.username} 
                          className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                            player.isCurrentUser 
                              ? "bg-slate-900/90 border-amber-500/40 shadow-inner" 
                              : "bg-slate-950/60 border-white/5 hover:bg-slate-950/80"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {/* Rank Indicator */}
                            <div className="w-7 h-7 flex items-center justify-center">
                              {player.rank === 1 ? (
                                <span className="text-xl" title="First Place">🥇</span>
                              ) : player.rank === 2 ? (
                                <span className="text-xl" title="Second Place">🥈</span>
                              ) : player.rank === 3 ? (
                                <span className="text-xl" title="Third Place">🥉</span>
                              ) : (
                                <span className="text-xs font-black font-mono text-zinc-500 bg-slate-900/60 w-6 h-6 rounded-full flex items-center justify-center border border-white/5">
                                  {player.rank}
                                </span>
                              )}
                            </div>

                            {/* Avatar Icon */}
                            <div className={`w-8 h-8 rounded-full ${player.avatarColor} flex items-center justify-center text-xs shadow-md border border-white/5 font-black uppercase text-center`}>
                              {player.username.substring(0, 2)}
                            </div>

                            {/* Gamer Name Info */}
                            <div className="flex flex-col">
                              <span className={`text-xs font-black flex items-center gap-1.5 flex-wrap ${player.isCurrentUser ? "text-amber-400" : "text-zinc-200"}`}>
                                <span>@{player.username}</span>
                                {(() => {
                                  const league = getLeagueInfo(player.balance);
                                  return (
                                    <span className={`px-1 py-0.2 rounded text-[7px] font-black uppercase font-sans border flex items-center gap-0.5 ${league.badgeBg}`}>
                                      <span>{league.emoji}</span>
                                      <span>{league.name}</span>
                                    </span>
                                  );
                                })()}
                                {player.isCurrentUser && (
                                  <span className="px-1 rounded bg-amber-500/20 text-[7px] font-serif font-bold text-amber-500">
                                    Me
                                  </span>
                                )}
                              </span>
                              <span className="text-[8px] text-zinc-500 font-mono uppercase tracking-wider">
                                {player.rank === 1 ? "Incubator Champion" : player.rank <= 3 ? "Egg Master" : "Validator"}
                              </span>
                            </div>
                          </div>

                          {/* Balance Display */}
                          <div className="flex items-center gap-1">
                            <Egg className="w-3 h-3 text-amber-400" />
                            <span className="text-xs font-black font-mono text-slate-100">
                              {formatNumber(player.balance)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })()}

        </div>

        {/* Global Reset / Playtest Option footer utility */}
        <div className="px-5 py-2.5 bg-slate-950/40 flex items-center justify-between border-t border-white/5">
          <div className="flex items-center gap-1">
            <Info className="w-3 h-3 text-indigo-400" />
            <span className="text-[9px] text-zinc-400 font-medium">Bilingual Web3 Egg Farming</span>
          </div>

          <button
            onClick={handleResetGame}
            className="text-[9px] text-zinc-500 hover:text-rose-400 font-mono flex items-center gap-1 transition-all"
            id="reset_game_btn"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            Reset Save State
          </button>
        </div>

        {/* Bottom Navigation Menu bar (Telegram Minimal Style) */}
        <div className="grid grid-cols-7 border-t border-white/5 bg-slate-950 px-1 py-3 animate-fade-in" id="bottom_navbar">
          
          <button 
            onClick={() => setActiveTab('tap')}
            className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${
              activeTab === 'tap' ? 'text-amber-400 scale-105' : 'text-slate-400 hover:text-slate-200'
            }`}
            id="nav-tap"
          >
            <div className="w-5 h-5 relative shrink-0">
              <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 5 Q15 65 15 85 A35 35 0 0 0 85 85 Q85 65 50 5 Z" fill="currentColor" />
              </svg>
            </div>
            <span className="text-[8px] sm:text-[9px] font-bold tracking-tight uppercase">{t("tabTap")}</span>
          </button>

          <button 
            onClick={() => setActiveTab('mine')}
            className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${
              activeTab === 'mine' ? 'text-emerald-400 scale-105 border-b-2 border-emerald-500 pb-0.5' : 'text-slate-400 hover:text-slate-200 pb-1'
            }`}
            id="nav-mine"
          >
            <TrendingUp className="w-4.5 h-4.5 shrink-0 text-emerald-400" />
            <span className="text-[8px] sm:text-[9px] font-bold tracking-tight uppercase leading-none">{gameState.lang === 'en' ? 'Mine' : 'চাষ'}</span>
          </button>

          <button 
            onClick={() => setActiveTab('earn')}
            className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${
              activeTab === 'earn' ? 'text-indigo-400 scale-105 pb-0.5' : 'text-slate-400 hover:text-slate-200 pb-1'
            }`}
            id="nav-earn"
          >
            <Award className="w-4.5 h-4.5 shrink-0" />
            <span className="text-[8px] sm:text-[9px] font-bold tracking-tight uppercase leading-none">{t("tabEarn").split(' ')[0]}</span>
          </button>

          <button 
            onClick={() => setActiveTab('boost')}
            className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${
              activeTab === 'boost' ? 'text-cyan-400 scale-105 pb-0.5' : 'text-slate-400 hover:text-slate-200 pb-1'
            }`}
            id="nav-boost"
          >
            <Sparkles className="w-4.5 h-4.5 shrink-0" />
            <span className="text-[8px] sm:text-[9px] font-bold tracking-tight uppercase leading-none">{t("tabBoost").split(' ')[0]}</span>
          </button>

          <button 
            onClick={() => setActiveTab('leaderboard')}
            className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${
              activeTab === 'leaderboard' ? 'text-amber-400 scale-105 pb-0.5' : 'text-slate-400 hover:text-slate-200 pb-1'
            }`}
            id="nav-leaderboard"
          >
            <Trophy className="w-4.5 h-4.5 shrink-0 text-amber-500" />
            <span className="text-[8px] sm:text-[9px] font-bold tracking-tight uppercase leading-none truncate">{t("tabLeaderboard")}</span>
          </button>

          <button 
            onClick={() => setActiveTab('invite')}
            className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${
              activeTab === 'invite' ? 'text-violet-400 scale-105 pb-0.5' : 'text-slate-400 hover:text-slate-200 pb-1'
            }`}
            id="nav-invite"
          >
            <Users className="w-4.5 h-4.5 shrink-0" />
            <span className="text-[8px] sm:text-[9px] font-bold tracking-tight uppercase leading-none">{t("tabInvite")}</span>
          </button>

          <button 
            onClick={() => setActiveTab('wallet')}
            className={`flex flex-col items-center gap-1 transition-all relative cursor-pointer ${
              activeTab === 'wallet' ? 'text-emerald-400 scale-105 pb-0.5' : 'text-slate-400 hover:text-slate-200 pb-1'
            }`}
            id="nav-wallet"
          >
            <Wallet className="w-4.5 h-4.5 shrink-0" />
            <span className="text-[8px] sm:text-[9px] font-bold tracking-tight uppercase leading-none truncate">{t("tabWallet").split(' ')[0]}</span>
            <span className="absolute top-0 right-1 w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" />
          </button>

        </div>

        {/* ------------------- STREAK MODAL OVERLAY ------------------- */}
        {showStreakModal && (() => {
          const checkStateToday = new Date();
          const year = checkStateToday.getFullYear();
          const month = String(checkStateToday.getMonth() + 1).padStart(2, '0');
          const dVal = String(checkStateToday.getDate()).padStart(2, '0');
          const todayStr = `${year}-${month}-${dVal}`;

          const hasClaimedToday = gameState.lastClaimedStreakDate === todayStr;
          const currentStreak = gameState.streakCount || 0;

          const rewardsList = [
            { day: 1, eggs: 1500, emoji: "🥚" },
            { day: 2, eggs: 3000, emoji: "🥚🥚" },
            { day: 3, eggs: 5000, emoji: "🐣" },
            { day: 4, eggs: 8000, emoji: "🐤" },
            { day: 5, eggs: 12000, emoji: "🐔" },
            { day: 6, eggs: 20000, emoji: "🔥" },
          ];

          return (
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in" id="daily_streak_modal_root">
              <div 
                className="w-full max-w-[340px] bg-slate-900 border border-indigo-950/80 rounded-[28px] p-5 flex flex-col gap-4 relative overflow-hidden shadow-2xl scale-in"
                id="streak_modal_dialog"
              >
                {/* Subtle visual grid background */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.03)_0%,transparent_70%)] pointer-events-none" />

                {/* Close Button Button */}
                <button 
                  onClick={() => setShowStreakModal(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all active:scale-90 cursor-pointer border border-white/5"
                  id="close_streak_modal_btn"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Header Information */}
                <div className="flex flex-col items-center text-center mt-1">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500/10 to-amber-500/20 border border-orange-500/30 flex items-center justify-center mb-2 shadow-lg shadow-orange-500/10 animate-pulse">
                    <Flame className="w-6 h-6 text-orange-500 fill-orange-500" />
                  </div>
                  <h3 className="text-sm font-black text-slate-100 uppercase tracking-wider">
                    {t("streakCountTitle")}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                    {t("streakCountDesc")}
                  </p>
                </div>

                {/* 1-6 Days Weekly Grid */}
                <div className="grid grid-cols-3 gap-2">
                  {rewardsList.map(item => {
                    const isAlreadyClaimed = item.day <= currentStreak;
                    const isReadyToday = !hasClaimedToday && item.day === currentStreak + 1;

                    return (
                      <div 
                        key={item.day}
                        className={`p-2 rounded-xl flex flex-col items-center justify-between text-center transition-all relative border h-20 ${
                          isAlreadyClaimed
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : isReadyToday
                            ? 'bg-amber-500/15 border-amber-400 text-amber-300 ring-2 ring-amber-400/20 shadow-md shadow-orange-500/5'
                            : 'bg-slate-950/60 border-white/5 text-slate-500'
                        }`}
                      >
                        <span className="text-[9px] font-black uppercase tracking-wider">
                          {t("streakDay")} {item.day}
                        </span>
                        <span className="text-base my-0.5">{item.emoji}</span>
                        <span className={`text-[9px] font-black font-mono ${isReadyToday ? 'text-amber-400' : ''}`}>
                          +{formatNumber(item.eggs)}
                        </span>

                        {isAlreadyClaimed && (
                          <div className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-500 text-slate-950 rounded-full flex items-center justify-center text-[8px] font-black">
                            ✓
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Day 7 Elite Rewards Card (Spans across all cols) */}
                {(() => {
                  const isDay7Claimed = 7 <= currentStreak;
                  const isDay7Ready = !hasClaimedToday && 7 === currentStreak + 1;

                  return (
                    <div 
                      className={`p-3 rounded-2xl flex items-center justify-between transition-all border relative ${
                        isDay7Claimed
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : isDay7Ready
                          ? 'bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/25 border-amber-400 text-amber-200 ring-2 ring-amber-400/20 shadow-lg shadow-orange-500/10 animate-pulse'
                          : 'bg-slate-950/60 border-white/5 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">👑</span>
                        <div className="text-left">
                          <h4 className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                            {t("streakDay")} 7+ (Ultimate Prize)
                          </h4>
                          <p className="text-[9px] text-slate-400">
                            Consecutive daily multiplier bonus!
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-black font-mono text-amber-400 block">+35,000</span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase">Eggs</span>
                      </div>

                      {isDay7Claimed && (
                        <div className="absolute top-2 right-2 w-4 h-4 bg-emerald-500 text-slate-950 rounded-full flex items-center justify-center text-[10px] font-black">
                          ✓
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Action button container */}
                <div className="mt-1">
                  {hasClaimedToday ? (
                    <button
                      disabled
                      className="w-full py-3 bg-zinc-800 text-zinc-500 font-extrabold text-[11px] rounded-xl flex items-center justify-center gap-1.5 cursor-not-allowed border border-white/5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      {t("claimedToday")}
                    </button>
                  ) : (
                    <button
                      onClick={handleClaimStreak}
                      className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl transition-all active:scale-95 shadow-md shadow-amber-500/25 cursor-pointer flex items-center justify-center gap-1 w-full"
                    >
                      <Flame className="w-4 h-4 text-slate-950 fill-slate-950 shrink-0 animate-ping" />
                      {t("claimStreakBtn")}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* ------------------- OFFLINE PASSIVE INCOME CLAIM MODAL ------------------- */}
        {showOfflineClaimModal && (() => {
          const hrs = Math.floor(offlineElapsedSeconds / 3600);
          const mins = Math.floor((offlineElapsedSeconds % 3600) / 60);
          const elapsedString = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;

          return (
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in" id="offline_earn_modal_root">
              <div 
                className="w-full max-w-[340px] bg-gradient-to-b from-slate-900 to-indigo-950/60 border border-emerald-950/20 rounded-[28px] p-6 flex flex-col gap-4 relative overflow-hidden shadow-2xl scale-in"
                id="offline_earn_modal_dialog"
              >
                {/* Subtle radial light background */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.05)_0%,transparent_70%)] pointer-events-none" />

                {/* Close Button */}
                <button 
                  onClick={() => setShowOfflineClaimModal(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all active:scale-90 cursor-pointer border border-white/5 z-10"
                  id="close_offline_modal_btn"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Pulsing visual element */}
                <div className="flex flex-col items-center text-center mt-2 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500/15 to-emerald-500/25 border border-emerald-500/30 flex items-center justify-center mb-3 shadow-lg shadow-emerald-500/10 active:scale-95 transition-all">
                    <TrendingUp className="w-7 h-7 text-emerald-400 animate-pulse shrink-0" />
                  </div>
                  
                  <h3 className="text-sm font-black text-slate-100 uppercase tracking-wider leading-tight">
                    {t("offlineEarningTitle")}
                  </h3>
                  <p className="text-[10px] text-zinc-400 mt-1 px-1 leading-relaxed">
                    {t("offlineEarningDesc")}
                  </p>
                </div>

                {/* Stats Section with computed information */}
                <div className="bg-slate-950/60 border border-white/5 p-4 rounded-2xl flex flex-col gap-2.5 relative z-10 shadow-inner">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-zinc-500">Duration Offline:</span>
                    <span className="font-mono text-zinc-300 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">{elapsedString}</span>
                  </div>

                  <div className="h-px bg-white/5" />

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-zinc-400 font-bold">Total Eggs Harvested:</span>
                    <div className="flex items-center gap-1">
                      <span className="w-4 h-4 relative shrink-0">
                        <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
                          <path d="M50 5 Q15 65 15 85 A35 35 0 0 0 85 85 Q85 65 50 5 Z" fill="#FBBF24" />
                        </svg>
                      </span>
                      <span className="text-sm font-black font-mono text-amber-300">
                        +{formatNumber(offlineEarnedEggs)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-tight">Est. Value Conversion:</span>
                    <span className="text-[11px] font-mono font-black text-emerald-400">
                      {formatNumber(parseFloat((offlineEarnedEggs / 1000000).toFixed(6)))} USDT
                    </span>
                  </div>
                </div>

                {/* Harvest Eggs CTA button */}
                <div className="relative z-10">
                  <button
                    onClick={handleClaimOfflineEarnings}
                    className="w-full py-3 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all active:scale-95 shadow-md shadow-emerald-400/20 cursor-pointer flex items-center justify-center gap-1.5"
                    id="claim_offline_earnings_btn"
                  >
                    <TrendingUp className="w-4 h-4 text-slate-950 shrink-0" />
                    {t("claimBtnMine")}
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ------------------- CARD UPGRADE CELEBRATION OVERLAY ------------------- */}
        <AnimatePresence>
          {showUpgradeCelebration && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6 z-50 text-center"
              id="mine_upgrade_success_overlay"
              onClick={() => setShowUpgradeCelebration(null)}
            >
              {/* Glowing Success Ambient Radial Ambient Glow background */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.15)_0%,transparent_70%)] pointer-events-none" />

              {/* Sparkle Particles generator */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
                {Array.from({ length: 15 }).map((_, i) => {
                  const left = `${Math.floor(Math.sin(i * 9) * 40 + 50)}%`;
                  const delay = i * 0.15;
                  const size = Math.floor(Math.random() * 8) + 4;
                  return (
                    <motion.div
                      key={i}
                      initial={{ y: "110%", opacity: 0, scale: 0.4 }}
                      animate={{
                        y: "-10vh",
                        opacity: [0, 0.8, 0.8, 0],
                        scale: [0.4, 1.2, 0.8, 0.4],
                        rotate: Math.random() * 360,
                      }}
                      transition={{
                        duration: 2.2,
                        delay,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                      className="absolute text-emerald-400 font-serif font-black"
                      style={{
                        left,
                        bottom: "0px",
                        fontSize: `${size}px`,
                      }}
                    >
                      {i % 3 === 0 ? "✨" : i % 3 === 1 ? "🥚" : "⭐"}
                    </motion.div>
                  );
                })}
              </div>

              {/* Centered Achievement modal card */}
              <motion.div
                initial={{ scale: 0.85, y: 30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.85, y: 30, opacity: 0 }}
                transition={{ type: "spring", damping: 15, stiffness: 180 }}
                className="max-w-[290px] w-full p-6 bg-slate-900 border-2 border-emerald-500/30 rounded-[32px] flex flex-col items-center gap-4 relative overflow-hidden shadow-2xl shadow-emerald-500/10"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Radial golden glow in modal */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative">
                  {/* Outer Pulsating Ring */}
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center animate-pulse">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <LucideIcon name={showUpgradeCelebration.card.icon} className="w-6 h-6 text-slate-950 shrink-0" />
                    </div>
                  </div>
                  
                  {/* Star Badge representation */}
                  <span className="absolute -top-1 -right-1 bg-yellow-500 text-[8px] font-sans font-black text-slate-950 px-2 py-0.5 rounded-full uppercase tracking-wider animate-bounce shadow animate-duration-1000">
                    Active
                  </span>
                </div>

                <div className="flex flex-col gap-1 items-center">
                  <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/15">
                    Investment Successful
                  </span>
                  <h3 className="text-xs font-black text-slate-100 uppercase tracking-widest mt-1.5 px-0.5 leading-snug">
                    {gameState.lang === 'en' ? showUpgradeCelebration.card.nameEn : showUpgradeCelebration.card.nameBn}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1 font-mono text-[10px] bg-slate-950/80 px-2.5 py-0.5 rounded-full border border-white/5 text-zinc-400">
                    <span>Level {showUpgradeCelebration.prevLvl}</span>
                    <span className="text-emerald-400 font-bold">➔</span>
                    <span className="text-emerald-400 font-black">Level {showUpgradeCelebration.level}</span>
                  </div>
                </div>

                {/* Growth Performance Highlight panel */}
                <div className="w-full bg-slate-950 p-3 rounded-2xl border border-white/5 flex flex-col gap-1 text-left">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-zinc-500 font-semibold uppercase tracking-wider text-[8px]">Category:</span>
                    <span className="text-zinc-300 font-bold font-mono">{showUpgradeCelebration.card.category}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] mt-1 border-t border-white/5 pt-1">
                    <span className="text-emerald-400 font-bold uppercase tracking-wider text-[8px]">Passive Output:</span>
                    <span className="text-emerald-400 font-black font-mono">+{formatNumber(showUpgradeCelebration.card.basePph)}/hr</span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  type="button"
                  onClick={() => setShowUpgradeCelebration(null)}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wide rounded-xl transition-all active:scale-95 shadow-md shadow-emerald-400/15 cursor-pointer"
                >
                  {gameState.lang === 'en' ? "Awesome!" : "অসাধারণ!"}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ------------------- VIDEO BROADCAST AD OVERLAY ------------------- */}
        {isAdPlaying && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-6 z-50 text-center animate-fade-in" id="ad_broadcast_overlay">
            <div className="max-w-[290px] w-full p-6 bg-slate-900 border border-white/10 rounded-[28px] flex flex-col items-center gap-4 relative overflow-hidden shadow-2xl animate-scale-in">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.06)_0%,transparent_70%)] pointer-events-none" />
              
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center animate-spin shadow-lg shadow-orange-500/20">
                  <Tv className="w-8 h-8 text-slate-950 shrink-0" />
                </div>
                <span className="absolute -top-1 -right-1 bg-rose-500 text-[8px] font-sans font-black text-white px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                  Broadcast
                </span>
              </div>

              <div className="flex flex-col gap-1 items-center">
                <h3 className="text-xs font-black text-slate-100 uppercase tracking-widest">Sponsor Advert</h3>
                <p className="text-[10px] text-zinc-400 leading-relaxed px-1">
                  Connecting Web3 validators... Confirming priority block space.
                </p>
              </div>

              {/* Progress Slider */}
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-white/5 relative shadow-inner mt-1">
                <div 
                  className="bg-amber-500 h-full transition-all duration-1000 ease-linear"
                  style={{ width: `${((8 - adCountdown) / 8) * 100}%` }}
                />
              </div>

              <div className="text-2xl font-black font-mono text-amber-400">
                {adCountdown}s
              </div>

              <span className="text-[9px] text-emerald-400 font-extrabold uppercase tracking-widest flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/15 py-1 px-3 rounded-full">
                ✨ Reward: +10,000 Eggs
              </span>
            </div>
          </div>
        )}

        {/* ------------------- MONETAG BROADCAST AD OVERLAY ------------------- */}
        {isMonetagAdPlaying && (
          <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-md flex items-center justify-center p-6 z-50 text-center animate-fade-in" id="monetag_broadcast_overlay">
            <div className="max-w-[300px] w-full p-6 bg-slate-900 border-2 border-indigo-500/30 rounded-[28px] flex flex-col items-center gap-4 relative overflow-hidden shadow-2xl animate-scale-in">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center animate-spin shadow-lg shadow-indigo-500/20">
                  <Tv className="w-8 h-8 text-white shrink-0" />
                </div>
                <span className="absolute -top-1 -right-2 bg-indigo-600 text-[8px] font-sans font-black text-white px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse border border-indigo-400">
                  MONETAG
                </span>
              </div>

              <div className="flex flex-col gap-1.5 items-center">
                <h3 className="text-xs font-black text-indigo-300 uppercase tracking-widest">
                  {gameState.lang === 'en' ? "Monetag Premium Ad" : "মনেট্যাগ স্পনসর অ্যাড"}
                </h3>
                <p className="text-[10px] text-zinc-400 leading-relaxed px-1">
                  {gameState.lang === 'en' 
                    ? "Connecting to Monetag direct smart link. Please wait until reward is credited..." 
                    : "মনেট্যাগ ডিরেক্ট স্মার্ট লিংকে সংযুক্ত করা হচ্ছে। রিওয়ার্ড যোগ হওয়া পর্যন্ত অনুগ্রহ করে অপেক্ষা করুন..."}
                </p>
                <div className="text-[9px] font-mono bg-indigo-950/60 p-1.5 rounded-lg border border-indigo-500/10 text-indigo-400 text-center w-full mt-1.5">
                  eCPM Block ID: <span className="text-white">#MTG-{Math.floor(100000 + Math.random() * 900000)}</span>
                </div>
              </div>

              {/* Progress Slider */}
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-white/5 relative shadow-inner mt-1">
                <div 
                  className="bg-indigo-500 h-full transition-all duration-1000 ease-linear"
                  style={{ width: `${((10 - monetagCountdown) / 10) * 100}%` }}
                />
              </div>

              <div className="text-3xl font-black font-mono text-indigo-400">
                {monetagCountdown}s
              </div>

              <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/15 py-1.5 px-3 rounded-full">
                ✨ {gameState.lang === 'en' ? "Reward Rate" : "পুরস্কার পরিমাণ"}: +10,000 Eggs
              </span>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

// Custom phone formatter helper to safeguard numbers
function phonePhoneFormatter(numberStr: string): string {
  // Return standard unformatted string since raw is better for Bangladeshi format
  return numberStr;
}
