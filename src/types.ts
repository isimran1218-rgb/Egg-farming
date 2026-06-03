export type Language = 'en' | 'bn';

export interface GameState {
  balance: number;
  lifetimeEggs: number;
  energy: number;
  maxEnergy: number;
  energyRechargeRate: number; // energy per second
  tapMultiplier: number; // eggs per tap
  autoClickRate: number; // eggs per second (idle)
  lang: Language;
  levels: {
    multitap: number;
    energyTank: number;
    autoNest: number;
    rechargeSpeed: number;
  };
  referralCode: string;
  referredBy: string | null;
  referralRewardClaimed: boolean;
  tasksCompleted: string[];
  streakCount: number;
  lastClaimedStreakDate: string | null;
  profit_per_hour: number;
  last_claim_timestamp: string;
  mine_cards_owned: { card_id: string; current_level: number }[];
  usdt_balance?: number;
  username?: string;
  monetag_ads_watched?: number;
  monetag_completed_ids?: number[];
  monetag_last_watched_timestamp?: string | null;
  monetag_slots_timestamps?: { [slotId: number]: string };
  lastSaved: number;
}

export interface UpgradeItem {
  id: keyof GameState['levels'];
  nameEn: string;
  nameBn: string;
  descriptionEn: string;
  descriptionBn: string;
  baseCost: number;
  costMultiplier: number;
  effectValue: number;
  icon: string;
}

export interface SocialTask {
  id: string;
  titleEn: string;
  titleBn: string;
  reward: number;
  icon: string;
  actionUrl: string;
  type: 'telegram' | 'youtube' | 'twitter' | 'daily';
}

export interface WithdrawalRecord {
  id: string;
  phone: string;
  operator: 'TON Space' | 'Tonkeeper' | 'MyTonWallet';
  eggAmount: number;
  bdtAmount: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  timestamp: number;
  trxId: string;
}
