import { UpgradeItem, SocialTask } from './types';

export const UPGRADE_ITEMS: UpgradeItem[] = [
  {
    id: 'multitap',
    nameEn: 'Multitap Multiplier',
    nameBn: 'মাল্টিট্যাপ বুস্টার',
    descriptionEn: 'Earn more eggs per single finger tap.',
    descriptionBn: 'প্রতি ক্লিকে ডিম উপার্জনের সংখ্যা বৃদ্ধি করুন।',
    baseCost: 200,
    costMultiplier: 1.8,
    effectValue: 1, // each level adds +1 per click
    icon: 'Zap'
  },
  {
    id: 'energyTank',
    nameEn: 'Super Energy Tank',
    nameBn: 'ডাবল এনার্জি ট্যাংক',
    descriptionEn: 'Increase maximum energy storage by +500 points.',
    descriptionBn: 'আপনার সর্বোচ্চ শক্তি ধারণ ক্ষমতা ৫০০ পয়েন্ট বাড়িয়ে নিন।',
    baseCost: 150,
    costMultiplier: 1.6,
    effectValue: 500, // each level adds +500 max energy
    icon: 'BatteryCharging'
  },
  {
    id: 'autoNest',
    nameEn: 'Auto Incubation Nest',
    nameBn: 'স্বয়ংক্রিয় ডিম্বাকার নেস্ট',
    descriptionEn: 'Hatch eggs automatically (+2 eggs/sec per level) passively.',
    descriptionBn: 'স্বয়ংক্রিয়ভাবে ডিম ফুটে নিষ্ক্রিয় আয় শুরু হবে (+২ ডিম/সেকেন্ড)।',
    baseCost: 500,
    costMultiplier: 2.2,
    effectValue: 2, // each level adds +2 eggs/sec
    icon: 'Clock'
  },
  {
    id: 'rechargeSpeed',
    nameEn: 'Solar Recharge Panel',
    nameBn: 'সৌর শক্তি রিচার্জার',
    descriptionEn: 'Increases energy recovery speed by +1 point per second.',
    descriptionBn: 'এনার্জি রিচার্জের গতি প্রতি সেকেন্ডে +১ পয়েন্ট বাড়িয়ে নিন।',
    baseCost: 300,
    costMultiplier: 1.9,
    effectValue: 1, // each level adds +1 to energy recovery speed
    icon: 'Sun'
  }
];

export const SOCIAL_TASKS: SocialTask[] = [
  {
    id: 'tg_channel',
    titleEn: 'Join Egg Farming Official Telegram Channel',
    titleBn: 'এগ ফার্মিং অফিসিয়াল টেলিগ্রাম চ্যানেলে যোগ দিন',
    reward: 10000,
    icon: 'Send',
    actionUrl: 'https://t.me/EggFarmingBot_Channel_Sample',
    type: 'telegram'
  },
  {
    id: 'yt_sub',
    titleEn: 'Subscribe to Hatch & Crack YouTube channel',
    titleBn: 'ডিম ফাটানোর অফিসিয়াল ইউটিউব চ্যানেলে যুক্ত হোন',
    reward: 15000,
    icon: 'Youtube',
    actionUrl: 'https://youtube.com/c/EggFarmingBot_Tutorial_Sample',
    type: 'youtube'
  },
  {
    id: 'twitter_follow',
    titleEn: 'Follow @EggFarmingDevs on Twitter/X',
    titleBn: 'টুইটার/X পেইজে ডেভেলপারদের ফলো করুন',
    reward: 8000,
    icon: 'Twitter',
    actionUrl: 'https://twitter.com/EggFarmingBot_Sample',
    type: 'twitter'
  },
  {
    id: 'daily_reward',
    titleEn: 'Daily Incubator Check-in Reward',
    titleBn: 'দৈনিক ইনকিউবেশন বোনাস সংগ্রহ করুন',
    reward: 3000,
    icon: 'Calendar',
    actionUrl: '#id_daily_claim',
    type: 'daily'
  }
];

export function getUpgradeCost(item: UpgradeItem, currentLevel: number): number {
  return Math.round(item.baseCost * Math.pow(item.costMultiplier, currentLevel));
}

export interface MineCard {
  id: string;
  nameEn: string;
  nameBn: string;
  category: 'Markets' | 'PR & Team' | 'Legal' | 'Specials';
  categoryBn: string;
  descriptionEn: string;
  descriptionBn: string;
  baseCost: number;
  costMultiplier: number;
  basePph: number; // Profit Per Hour per level
  icon: string;
}

