import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Player, LeaderboardEntry } from '../models/game.model';
import { Preferences } from '@capacitor/preferences';

interface StoredLeaderboard {
  entries: LeaderboardEntry[];
  lastUpdate: string;
}

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {
  private readonly STORAGE_KEY = 'leaderboard_data';
  private readonly DEMO_PLAYERS_KEY = 'demo_players_data';
  private readonly UPDATE_INTERVAL = 5 * 60 * 1000; // 5 minutes

  private leaderboardSubject = new BehaviorSubject<LeaderboardEntry[]>([]);
  public leaderboard$ = this.leaderboardSubject.asObservable();
  
  private demoUpdateInterval: any;
  private lastDemoUpdate: Date = new Date();

  constructor() {
    this.loadLeaderboard();
    this.initializeDemoPlayers();
    this.startDemoPlayerSimulation();
  }

  private async loadLeaderboard(): Promise<void> {
    try {
      const stored = await Preferences.get({ key: this.STORAGE_KEY });
      if (stored.value) {
        const data: StoredLeaderboard = JSON.parse(stored.value);
        this.leaderboardSubject.next(data.entries);
      } else {
        // Start with empty leaderboard
        this.leaderboardSubject.next([]);
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      this.leaderboardSubject.next([]);
    }
  }

  private async saveLeaderboard(entries: LeaderboardEntry[]): Promise<void> {
    try {
      const data: StoredLeaderboard = {
        entries,
        lastUpdate: new Date().toISOString()
      };
      
      await Preferences.set({
        key: this.STORAGE_KEY,
        value: JSON.stringify(data)
      });
    } catch (error) {
      console.error('Error saving leaderboard:', error);
    }
  }




  async submitPlayerScore(player: Player): Promise<void> {
    const currentEntries = this.leaderboardSubject.value;
    const playerScore = this.calculatePlayerScore(player);
    
    // Find existing player or add new entry
    const existingIndex = currentEntries.findIndex(entry => entry.playerId === player.id);
    
    const playerEntry: LeaderboardEntry = {
      playerId: player.id,
      playerName: player.name,
      level: player.level,
      score: playerScore,
      rank: 0 // Will be calculated after sorting
    };

    let updatedEntries: LeaderboardEntry[];
    
    if (existingIndex >= 0) {
      // Update existing entry
      updatedEntries = [...currentEntries];
      updatedEntries[existingIndex] = playerEntry;
    } else {
      // Add new entry
      updatedEntries = [...currentEntries, playerEntry];
    }

    // Re-sort and update ranks
    updatedEntries.sort((a, b) => b.score - a.score);
    updatedEntries.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    // Keep only top 50 entries
    updatedEntries = updatedEntries.slice(0, 50);

    this.leaderboardSubject.next(updatedEntries);
    this.saveLeaderboard(updatedEntries);
  }

  private calculatePlayerScore(player: Player): number {
    // More balanced scoring system
    const levelScore = (player.level - 1) * 100; // Start at 0 for level 1
    const coinScore = Math.floor(player.coins / 10);
    const gemScore = player.gems * 10;
    const loginScore = (player.consecutiveLoginDays - 1) * 20; // Start at 0 for day 1
    
    return levelScore + coinScore + gemScore + loginScore;
  }

  getPlayerRank(playerId: string): number {
    const entries = this.leaderboardSubject.value;
    const entry = entries.find(e => e.playerId === playerId);
    return entry?.rank || entries.length + 1;
  }

  getLeaderboardByCategory(category: 'level' | 'coins' | 'daily'): Observable<LeaderboardEntry[]> {
    return this.leaderboard$.pipe(
      map(entries => {
        const sortedEntries = [...entries];
        
        switch (category) {
          case 'level':
            sortedEntries.sort((a, b) => b.level - a.level);
            break;
          case 'coins':
            sortedEntries.sort((a, b) => b.score - a.score);
            break;
          case 'daily':
            // Simulate daily streak data based on score/level
            sortedEntries.sort((a, b) => (b.level * 2 + b.score / 100) - (a.level * 2 + a.score / 100));
            break;
        }
        
        // Update ranks for this specific category
        sortedEntries.forEach((entry, index) => {
          entry.rank = index + 1;
        });
        
        return sortedEntries;
      })
    );
  }

  // Simulate real-time updates
  subscribeToLeaderboardUpdates(): Observable<LeaderboardEntry[]> {
    return this.leaderboard$.pipe(
      delay(100) // Small delay to simulate network latency
    );
  }

  // Clear leaderboard (for testing/admin)
  async clearLeaderboard(): Promise<void> {
    this.leaderboardSubject.next([]);
    await Preferences.remove({ key: this.STORAGE_KEY });
  }

  // Demo players system
  private async initializeDemoPlayers(): Promise<void> {
    try {
      const stored = await Preferences.get({ key: this.DEMO_PLAYERS_KEY });
      const currentEntries = this.leaderboardSubject.value;
      
      if (!stored.value && currentEntries.length === 0) {
        // Create initial demo players only if leaderboard is empty
        const demoPlayers = this.createInitialDemoPlayers();
        const updatedEntries = [...currentEntries, ...demoPlayers];
        
        // Sort and assign ranks
        updatedEntries.sort((a, b) => b.score - a.score);
        updatedEntries.forEach((entry, index) => {
          entry.rank = index + 1;
        });
        
        this.leaderboardSubject.next(updatedEntries);
        await this.saveLeaderboard(updatedEntries);
        await this.saveDemoPlayersState();
      }
    } catch (error) {
      console.error('Error initializing demo players:', error);
    }
  }

  private createInitialDemoPlayers(): LeaderboardEntry[] {
    const germanNames = [
      'Max Müller', 'Anna Schmidt', 'Leon Wagner', 'Emma Fischer',
      'Felix Weber', 'Mia Meyer', 'Paul Hoffmann', 'Sophie Schäfer',
      'Lukas Koch', 'Marie Bauer', 'Tim Richter', 'Laura Klein',
      'Jonas Wolf', 'Lena Schröder', 'Finn Neumann'
    ];

    return germanNames.map((name, index) => {
      const baseLevel = Math.max(1, 15 - index);
      const randomVariation = Math.random() * 0.3 - 0.15; // ±15% variation
      const level = Math.max(1, Math.round(baseLevel * (1 + randomVariation)));
      
      const coins = Math.floor(Math.random() * 1000 * level) + 100;
      const gems = Math.floor(Math.random() * 20) + level;
      const loginDays = Math.floor(Math.random() * 30) + 1;
      
      const score = (level * 100) + Math.floor(coins / 10) + (gems * 10) + (loginDays * 20);
      
      return {
        playerId: `demo_${index}_${Date.now()}`,
        playerName: name,
        level: level,
        score: score,
        rank: 0,
        isDemo: true,
        lastActivity: new Date(Date.now() - Math.random() * 3600000) // Random activity in last hour
      } as LeaderboardEntry;
    });
  }

  private startDemoPlayerSimulation(): void {
    // Update demo players every 30 seconds
    this.demoUpdateInterval = setInterval(() => {
      this.updateDemoPlayers();
    }, 30000);
  }

  private async updateDemoPlayers(): Promise<void> {
    const entries = this.leaderboardSubject.value;
    const demoEntries = entries.filter((e: any) => e.isDemo);
    
    if (demoEntries.length === 0) return;
    
    const updatedEntries = entries.map((entry: any) => {
      if (!entry.isDemo) return entry;
      
      // Simulate different player behaviors
      const random = Math.random();
      const timeSinceLastActivity = Date.now() - new Date(entry.lastActivity || Date.now()).getTime();
      const isActive = timeSinceLastActivity < 300000; // Active in last 5 minutes
      
      if (random < 0.3 && isActive) { // 30% chance of progress if active
        // Player made progress
        const levelUp = Math.random() < 0.1; // 10% chance to level up
        const newLevel = levelUp ? entry.level + 1 : entry.level;
        const coinsGained = Math.floor(Math.random() * 100) + 20;
        const gemsGained = Math.random() < 0.2 ? Math.floor(Math.random() * 3) + 1 : 0;
        
        const currentCoins = (entry.score - entry.level * 100) * 10; // Reverse calculate coins
        const newCoins = currentCoins + coinsGained;
        const currentGems = Math.floor((entry.score - entry.level * 100 - currentCoins / 10) / 10);
        const newGems = currentGems + gemsGained;
        
        const newScore = (newLevel * 100) + 
                        Math.floor(newCoins / 10) + 
                        (newGems * 10) + 
                        (Math.floor(Math.random() * 30) * 20);
        
        return {
          ...entry,
          level: newLevel,
          score: newScore,
          lastActivity: new Date()
        };
      } else if (random < 0.1) { // 10% chance to go inactive
        return {
          ...entry,
          lastActivity: new Date(Date.now() - 600000) // Set as inactive
        };
      } else if (random < 0.2 && !isActive) { // 20% chance to come back online if inactive
        return {
          ...entry,
          lastActivity: new Date()
        };
      }
      
      return entry;
    });
    
    // Re-sort and update ranks
    updatedEntries.sort((a, b) => b.score - a.score);
    updatedEntries.forEach((entry, index) => {
      entry.rank = index + 1;
    });
    
    this.leaderboardSubject.next(updatedEntries);
    await this.saveLeaderboard(updatedEntries);
  }

  private async saveDemoPlayersState(): Promise<void> {
    try {
      await Preferences.set({
        key: this.DEMO_PLAYERS_KEY,
        value: JSON.stringify({
          initialized: true,
          lastUpdate: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Error saving demo players state:', error);
    }
  }

  ngOnDestroy(): void {
    if (this.demoUpdateInterval) {
      clearInterval(this.demoUpdateInterval);
    }
  }
}