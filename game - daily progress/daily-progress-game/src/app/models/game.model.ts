export interface Player {
  id: string;
  name: string;
  coins: number;
  gems: number;
  level: number;
  experience: number;
  lastLoginDate: Date;
  consecutiveLoginDays: number;
  isPremium: boolean;
  premiumExpiry?: Date;
}

export interface Garden {
  level: number;
  plants: Plant[];
  maxPlants: number;
  productivity: number;
  lastHarvestTime: Date;
}

export interface Plant {
  id: string;
  type: PlantType;
  plantedAt: Date;
  growth: number;
  isReady: boolean;
  boosts: Boost[];
}

export enum PlantType {
  FLOWER = 'flower',
  VEGETABLE = 'vegetable',
  FRUIT = 'fruit',
  HERB = 'herb'
}

export interface Boost {
  type: BoostType;
  multiplier: number;
  duration: number;
  remainingTime: number;
}

export enum BoostType {
  GROWTH_SPEED = 'growth_speed',
  COIN_MULTIPLIER = 'coin_multiplier',
  EXPERIENCE_MULTIPLIER = 'experience_multiplier'
}

export interface DailyReward {
  day: number;
  coins: number;
  gems?: number;
  boost?: Boost;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'coins' | 'gems';
  type: ShopItemType;
  value?: any;
  imageUrl?: string;
}

export enum ShopItemType {
  PLANT_SEED = 'plant_seed',
  BOOST = 'boost',
  GARDEN_EXPANSION = 'garden_expansion',
  PREMIUM = 'premium'
}

export interface LeaderboardEntry {
  playerId: string;
  playerName: string;
  score: number;
  level: number;
  rank: number;
  isDemo?: boolean;
  lastActivity?: Date;
}