export const MINE_CARDS: MineCard[] = [
  // Markets Category
  {
    id: "egg_logistics",
    nameEn: "Egg Cargo & Logistics",
    nameBn: "ডিম কার্গো ও লজিস্টিকস",
    category: "Markets",
    categoryBn: "মার্কেটস",
    descriptionEn: "Deploy premium delivery trucks to transport high-yield eggs.",
    descriptionBn: "উচ্চ-উৎপাদনশীল ডিম নিরাপদে বিতরণের জন্য কার্গো ট্রাক নামান।",
    baseCost: 800,
    costMultiplier: 1.5,
    basePph: 150,
    icon: "Coins"
  },
  {
    id: "golden_broker",
    nameEn: "Golden Egg Broker",
    nameBn: "স্বর্ণ ডিমের দালাল",
    category: "Markets",
    categoryBn: "মার্কেটস",
    descriptionEn: "Maximize wholesale egg pricing across central marketplaces.",
    descriptionBn: "কেন্দ্রীয় বাজারে পাইকারি ডিমের সর্বোচ্চ দাম নিশ্চিত করুন।",
    baseCost: 2500,
    costMultiplier: 1.6,
    basePph: 450,
    icon: "TrendingUp"
  },
  {
    id: "hatchery_automation",
    nameEn: "Hatchery Automation V2",
    nameBn: "অটোমেশন হ্যাচারি V2",
    category: "Markets",
    categoryBn: "মার্কেটস",
    descriptionEn: "Industrial grade autonomous incubator control panels.",
    descriptionBn: "শিল্প মানের স্বয়ংক্রিয় ডিম ফুটানোর প্যানেল কন্ট্রোল।",
    baseCost: 5000,
    costMultiplier: 1.7,
    basePph: 950,
    icon: "Zap"
  },
  // PR & Team Category
  {
    id: "mascot_pr",
    nameEn: "Golden Chick Mascot",
    nameBn: "সোনার মুরঙ্গি মাসকট",
    category: "PR & Team",
    categoryBn: "পিআর ও টিম",
    descriptionEn: "Hire a mascot to dance outside the main incubation warehouse.",
    descriptionBn: "হ্যাচারির বাইরে কাস্টমারদের আকর্ষণ করতে মাসকট নাচান।",
    baseCost: 1500,
    costMultiplier: 1.45,
    basePph: 240,
    icon: "Users"
  },
  {
    id: "egg_influencers",
    nameEn: "Viral Egg Marketing",
    nameBn: "ভাইরাল ডিম মার্কেটিং",
    category: "PR & Team",
    categoryBn: "পিআর ও টিম",
    descriptionEn: "Contract leading creators to make TikTok videos holding gold eggs.",
    descriptionBn: "জনপ্রিয় নির্মাতাদের দিয়ে ডিম নিয়ে টিকটক ভিডিও প্রচার করুন।",
    baseCost: 4000,
    costMultiplier: 1.55,
    basePph: 720,
    icon: "Youtube"
  },
  // Legal Category
  {
    id: "quality_license",
    nameEn: "Egg Quality License",
    nameBn: "ডিম গুণগত লাইসেন্স",
    category: "Legal",
    categoryBn: "আইনি",
    descriptionEn: "Receive direct trade compliance certification from officials.",
    descriptionBn: "উদ্ধারকৃত নিরাপদ ডিম বাজারজাতকরণের সরকারি ট্রেড লাইসেন্স লাভ করুন।",
    baseCost: 3500,
    costMultiplier: 1.5,
    basePph: 600,
    icon: "CheckCircle2"
  },
  {
    id: "snatcher_shield",
    nameEn: "Anti-Snatcher Shield",
    nameBn: "ডিম ছিনতাইকারী প্রতিরোধক",
    category: "Legal",
    categoryBn: "আইনি",
    descriptionEn: "Insure your rare golden eggs against incubator raiders.",
    descriptionBn: "ডাকাতি বা ছিনতাইকারীদের হাত থেকে দুর্লভ সোনার ডিম রক্ষা কবচ।",
    baseCost: 6500,
    costMultiplier: 1.62,
    basePph: 1200,
    icon: "ShieldAlert"
  },
  // Specials Category
  {
    id: "crypto_staking",
    nameEn: "Golden Egg Staking Pool",
    nameBn: "সোনার ডিম স্টেকিং পুল",
    category: "Specials",
    categoryBn: "স্পেশালস",
    descriptionEn: "Lock up digital eggs in smart contracts for extreme yields.",
    descriptionBn: "স্মার্ট চুক্তিতে ভার্চুয়াল ডিম লক করে অনন্য প্রফিট লাভ করুন।",
    baseCost: 10000,
    costMultiplier: 1.85,
    basePph: 2200,
    icon: "Sparkles"
  },
  {
    id: "meme_egg_token",
    nameEn: "CYBER $EGGS Meme Coin",
    nameBn: "$EGGS মেমে টোকেন",
    category: "Specials",
    categoryBn: "স্পেশালস",
    descriptionEn: "Hype up the newly minted ERC-20 meme coin built on TON Network.",
    descriptionBn: "TON নেটওয়ার্কে তৈরিকৃত $EGGS মেমে কয়েনের চরম হাইপ তৈরি করুন।",
    baseCost: 20000,
    costMultiplier: 1.9,
    basePph: 4500,
    icon: "Flame"
  }
];

export function getCardUpgradeCost(card: MineCard, currentLevel: number): number {
  return Math.round(card.baseCost * Math.pow(card.costMultiplier, currentLevel));
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}
