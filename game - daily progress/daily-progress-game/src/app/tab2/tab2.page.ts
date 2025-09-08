import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { GameService } from '../services/game.service';
import { TranslationService } from '../services/translation.service';
import { Player } from '../models/game.model';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'coins' | 'gems';
  icon: string;
  color: string;
  type: 'boost' | 'seed' | 'premium' | 'upgrade';
}

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit, OnDestroy {
  player: Player | null = null;
  private subscriptions: Subscription[] = [];
  private lastAdWatchTime: Date | null = null;
  private adCooldownMinutes = 5;
  private boostCooldowns: Map<string, Date> = new Map();

  get boostItems(): ShopItem[] {
    return [
      {
        id: 'growth_boost_1h',
        name: this.t('shop.growth.boost'),
        description: this.t('shop.growth.desc'),
        price: 25,
        currency: 'coins',
        icon: 'flash-outline',
        color: 'success',
        type: 'boost'
      },
      {
        id: 'coin_boost_30min',
        name: this.t('shop.coin.multiplier'),
        description: this.t('shop.coin.desc'),
        price: 50,
        currency: 'coins',
        icon: 'cash-outline',
        color: 'warning',
        type: 'boost'
      },
      {
        id: 'mega_boost_15min',
        name: this.t('shop.mega.boost'),
        description: this.t('shop.mega.desc'),
        price: 5,
        currency: 'gems',
        icon: 'rocket-outline',
        color: 'danger',
        type: 'boost'
      },
      {
        id: 'exp_boost_2h',
        name: this.t('shop.exp.boost'),
        description: this.t('shop.exp.desc'),
        price: 3,
        currency: 'gems',
        icon: 'trophy-outline',
        color: 'tertiary',
        type: 'boost'
      }
    ];
  }

  get seedItems(): ShopItem[] {
    return [
      {
        id: 'rare_flowers',
        name: this.t('shop.rare.flowers'),
        description: this.t('shop.rare.flowersDesc'),
        price: 100,
        currency: 'coins',
        icon: 'rose-outline',
        color: 'danger',
        type: 'seed'
      },
      {
        id: 'exotic_fruits',
        name: this.t('shop.exotic.fruits'),
        description: this.t('shop.exotic.fruitsDesc'),
        price: 2,
        currency: 'gems',
        icon: 'leaf-outline',
        color: 'warning',
        type: 'seed'
      },
      {
        id: 'magic_herbs',
        name: this.t('shop.magic.herbs'),
        description: this.t('shop.magic.herbsDesc'),
        price: 3,
        currency: 'gems',
        icon: 'medical-outline',
        color: 'secondary',
        type: 'seed'
      }
    ];
  }

  get upgradeItems(): ShopItem[] {
    return [
      {
        id: 'extra_field',
        name: this.t('shop.extra.field'),
        description: this.t('shop.extra.fieldDesc'),
        price: 500,
        currency: 'coins',
        icon: 'add-circle-outline',
        color: 'success',
        type: 'upgrade'
      }
    ];
  }

  constructor(
    private gameService: GameService,
    private translationService: TranslationService,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  t(key: string): string {
    return this.translationService.translate(key);
  }

  ngOnInit() {
    this.subscriptions.push(
      this.gameService.player$.subscribe(player => {
        this.player = player;
      })
    );

    // Load last ad watch time from storage
    this.loadAdCooldown();
    // Load boost cooldowns
    this.loadBoostCooldowns();
    
    // Update cooldowns every second
    setInterval(() => {
      // Force change detection for cooldown display
      this.boostCooldowns.forEach((value, key) => {
        if (new Date() >= value) {
          this.boostCooldowns.delete(key);
        }
      });
    }, 1000);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  canAfford(item: ShopItem): boolean {
    if (!this.player) return false;
    
    if (item.currency === 'coins') {
      return this.player.coins >= item.price;
    } else {
      return this.player.gems >= item.price;
    }
  }

  async purchasePremium() {
    if (!this.player) return;

    const alert = await this.alertController.create({
      header: this.t('shop.premium.purchaseTitle'),
      message: this.t('shop.premium.purchaseMessage'),
      buttons: [
        {
          text: this.t('common.cancel'),
          role: 'cancel'
        },
        {
          text: this.t('shop.premium.purchaseConfirm'),
          handler: () => {
            // In einer echten App würde hier die Zahlungsabwicklung stattfinden
            // For now, we just simulate the purchase
            this.simulatePremiumPurchase();
          }
        }
      ]
    });

    await alert.present();
  }

  private async simulatePremiumPurchase() {
    if (!this.player) return;

    // Simuliere Premium-Kauf (in echter App würde hier die Zahlungsabwicklung erfolgen)
    this.player.isPremium = true;
    this.player.gems += 10; // Bonus-Gems als Willkommensgeschenk
    this.player.premiumExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    this.gameService.updatePlayer(this.player);

    const toast = await this.toastController.create({
      message: this.t('shop.premium.activated'),
      duration: 3000,
      color: 'success',
      position: 'bottom',
      cssClass: 'toast-above-tabs'
    });
    toast.present();
  }

  private async completePremiumPurchase() {
    // Legacy method - redirect to new method
    await this.simulatePremiumPurchase();
  }

  async purchaseBoost(item: ShopItem) {
    if (!this.player || !this.canAfford(item)) {
      const toast = await this.toastController.create({
        message: this.t('shop.insufficientFunds'),
        duration: 2000,
        color: 'danger',
        position: 'bottom',
        cssClass: 'toast-above-tabs'
      });
      toast.present();
      return;
    }

    // Check if boost is on cooldown
    if (this.isBoostOnCooldown(item.id)) {
      const toast = await this.toastController.create({
        message: this.t('shop.boostOnCooldown'),
        duration: 2000,
        color: 'warning',
        position: 'bottom',
        cssClass: 'toast-above-tabs'
      });
      toast.present();
      return;
    }

    // Show confirmation
    const alert = await this.alertController.create({
      header: this.t('shop.confirmPurchase'),
      message: `${this.t('shop.confirmMessage')} ${item.name} ${this.t('shop.for')} ${item.price} ${item.currency === 'coins' ? this.t('common.coins') : this.t('common.gems')}?`,
      cssClass: 'custom-alert',
      buttons: [
        {
          text: this.t('common.ok'),
          handler: () => {
            this.completeBoostPurchase(item);
          }
        },
        {
          text: this.t('common.cancel'),
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }

  private async completeBoostPurchase(item: ShopItem) {
    if (!this.player) return;

    if (item.currency === 'coins') {
      this.player.coins -= item.price;
    } else {
      this.player.gems -= item.price;
    }

    // Apply boost to garden
    this.gameService.applyBoost(item.id);
    
    // Set cooldown (30 minutes)
    this.boostCooldowns.set(item.id, new Date(Date.now() + 30 * 60 * 1000));
    this.saveBoostCooldowns();

    // Update player
    this.gameService.updatePlayer(this.player);

    const toast = await this.toastController.create({
      message: `${item.name} ${this.t('shop.activated')}! 🚀`,
      duration: 2000,
      color: 'success',
      position: 'bottom',
      cssClass: 'toast-above-tabs'
    });
    toast.present();
  }

  isBoostOnCooldown(boostId: string): boolean {
    const cooldownEnd = this.boostCooldowns.get(boostId);
    if (!cooldownEnd) return false;
    return new Date() < cooldownEnd;
  }

  getBoostCooldownTime(boostId: string): string {
    const cooldownEnd = this.boostCooldowns.get(boostId);
    if (!cooldownEnd) return '';
    
    const now = new Date();
    if (now >= cooldownEnd) {
      this.boostCooldowns.delete(boostId);
      return '';
    }
    
    const remaining = cooldownEnd.getTime() - now.getTime();
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  private loadBoostCooldowns() {
    const saved = localStorage.getItem('boostCooldowns');
    if (saved) {
      const parsed = JSON.parse(saved);
      for (const [key, value] of Object.entries(parsed)) {
        this.boostCooldowns.set(key, new Date(value as string));
      }
    }
  }

  private saveBoostCooldowns() {
    const toSave: any = {};
    this.boostCooldowns.forEach((value, key) => {
      toSave[key] = value.toISOString();
    });
    localStorage.setItem('boostCooldowns', JSON.stringify(toSave));
  }

  async purchaseUpgrade(item: ShopItem) {
    if (!this.player || !this.canAfford(item)) {
      const toast = await this.toastController.create({
        message: this.t('shop.insufficientFunds'),
        duration: 2000,
        color: 'danger',
        position: 'bottom',
        cssClass: 'toast-above-tabs'
      });
      toast.present();
      return;
    }

    // Show confirmation
    const alert = await this.alertController.create({
      header: this.t('shop.confirmPurchase'),
      message: `${this.t('shop.confirmMessage')} ${item.name} ${this.t('shop.for')} ${item.price} ${item.currency === 'coins' ? this.t('common.coins') : this.t('common.gems')}?`,
      cssClass: 'custom-alert',
      buttons: [
        {
          text: this.t('common.ok'),
          handler: () => {
            this.completeUpgradePurchase(item);
          }
        },
        {
          text: this.t('common.cancel'),
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }

  private async completeUpgradePurchase(item: ShopItem) {
    if (!this.player) return;

    if (item.currency === 'coins') {
      this.player.coins -= item.price;
    } else {
      this.player.gems -= item.price;
    }

    // Apply upgrade
    if (item.id === 'extra_field') {
      this.gameService.addGardenField();
    }

    this.gameService.updatePlayer(this.player);

    const toast = await this.toastController.create({
      message: `${item.name} ${this.t('shop.purchased')}! 🌱`,
      duration: 3000,
      color: 'success',
      position: 'bottom',
      cssClass: 'toast-above-tabs'
    });
    toast.present();
  }

  async purchaseSeed(item: ShopItem) {
    if (!this.player || !this.canAfford(item)) {
      const toast = await this.toastController.create({
        message: this.t('shop.insufficientFunds'),
        duration: 2000,
        color: 'danger',
        position: 'bottom',
        cssClass: 'toast-above-tabs'
      });
      toast.present();
      return;
    }

    // Show confirmation
    const alert = await this.alertController.create({
      header: this.t('shop.confirmPurchase'),
      message: `${this.t('shop.confirmMessage')} ${item.name} ${this.t('shop.for')} ${item.price} ${item.currency === 'coins' ? this.t('common.coins') : this.t('common.gems')}?`,
      cssClass: 'custom-alert',
      buttons: [
        {
          text: this.t('common.ok'),
          handler: () => {
            this.completeSeedPurchase(item);
          }
        },
        {
          text: this.t('common.cancel'),
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }

  private async completeSeedPurchase(item: ShopItem) {
    if (!this.player) return;

    if (item.currency === 'coins') {
      this.player.coins -= item.price;
    } else {
      this.player.gems -= item.price;
    }

    // Add premium seeds to inventory
    this.gameService.addPremiumSeeds(item.id, 5); // Pack of 5 seeds
    this.gameService.updatePlayer(this.player);

    const toast = await this.toastController.create({
      message: `${item.name} ${this.t('shop.packPurchased')}! 🌱`,
      duration: 3000,
      color: 'success',
      position: 'bottom',
      cssClass: 'toast-above-tabs'
    });
    toast.present();
  }

  canWatchAd(): boolean {
    if (this.player?.isPremium) return false; // Premium users don't see ads
    
    if (!this.lastAdWatchTime) return true;
    
    const now = new Date();
    const timeDiff = now.getTime() - this.lastAdWatchTime.getTime();
    const minutesPassed = timeDiff / (1000 * 60);
    
    return minutesPassed >= this.adCooldownMinutes;
  }

  getAdCooldownTime(): string {
    if (!this.lastAdWatchTime) return '';
    
    const now = new Date();
    const timeDiff = now.getTime() - this.lastAdWatchTime.getTime();
    const minutesPassed = timeDiff / (1000 * 60);
    const remainingMinutes = Math.max(0, this.adCooldownMinutes - minutesPassed);
    
    const minutes = Math.floor(remainingMinutes);
    const seconds = Math.floor((remainingMinutes - minutes) * 60);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  async watchAd() {
    if (!this.canWatchAd() || !this.player) return;

    // Simulate ad watch (in real app, this would integrate with AdMob, etc.)
    const alert = await this.alertController.create({
      header: this.t('shop.ads.watchTitle'),
      message: this.t('shop.ads.watchMessage'),
      buttons: [
        {
          text: this.t('shop.ads.skip'),
          handler: () => {
            this.giveAdReward();
          }
        }
      ]
    });

    await alert.present();
  }

  private async giveAdReward() {
    if (!this.player) return;

    // Random reward
    const rewards = [
      { type: 'coins', amount: 50 + Math.floor(Math.random() * 51) }, // 50-100 coins
      { type: 'gems', amount: 1 + Math.floor(Math.random() * 2) }, // 1-2 gems
    ];

    const reward = rewards[Math.floor(Math.random() * rewards.length)];

    if (reward.type === 'coins') {
      this.player.coins += reward.amount;
    } else {
      this.player.gems += reward.amount;
    }

    this.lastAdWatchTime = new Date();
    this.saveAdCooldown();

    const rewardType = reward.type === 'coins' ? this.t('common.coins') : this.t('common.gems');
    const toast = await this.toastController.create({
      message: `${this.t('shop.ads.reward')}: +${reward.amount} ${rewardType}! 🎁`,
      duration: 3000,
      color: 'tertiary',
      position: 'bottom',
      cssClass: 'toast-above-tabs'
    });
    toast.present();
  }

  private async loadAdCooldown() {
    try {
      // In real app, load from storage
      // For now, just simulate
      const savedTime = localStorage.getItem('lastAdWatch');
      if (savedTime) {
        this.lastAdWatchTime = new Date(savedTime);
      }
    } catch (error) {
      console.error('Error loading ad cooldown:', error);
    }
  }

  private async saveAdCooldown() {
    try {
      if (this.lastAdWatchTime) {
        localStorage.setItem('lastAdWatch', this.lastAdWatchTime.toISOString());
      }
    } catch (error) {
      console.error('Error saving ad cooldown:', error);
    }
  }
}
