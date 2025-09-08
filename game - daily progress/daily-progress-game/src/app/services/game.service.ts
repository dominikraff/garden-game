import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { Player, Garden, Plant, PlantType, Boost, BoostType, DailyReward, ShopItem, ShopItemType } from '../models/game.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private readonly STORAGE_KEYS = {
    PLAYER: 'player_data',
    GARDEN: 'garden_data',
    LAST_SAVE: 'last_save_time',
    ACTIVE_BOOSTS: 'active_boosts'
  };

  private playerSubject = new BehaviorSubject<Player | null>(null);
  private gardenSubject = new BehaviorSubject<Garden | null>(null);

  public player$ = this.playerSubject.asObservable();
  public garden$ = this.gardenSubject.asObservable();

  private gameLoopSubscription: any;
  private activeBoosts: Map<string, Date> = new Map();
  private premiumSeeds: Map<string, number> = new Map();

  private leaderboardService: any; // Will be injected later to avoid circular dependency

  constructor() {
    this.initializeGame();
    this.startGameLoop();
    
    // Import LeaderboardService dynamically to avoid circular dependency
    setTimeout(() => {
      import('./leaderboard.service').then(module => {
        this.leaderboardService = new module.LeaderboardService();
      });
    }, 1000);
  }

  private async initializeGame() {
    await this.loadGameData();
    if (!this.playerSubject.value) {
      this.createNewPlayer();
    }
    this.loadPremiumSeeds();
    this.calculateOfflineProgress();
  }

  private createNewPlayer() {
    const newPlayer: Player = {
      id: this.generateId(),
      name: 'Player',
      coins: 100,
      gems: 10,
      level: 1,
      experience: 0,
      lastLoginDate: new Date(),
      consecutiveLoginDays: 1,
      isPremium: false
    };

    const newGarden: Garden = {
      level: 1,
      plants: [],
      maxPlants: 4,
      productivity: 1,
      lastHarvestTime: new Date()
    };

    this.playerSubject.next(newPlayer);
    this.gardenSubject.next(newGarden);
    this.saveGameData();
  }

  private async loadGameData() {
    try {
      const playerData = await Preferences.get({ key: this.STORAGE_KEYS.PLAYER });
      const gardenData = await Preferences.get({ key: this.STORAGE_KEYS.GARDEN });
      const boostsData = await Preferences.get({ key: this.STORAGE_KEYS.ACTIVE_BOOSTS });

      if (playerData.value) {
        const player = JSON.parse(playerData.value);
        player.lastLoginDate = new Date(player.lastLoginDate);
        this.playerSubject.next(player);
      }

      if (gardenData.value) {
        const garden = JSON.parse(gardenData.value);
        garden.lastHarvestTime = new Date(garden.lastHarvestTime);
        garden.plants = garden.plants.map((plant: any) => ({
          ...plant,
          plantedAt: new Date(plant.plantedAt)
        }));
        this.gardenSubject.next(garden);
      }

      // Load active boosts
      if (boostsData.value) {
        const boosts = JSON.parse(boostsData.value);
        // Loading saved boosts
        this.activeBoosts.clear();
        Object.entries(boosts).forEach(([boostId, expiryTime]) => {
          const expiryDate = new Date(expiryTime as string);
          const now = new Date();
          // Check if boost is still valid
          if (expiryDate > now) {
            this.activeBoosts.set(boostId, expiryDate);
            // Boost loaded and active
          }
        });
        // Active boosts loaded
      } else {
        // No saved boosts found
      }
    } catch (error) {
      console.error('Error loading game data:', error);
    }
  }

  private async saveGameData() {
    try {
      const player = this.playerSubject.value;
      const garden = this.gardenSubject.value;

      if (player) {
        await Preferences.set({
          key: this.STORAGE_KEYS.PLAYER,
          value: JSON.stringify(player)
        });
      }

      if (garden) {
        await Preferences.set({
          key: this.STORAGE_KEYS.GARDEN,
          value: JSON.stringify(garden)
        });
      }

      // Save active boosts
      const boostsObject: { [key: string]: string } = {};
      this.activeBoosts.forEach((expiryDate, boostId) => {
        boostsObject[boostId] = expiryDate.toISOString();
      });
      await Preferences.set({
        key: this.STORAGE_KEYS.ACTIVE_BOOSTS,
        value: JSON.stringify(boostsObject)
      });

      await Preferences.set({
        key: this.STORAGE_KEYS.LAST_SAVE,
        value: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error saving game data:', error);
    }
  }

  private startGameLoop() {
    this.gameLoopSubscription = interval(1000).subscribe(() => {
      this.updatePlantGrowth();
      this.updateBoosts();
      if (Math.random() < 0.1) { // Save every ~10 seconds on average
        this.saveGameData();
      }
    });
  }

  private updatePlantGrowth() {
    const garden = this.gardenSubject.value;
    if (!garden) return;

    let updated = false;
    garden.plants.forEach(plant => {
      if (!plant.isReady) {
        const growthRate = this.calculateGrowthRate(plant);
        plant.growth += growthRate;
        
        if (plant.growth >= 100) {
          plant.growth = 100;
          plant.isReady = true;
        }
        updated = true;
      }
    });

    if (updated) {
      this.gardenSubject.next(garden);
    }
  }

  private calculateGrowthRate(plant: Plant): number {
    // Different base rates for different plant types
    const baseRates = {
      [PlantType.FLOWER]: 0.167,    // ~10 minutes (600 seconds)
      [PlantType.VEGETABLE]: 0.125, // ~13.3 minutes (800 seconds)
      [PlantType.FRUIT]: 0.083,     // ~20 minutes (1200 seconds)
      [PlantType.HERB]: 0.100       // ~16.7 minutes (1000 seconds)
    };
    
    let baseRate = baseRates[plant.type] || 0.125;
    
    // Apply boosts
    let totalMultiplier = 1;
    plant.boosts.forEach(boost => {
      if (boost.type === BoostType.GROWTH_SPEED && boost.remainingTime > 0) {
        totalMultiplier *= boost.multiplier;
      }
    });
    
    // Apply the multiplier to the base rate
    return baseRate * totalMultiplier;
  }

  updatePlayer(player: Player): void {
    this.playerSubject.next(player);
    this.saveGameData();
    
    // Update leaderboard when player changes
    if (this.leaderboardService && this.leaderboardService.submitPlayerScore) {
      this.leaderboardService.submitPlayerScore(player);
    }
  }

  private updateBoosts() {
    const garden = this.gardenSubject.value;
    if (!garden) return;

    let updated = false;
    garden.plants.forEach(plant => {
      plant.boosts = plant.boosts.filter(boost => {
        boost.remainingTime -= 1;
        return boost.remainingTime > 0;
      });
      if (plant.boosts.length > 0) updated = true;
    });

    if (updated) {
      this.gardenSubject.next(garden);
    }
  }

  private calculateOfflineProgress() {
    // Calculate what happened while the player was away
    const player = this.playerSubject.value;
    const garden = this.gardenSubject.value;
    
    if (!player || !garden) return;

    const now = new Date();
    const timeDiff = now.getTime() - player.lastLoginDate.getTime();
    const hoursOffline = timeDiff / (1000 * 60 * 60);
    const secondsOffline = timeDiff / 1000;

    // Update plant growth for offline time (2 hours free, unlimited for premium)
    if (garden.plants.length > 0 && secondsOffline > 0) {
      const maxOfflineGrowthHours = player.isPremium ? 24 : 2; // 2 hours for free users
      const effectiveSeconds = Math.min(secondsOffline, maxOfflineGrowthHours * 3600);
      
      let plantsGrown = 0;
      garden.plants.forEach(plant => {
        if (!plant.isReady) {
          const growthRate = 0.125; // Base growth per second (100% in 800 seconds = ~13.3 minutes)
          const offlineGrowth = growthRate * effectiveSeconds;
          plant.growth = Math.min(100, plant.growth + offlineGrowth);
          
          if (plant.growth >= 100) {
            plant.growth = 100;
            plant.isReady = true;
            plantsGrown++;
          }
        }
      });

      if (plantsGrown > 0 || effectiveSeconds > 60) {
        this.showOfflineGrowthProgress(effectiveSeconds / 3600, plantsGrown);
      }
    }

    if (hoursOffline > 1) {
      // Calculate offline rewards (limited to prevent abuse)
      const maxOfflineHours = player.isPremium ? 24 : 8;
      const effectiveHours = Math.min(hoursOffline, maxOfflineHours);
      
      const offlineCoins = Math.floor(effectiveHours * garden.productivity * 5);
      
      if (offlineCoins > 0) {
        player.coins += offlineCoins;
        this.playerSubject.next(player);
        
        // Show offline progress popup
        this.showOfflineProgress(effectiveHours, offlineCoins);
      }
    }

    // Update consecutive login days
    const daysSinceLastLogin = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    if (daysSinceLastLogin === 1) {
      player.consecutiveLoginDays++;
    } else if (daysSinceLastLogin > 1) {
      player.consecutiveLoginDays = 1;
    }

    player.lastLoginDate = now;
    this.playerSubject.next(player);
    this.gardenSubject.next(garden);
  }

  private showOfflineGrowthProgress(hours: number, plantsReady: number) {
    const hoursText = hours < 1 ? `${Math.round(hours * 60)} minutes` : `${hours.toFixed(1)} hours`;
    const plantText = plantsReady > 0 ? ` and ${plantsReady} plants are ready to harvest!` : '';
    // Garden grew while offline
  }

  private showOfflineProgress(hours: number, coins: number) {
    // This would show a modal/alert with offline progress
    // Offline progress calculated
  }

  // Public methods
  plantSeed(plantType: PlantType): boolean {
    const garden = this.gardenSubject.value;
    const player = this.playerSubject.value;
    
    if (!garden || !player || garden.plants.length >= garden.maxPlants) {
      return false;
    }

    const seedCost = this.getSeedCost(plantType);
    if (player.coins < seedCost) {
      return false;
    }

    const newPlant: Plant = {
      id: this.generateId(),
      type: plantType,
      plantedAt: new Date(),
      growth: 0,
      isReady: false,
      boosts: []
    };

    // Apply active boosts to the new plant
    // Check active boosts for new plant
    
    this.activeBoosts.forEach((expiryDate, boostId) => {
      const now = new Date();
      // Check if boost is still valid
      if (expiryDate > now) {
        const remainingTime = Math.floor((expiryDate.getTime() - now.getTime()) / 1000);
        // Apply boost to new plant
        
        if (boostId === 'growth_boost_1h') {
          newPlant.boosts.push({
            type: BoostType.GROWTH_SPEED,
            multiplier: 5,
            duration: remainingTime,
            remainingTime: remainingTime
          });
        } else if (boostId === 'coin_boost_30min') {
          newPlant.boosts.push({
            type: BoostType.COIN_MULTIPLIER,
            multiplier: 2,
            duration: remainingTime,
            remainingTime: remainingTime
          });
        } else if (boostId === 'mega_boost_15min') {
          newPlant.boosts.push({
            type: BoostType.GROWTH_SPEED,
            multiplier: 10,
            duration: remainingTime,
            remainingTime: remainingTime
          });
          newPlant.boosts.push({
            type: BoostType.COIN_MULTIPLIER,
            multiplier: 5,
            duration: remainingTime,
            remainingTime: remainingTime
          });
        } else if (boostId === 'exp_boost_2h') {
          newPlant.boosts.push({
            type: BoostType.EXPERIENCE_MULTIPLIER,
            multiplier: 3,
            duration: remainingTime,
            remainingTime: remainingTime
          });
        }
      }
    });

    // Boosts applied to new plant
    
    garden.plants.push(newPlant);
    player.coins -= seedCost;

    this.gardenSubject.next(garden);
    this.playerSubject.next(player);
    this.saveGameData();
    
    return true;
  }

  harvestPlant(plantId: string): boolean {
    const garden = this.gardenSubject.value;
    const player = this.playerSubject.value;
    
    if (!garden || !player) return false;

    const plantIndex = garden.plants.findIndex(p => p.id === plantId && p.isReady);
    if (plantIndex === -1) return false;

    const plant = garden.plants[plantIndex];
    const reward = this.calculateHarvestReward(plant);
    
    player.coins += reward.coins;
    player.experience += reward.experience;
    
    // Check for level up
    this.checkLevelUp(player);

    garden.plants.splice(plantIndex, 1);

    this.gardenSubject.next(garden);
    this.playerSubject.next(player);
    this.saveGameData();
    
    return true;
  }

  private getSeedCost(plantType: PlantType): number {
    const costs = {
      [PlantType.FLOWER]: 10,
      [PlantType.VEGETABLE]: 15,
      [PlantType.FRUIT]: 25,
      [PlantType.HERB]: 20
    };
    return costs[plantType];
  }

  private calculateHarvestReward(plant: Plant) {
    const baseRewards = {
      [PlantType.FLOWER]: { coins: 20, experience: 5 },
      [PlantType.VEGETABLE]: { coins: 30, experience: 8 },
      [PlantType.FRUIT]: { coins: 50, experience: 12 },
      [PlantType.HERB]: { coins: 40, experience: 10 }
    };

    let reward = baseRewards[plant.type];
    
    // Apply coin multiplier boosts
    plant.boosts.forEach(boost => {
      if (boost.type === BoostType.COIN_MULTIPLIER) {
        reward.coins *= boost.multiplier;
      }
      if (boost.type === BoostType.EXPERIENCE_MULTIPLIER) {
        reward.experience *= boost.multiplier;
      }
    });

    return {
      coins: Math.floor(reward.coins),
      experience: Math.floor(reward.experience)
    };
  }

  private checkLevelUp(player: Player) {
    const experienceNeeded = player.level * 100;
    if (player.experience >= experienceNeeded) {
      player.level++;
      player.experience -= experienceNeeded;
      
      // Level up rewards
      player.coins += player.level * 50;
      
      // Update leaderboard
      this.updateLeaderboard(player);
      
      // Level up!
    }
  }

  private updateLeaderboard(player: Player) {
    if (this.leaderboardService && this.leaderboardService.submitPlayerScore) {
      this.leaderboardService.submitPlayerScore(player).catch((error: any) => {
        console.error('Error updating leaderboard:', error);
      });
    }
  }

  getDailyReward(): DailyReward | null {
    const player = this.playerSubject.value;
    if (!player) return null;

    const today = new Date().toDateString();
    const lastLogin = new Date(player.lastLoginDate).toDateString();
    
    if (today === lastLogin) {
      return null; // Already claimed today
    }

    const day = Math.min(player.consecutiveLoginDays, 7);
    const rewards: DailyReward[] = [
      { day: 1, coins: 50 },
      { day: 2, coins: 75 },
      { day: 3, coins: 100, gems: 1 },
      { day: 4, coins: 150 },
      { day: 5, coins: 200, gems: 2 },
      { day: 6, coins: 300 },
      { day: 7, coins: 500, gems: 5 }
    ];

    return rewards[day - 1];
  }

  claimDailyReward(): boolean {
    const reward = this.getDailyReward();
    const player = this.playerSubject.value;
    
    if (!reward || !player) return false;

    player.coins += reward.coins;
    if (reward.gems) {
      player.gems += reward.gems;
    }

    player.lastLoginDate = new Date();
    this.playerSubject.next(player);
    
    return true;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  applyBoost(boostId: string): void {
    const garden = this.gardenSubject.value;
    if (!garden) return;

    // Apply boost based on type
    const boostDurations: { [key: string]: number } = {
      'growth_boost_1h': 1800, // 30 minutes in seconds
      'coin_boost_30min': 1800, // 30 minutes in seconds
      'mega_boost_15min': 900, // 15 minutes in seconds
      'exp_boost_2h': 7200 // 2 hours in seconds
    };

    const duration = boostDurations[boostId] || 1800;
    const expiryDate = new Date(Date.now() + duration * 1000);
    this.activeBoosts.set(boostId, expiryDate);
    // Boost applied
    
    // Save immediately after setting the boost
    this.saveGameData();

    // Apply boost effects to all plants
    garden.plants.forEach(plant => {
      if (boostId === 'growth_boost_1h') {
        plant.boosts.push({
          type: BoostType.GROWTH_SPEED,
          multiplier: 5, // 5x speed - much faster growth
          duration: duration,
          remainingTime: duration
        });
      } else if (boostId === 'coin_boost_30min') {
        plant.boosts.push({
          type: BoostType.COIN_MULTIPLIER,
          multiplier: 2,
          duration: duration,
          remainingTime: duration
        });
      } else if (boostId === 'mega_boost_15min') {
        plant.boosts.push({
          type: BoostType.GROWTH_SPEED,
          multiplier: 10, // 10x speed - super fast growth
          duration: duration,
          remainingTime: duration
        });
        plant.boosts.push({
          type: BoostType.COIN_MULTIPLIER,
          multiplier: 5,
          duration: duration,
          remainingTime: duration
        });
      } else if (boostId === 'exp_boost_2h') {
        plant.boosts.push({
          type: BoostType.EXPERIENCE_MULTIPLIER,
          multiplier: 3,
          duration: duration,
          remainingTime: duration
        });
      }
    });

    this.gardenSubject.next(garden);
    this.saveGameData();
  }

  addPremiumSeeds(seedType: string, quantity: number): void {
    const current = this.premiumSeeds.get(seedType) || 0;
    this.premiumSeeds.set(seedType, current + quantity);
    this.savePremiumSeeds();
  }

  getPremiumSeeds(seedType: string): number {
    return this.premiumSeeds.get(seedType) || 0;
  }

  usePremiumSeed(seedType: string): boolean {
    const current = this.premiumSeeds.get(seedType) || 0;
    if (current > 0) {
      this.premiumSeeds.set(seedType, current - 1);
      this.savePremiumSeeds();
      return true;
    }
    return false;
  }

  private loadPremiumSeeds(): void {
    const saved = localStorage.getItem('premiumSeeds');
    if (saved) {
      const parsed = JSON.parse(saved);
      for (const [key, value] of Object.entries(parsed)) {
        this.premiumSeeds.set(key, value as number);
      }
    }
  }

  private savePremiumSeeds(): void {
    const toSave: any = {};
    this.premiumSeeds.forEach((value, key) => {
      toSave[key] = value;
    });
    localStorage.setItem('premiumSeeds', JSON.stringify(toSave));
  }

  addGardenField(): void {
    const garden = this.gardenSubject.value;
    if (garden) {
      garden.maxPlants += 1;
      this.gardenSubject.next(garden);
      this.saveGameData();
    }
  }

  ngOnDestroy() {
    if (this.gameLoopSubscription) {
      this.gameLoopSubscription.unsubscribe();
    }
    this.saveGameData();
  }
}