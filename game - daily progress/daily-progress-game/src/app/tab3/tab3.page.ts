import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameService } from '../services/game.service';
import { LeaderboardService } from '../services/leaderboard.service';
import { TranslationService } from '../services/translation.service';
import { Player, LeaderboardEntry } from '../models/game.model';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
  requirement: (player: Player) => boolean;
}

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page implements OnInit, OnDestroy {
  player: Player | null = null;
  selectedCategory: string = 'level';
  playerRank: number = 999; // Start with a high rank until calculated
  playerAchievements: Achievement[] = [];
  leaderboard: LeaderboardEntry[] = [];
  
  private subscriptions: Subscription[] = [];

  // Real leaderboard data comes from LeaderboardService

  private achievements: Achievement[] = [];

  constructor(
    private gameService: GameService,
    private leaderboardService: LeaderboardService,
    private translationService: TranslationService
  ) {
    this.initializeAchievements();
  }

  private initializeAchievements() {
    this.achievements = [
      // Level Achievements
      {
        id: 'first_steps',
        name: this.t('achievements.firstSteps.name'),
        description: this.t('achievements.firstSteps.desc'),
        icon: 'footsteps-outline',
        color: 'success',
        unlocked: false,
        requirement: (player) => player.level >= 1
      },
      {
        id: 'level_5',
        name: this.t('achievements.level5.name'),
        description: this.t('achievements.level5.desc'),
        icon: 'trending-up-outline',
        color: 'primary',
        unlocked: false,
        requirement: (player) => player.level >= 5
      },
      {
        id: 'level_10',
        name: this.t('achievements.level10.name'),
        description: this.t('achievements.level10.desc'),
        icon: 'medal-outline',
        color: 'primary',
        unlocked: false,
        requirement: (player) => player.level >= 10
      },
      {
        id: 'level_25',
        name: this.t('achievements.level25.name'),
        description: this.t('achievements.level25.desc'),
        icon: 'trophy-outline',
        color: 'warning',
        unlocked: false,
        requirement: (player) => player.level >= 25
      },
      {
        id: 'level_50',
        name: this.t('achievements.level50.name'),
        description: this.t('achievements.level50.desc'),
        icon: 'shield-outline',
        color: 'danger',
        unlocked: false,
        requirement: (player) => player.level >= 50
      },
      {
        id: 'level_100',
        name: this.t('achievements.level100.name'),
        description: this.t('achievements.level100.desc'),
        icon: 'crown-outline',
        color: 'warning',
        unlocked: false,
        requirement: (player) => player.level >= 100
      },
      
      // Coin Achievements
      {
        id: 'coins_100',
        name: this.t('achievements.coins100.name'),
        description: this.t('achievements.coins100.desc'),
        icon: 'cash-outline',
        color: 'warning',
        unlocked: false,
        requirement: (player) => player.coins >= 100
      },
      {
        id: 'coins_1000',
        name: this.t('achievements.coins1000.name'),
        description: this.t('achievements.coins1000.desc'),
        icon: 'cash-outline',
        color: 'warning',
        unlocked: false,
        requirement: (player) => player.coins >= 1000
      },
      {
        id: 'coins_10000',
        name: this.t('achievements.coins10000.name'),
        description: this.t('achievements.coins10000.desc'),
        icon: 'wallet-outline',
        color: 'warning',
        unlocked: false,
        requirement: (player) => player.coins >= 10000
      },
      {
        id: 'coins_100000',
        name: this.t('achievements.coins100000.name'),
        description: this.t('achievements.coins100000.desc'),
        icon: 'business-outline',
        color: 'tertiary',
        unlocked: false,
        requirement: (player) => player.coins >= 100000
      },
      
      // Gem Achievements
      {
        id: 'gems_10',
        name: this.t('achievements.gems10.name'),
        description: this.t('achievements.gems10.desc'),
        icon: 'diamond-outline',
        color: 'secondary',
        unlocked: false,
        requirement: (player) => player.gems >= 10
      },
      {
        id: 'gems_50',
        name: this.t('achievements.gems50.name'),
        description: this.t('achievements.gems50.desc'),
        icon: 'diamond-outline',
        color: 'secondary',
        unlocked: false,
        requirement: (player) => player.gems >= 50
      },
      {
        id: 'gems_100',
        name: this.t('achievements.gems100.name'),
        description: this.t('achievements.gems100.desc'),
        icon: 'diamond-outline',
        color: 'tertiary',
        unlocked: false,
        requirement: (player) => player.gems >= 100
      },
      {
        id: 'gems_500',
        name: this.t('achievements.gems500.name'),
        description: this.t('achievements.gems500.desc'),
        icon: 'sparkles-outline',
        color: 'danger',
        unlocked: false,
        requirement: (player) => player.gems >= 500
      },
      
      // Login Streak Achievements
      {
        id: 'streak_3',
        name: this.t('achievements.streak3.name'),
        description: this.t('achievements.streak3.desc'),
        icon: 'calendar-outline',
        color: 'tertiary',
        unlocked: false,
        requirement: (player) => player.consecutiveLoginDays >= 3
      },
      {
        id: 'streak_7',
        name: this.t('achievements.streak7.name'),
        description: this.t('achievements.streak7.desc'),
        icon: 'calendar-outline',
        color: 'tertiary',
        unlocked: false,
        requirement: (player) => player.consecutiveLoginDays >= 7
      },
      {
        id: 'streak_14',
        name: this.t('achievements.streak14.name'),
        description: this.t('achievements.streak14.desc'),
        icon: 'calendar-number-outline',
        color: 'primary',
        unlocked: false,
        requirement: (player) => player.consecutiveLoginDays >= 14
      },
      {
        id: 'streak_30',
        name: this.t('achievements.streak30.name'),
        description: this.t('achievements.streak30.desc'),
        icon: 'ribbon-outline',
        color: 'warning',
        unlocked: false,
        requirement: (player) => player.consecutiveLoginDays >= 30
      },
      {
        id: 'streak_100',
        name: this.t('achievements.streak100.name'),
        description: this.t('achievements.streak100.desc'),
        icon: 'flame-outline',
        color: 'danger',
        unlocked: false,
        requirement: (player) => player.consecutiveLoginDays >= 100
      },
      {
        id: 'streak_365',
        name: this.t('achievements.streak365.name'),
        description: this.t('achievements.streak365.desc'),
        icon: 'star-outline',
        color: 'warning',
        unlocked: false,
        requirement: (player) => player.consecutiveLoginDays >= 365
      },
      
      // Special Achievements
      {
        id: 'premium_member',
        name: this.t('achievements.premium.name'),
        description: this.t('achievements.premium.desc'),
        icon: 'star-outline',
        color: 'warning',
        unlocked: false,
        requirement: (player) => player.isPremium
      },
      {
        id: 'night_owl',
        name: this.t('achievements.nightOwl.name'),
        description: this.t('achievements.nightOwl.desc'),
        icon: 'moon-outline',
        color: 'medium',
        unlocked: false,
        requirement: (player) => {
          const hour = new Date().getHours();
          return hour >= 0 && hour <= 4;
        }
      },
      {
        id: 'early_bird',
        name: this.t('achievements.earlyBird.name'),
        description: this.t('achievements.earlyBird.desc'),
        icon: 'sunny-outline',
        color: 'warning',
        unlocked: false,
        requirement: (player) => {
          const hour = new Date().getHours();
          return hour >= 5 && hour <= 7;
        }
      },
      {
        id: 'leaderboard_top10',
        name: this.t('achievements.top10.name'),
        description: this.t('achievements.top10.desc'),
        icon: 'podium-outline',
        color: 'primary',
        unlocked: false,
        requirement: (player) => this.leaderboard.length >= 10 && this.playerRank > 0 && this.playerRank <= 10
      },
      {
        id: 'leaderboard_top3',
        name: this.t('achievements.top3.name'),
        description: this.t('achievements.top3.desc'),
        icon: 'trophy-outline',
        color: 'warning',
        unlocked: false,
        requirement: (player) => this.leaderboard.length >= 3 && this.playerRank > 0 && this.playerRank <= 3
      },
      {
        id: 'leaderboard_first',
        name: this.t('achievements.first.name'),
        description: this.t('achievements.first.desc'),
        icon: 'crown-outline',
        color: 'warning',
        unlocked: false,
        requirement: (player) => this.leaderboard.length > 0 && this.playerRank === 1 && this.leaderboard.some(e => e.playerId !== player.id)
      }
    ];
  }

  ngOnInit() {
    this.subscriptions.push(
      this.gameService.player$.subscribe(player => {
        this.player = player;
        if (player) {
          this.updatePlayerRank();
          this.updateAchievements();
        }
      })
    );

    this.subscriptions.push(
      this.leaderboardService.leaderboard$.subscribe(entries => {
        this.leaderboard = entries;
        this.updatePlayerRank();
      })
    );
  }

  t(key: string): string {
    return this.translationService.translate(key);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  calculateScore(): number {
    if (!this.player) return 0;
    return (this.player.level * 100) + Math.floor(this.player.coins / 10) + (this.player.gems * 10);
  }

  private updatePlayerRank() {
    if (!this.player) {
      this.playerRank = 999;
      return;
    }

    const playerScore = this.calculateScore();
    const playersAbove = this.leaderboard.filter(entry => entry.score > playerScore);
    this.playerRank = playersAbove.length + 1;
    
    // If player is not in leaderboard yet and there are other players, add to the count
    const isPlayerInLeaderboard = this.leaderboard.some(entry => entry.playerId === this.player!.id);
    if (!isPlayerInLeaderboard && this.leaderboard.length > 0) {
      // Player is not in the saved leaderboard yet
      this.playerRank = Math.max(this.playerRank, this.leaderboard.length + 1);
    }
  }

  private updateAchievements() {
    if (!this.player) return;

    // Re-initialize achievements with current translations
    this.initializeAchievements();
    
    this.playerAchievements = this.achievements.map(achievement => ({
      ...achievement,
      unlocked: achievement.requirement(this.player!)
    }));
  }

  onCategoryChange(event: any) {
    this.selectedCategory = event.detail.value;
  }

  getCategoryTitle(): string {
    const titleKeys = {
      level: 'leaderboard.category.level',
      coins: 'leaderboard.category.coins',
      daily: 'leaderboard.category.daily'
    };
    return this.t(titleKeys[this.selectedCategory as keyof typeof titleKeys] || 'leaderboard.title');
  }

  getFilteredLeaderboard(): LeaderboardEntry[] {
    let sortedLeaderboard = [...this.leaderboard];
    
    // Sort based on category
    switch (this.selectedCategory) {
      case 'level':
        sortedLeaderboard.sort((a, b) => b.level - a.level);
        break;
      case 'coins':
        sortedLeaderboard.sort((a, b) => b.score - a.score);
        break;
      case 'daily':
        // For daily streaks, we'll use a mock calculation based on level
        sortedLeaderboard.sort((a, b) => (b.level * 2) - (a.level * 2));
        break;
    }

    // Add current player if they're not in the list
    if (this.player && !sortedLeaderboard.find(entry => entry.playerId === this.player!.id)) {
      const playerEntry: LeaderboardEntry = {
        playerId: this.player.id,
        playerName: this.player.name,
        score: this.calculateScore(),
        level: this.player.level,
        rank: this.playerRank
      };
      
      // Insert player in correct position
      let inserted = false;
      for (let i = 0; i < sortedLeaderboard.length; i++) {
        if (this.shouldInsertPlayerBefore(playerEntry, sortedLeaderboard[i])) {
          sortedLeaderboard.splice(i, 0, playerEntry);
          inserted = true;
          break;
        }
      }
      
      if (!inserted) {
        sortedLeaderboard.push(playerEntry);
      }
    }

    return sortedLeaderboard.slice(0, 10); // Show top 10
  }

  private shouldInsertPlayerBefore(player: LeaderboardEntry, entry: LeaderboardEntry): boolean {
    switch (this.selectedCategory) {
      case 'level':
        return player.level > entry.level;
      case 'coins':
        return player.score > entry.score;
      case 'daily':
        return (player.level * 2) > (entry.level * 2);
      default:
        return false;
    }
  }

  getTrophyIcon(index: number): string {
    const icons = ['trophy', 'medal', 'ribbon'];
    return icons[index] || 'trophy-outline';
  }

  getTrophyColor(index: number): string {
    const colors = ['warning', 'medium', 'tertiary'];
    return colors[index] || 'medium';
  }

  getCategoryIcon(category: string): string {
    const icons = {
      level: 'trending-up-outline',
      coins: 'cash-outline',
      daily: 'calendar-outline'
    };
    return icons[category as keyof typeof icons] || 'trophy-outline';
  }

  getScoreText(entry: LeaderboardEntry, category: string): string {
    switch (category) {
      case 'level':
        return `${this.t('leaderboard.level')} ${entry.level}`;
      case 'coins':
        return `${entry.score.toLocaleString()} ${this.t('leaderboard.points')}`;
      case 'daily':
        const days = this.player?.consecutiveLoginDays || 1;
        return `${days} ${this.t('leaderboard.days')}`;
      default:
        return entry.score.toString();
    }
  }

  isPlayerActive(entry: LeaderboardEntry): boolean {
    if (!entry.lastActivity) return false;
    const now = Date.now();
    const lastActivity = new Date(entry.lastActivity).getTime();
    const fiveMinutes = 5 * 60 * 1000;
    return (now - lastActivity) < fiveMinutes;
  }
}
