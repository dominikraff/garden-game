import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController, ToastController, ActionSheetController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { GameService } from '../services/game.service';
import { TranslationService } from '../services/translation.service';
import { Player, Garden, Plant, PlantType, DailyReward, BoostType } from '../models/game.model';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit, OnDestroy {
  player: Player | null = null;
  garden: Garden | null = null;
  dailyReward: DailyReward | null = null;
  private welcomeDialogShown = false;
  
  private subscriptions: Subscription[] = [];

  constructor(
    private gameService: GameService,
    private translationService: TranslationService,
    private alertController: AlertController,
    private toastController: ToastController,
    private actionSheetController: ActionSheetController
  ) {}

  ngOnInit() {
    let firstPlayerLoad = true;
    this.subscriptions.push(
      this.gameService.player$.subscribe(async player => {
        this.player = player;
        if (player) {
          this.dailyReward = this.gameService.getDailyReward();
          // Check if first start only on first load
          if (firstPlayerLoad) {
            firstPlayerLoad = false;
            await this.checkFirstStart();
          }
        }
      })
    );

    this.subscriptions.push(
      this.gameService.garden$.subscribe(garden => {
        this.garden = garden;
      })
    );
  }

  async checkFirstStart() {
    if (this.welcomeDialogShown) return;
    
    const hasName = await Preferences.get({ key: 'player_name' });
    if (!hasName.value && this.player) {
      this.welcomeDialogShown = true;
      this.showWelcomeDialog();
    }
  }

  async showWelcomeDialog() {
    const alert = await this.alertController.create({
      header: this.t('welcome.title'),
      message: this.t('welcome.message'),
      backdropDismiss: false,
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: this.t('welcome.namePlaceholder'),
          value: ''
        },
        {
          name: 'email',
          type: 'email',
          placeholder: this.t('welcome.emailPlaceholder')
        }
      ],
      buttons: [
        {
          text: this.t('welcome.start'),
          handler: async (data) => {
            if (!data.name || !data.name.trim()) {
              this.showToast(this.t('welcome.nameRequired'));
              // Don't call showWelcomeDialog again, just return false to keep dialog open
              return false;
            }
            
            if (this.player) {
              this.player.name = data.name.trim();
              this.gameService.updatePlayer(this.player);
              await Preferences.set({ key: 'player_name', value: data.name.trim() });
            }
            
            if (data.email && data.email.trim()) {
              await Preferences.set({ key: 'player_email', value: data.email.trim() });
            }
            
            this.showToast(this.t('welcome.welcomeMessage').replace('{name}', data.name.trim()));
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  t(key: string): string {
    return this.translationService.translate(key);
  }

  toggleLanguage() {
    const currentLang = this.translationService.getCurrentLanguage();
    const newLang = currentLang === 'de' ? 'en' : 'de';
    this.translationService.setLanguage(newLang);
  }

  getExperienceProgress(): number {
    if (!this.player) return 0;
    const needed = this.getExperienceNeeded();
    return this.player.experience / needed;
  }

  getExperienceNeeded(): number {
    return this.player ? this.player.level * 100 : 100;
  }

  getGardenSlots(): (Plant | null)[] {
    if (!this.garden) return [];
    
    const slots: (Plant | null)[] = [];
    const plants = this.garden.plants;
    
    for (let i = 0; i < this.garden.maxPlants; i++) {
      slots.push(plants[i] || null);
    }
    
    return slots;
  }

  getPlantIcon(type: PlantType, growth?: number): string {
    const growthStage = growth ? Math.floor(growth / 33.33) : 0; // 0, 1, 2, or 3 stages
    
    const stageIcons = {
      [PlantType.FLOWER]: [
        'leaf', // Sprout
        'flower', // Growing
        'flower', // Almost ready
        'rose' // Full bloom
      ],
      [PlantType.VEGETABLE]: [
        'leaf', // Sprout
        'leaf', // Growing
        'nutrition', // Almost ready
        'nutrition' // Ready
      ],
      [PlantType.FRUIT]: [
        'leaf', // Sprout
        'leaf', // Growing
        'leaf', // Almost ready
        'apple' // Fruit ready
      ],
      [PlantType.HERB]: [
        'leaf', // Sprout
        'leaf', // Growing
        'medical', // Almost ready
        'medical' // Ready
      ]
    };
    
    return stageIcons[type][Math.min(growthStage, 3)];
  }

  getPlantColor(type: PlantType): string {
    const colors = {
      [PlantType.FLOWER]: 'danger',
      [PlantType.VEGETABLE]: 'success',
      [PlantType.FRUIT]: 'warning',
      [PlantType.HERB]: 'tertiary'
    };
    return colors[type];
  }

  async handleSlotClick(slot: Plant | null, index: number) {
    if (slot) {
      if (slot.isReady) {
        await this.harvestPlant(slot.id);
      } else {
        await this.showPlantInfo(slot);
      }
    } else {
      await this.openSeedSelector();
    }
  }

  async harvestPlant(plantId: string) {
    const success = this.gameService.harvestPlant(plantId);
    if (success) {
      const toast = await this.toastController.create({
        message: this.t('garden.plantHarvested'),
        duration: 2000,
        color: 'success',
        position: 'bottom',
        cssClass: 'toast-above-tabs'
      });
      toast.present();
    }
  }

  async harvestAll() {
    if (!this.garden) return;
    
    const readyPlants = this.garden.plants.filter(p => p.isReady);
    let harvested = 0;
    
    for (const plant of readyPlants) {
      if (this.gameService.harvestPlant(plant.id)) {
        harvested++;
      }
    }
    
    if (harvested > 0) {
      const toast = await this.toastController.create({
        message: `${harvested} ${this.t('garden.plantsHarvested')}`,
        duration: 2000,
        color: 'success',
        position: 'bottom',
        cssClass: 'toast-above-tabs'
      });
      toast.present();
    }
  }

  hasReadyPlants(): boolean {
    return this.garden ? this.garden.plants.some(p => p.isReady) : false;
  }

  async openSeedSelector() {
    if (!this.garden || !this.player) return;
    
    if (this.garden.plants.length >= this.garden.maxPlants) {
      const toast = await this.toastController.create({
        message: this.t('garden.gardenFull'),
        duration: 2000,
        color: 'warning',
        position: 'bottom',
        cssClass: 'toast-above-tabs'
      });
      toast.present();
      return;
    }

    const buttons: any[] = [
      {
        text: this.t('plant.select.flower'),
        icon: 'flower-outline',
        handler: () => this.plantSeed(PlantType.FLOWER)
      },
      {
        text: this.t('plant.select.vegetable'),
        icon: 'nutrition-outline',
        handler: () => this.plantSeed(PlantType.VEGETABLE)
      },
      {
        text: this.t('plant.select.fruit'),
        icon: 'leaf-outline',
        handler: () => this.plantSeed(PlantType.FRUIT)
      },
      {
        text: this.t('plant.select.herb'),
        icon: 'medical-outline',
        handler: () => this.plantSeed(PlantType.HERB)
      }
    ];

    // Add premium seeds if available
    const rareFlowers = this.gameService.getPremiumSeeds('rare_flowers');
    const exoticFruits = this.gameService.getPremiumSeeds('exotic_fruits');
    const magicHerbs = this.gameService.getPremiumSeeds('magic_herbs');

    if (rareFlowers > 0) {
      buttons.push({
        text: `${this.t('shop.rare.flowers')} (${rareFlowers})`,
        icon: 'rose-outline',
        handler: () => this.plantPremiumSeed('rare_flowers')
      });
    }
    if (exoticFruits > 0) {
      buttons.push({
        text: `${this.t('shop.exotic.fruits')} (${exoticFruits})`,
        icon: 'leaf-outline',
        handler: () => this.plantPremiumSeed('exotic_fruits')
      });
    }
    if (magicHerbs > 0) {
      buttons.push({
        text: `${this.t('shop.magic.herbs')} (${magicHerbs})`,
        icon: 'medical-outline',
        handler: () => this.plantPremiumSeed('magic_herbs')
      });
    }

    buttons.push({
      text: this.t('plant.select.cancel'),
      icon: 'close',
      role: 'cancel'
    });

    const actionSheet = await this.actionSheetController.create({
      header: this.t('plant.select.header'),
      buttons
    });

    await actionSheet.present();
  }

  async plantPremiumSeed(seedType: string) {
    if (this.gameService.usePremiumSeed(seedType)) {
      // Plant a special premium plant type
      const premiumTypes: { [key: string]: PlantType } = {
        'rare_flowers': PlantType.FLOWER,
        'exotic_fruits': PlantType.FRUIT,
        'magic_herbs': PlantType.HERB
      };
      
      const success = this.gameService.plantSeed(premiumTypes[seedType]);
      
      if (success) {
        const toast = await this.toastController.create({
          message: `${this.t(`shop.${seedType.replace('_', '.')}`)} ${this.t('garden.seedPlanted')} ✨`,
          duration: 2000,
          color: 'success',
          position: 'bottom',
          cssClass: 'toast-above-tabs'
        });
        toast.present();
      }
    }
  }

  async plantSeed(plantType: PlantType) {
    const success = this.gameService.plantSeed(plantType);
    
    if (success) {
      const toast = await this.toastController.create({
        message: `${this.t(`plant.${plantType.toLowerCase()}`)} ${this.t('garden.seedPlanted')}`,
        duration: 2000,
        color: 'success',
        position: 'bottom',
        cssClass: 'toast-above-tabs'
      });
      toast.present();
    } else {
      const toast = await this.toastController.create({
        message: this.t('garden.notEnoughCoins'),
        duration: 2000,
        color: 'danger',
        position: 'bottom',
        cssClass: 'toast-above-tabs'
      });
      toast.present();
    }
  }

  async showPlantInfo(plant: Plant) {
    const plantNameKey = `plant.${plant.type.toLowerCase()}`;
    const plantName = this.t(plantNameKey);
    const statusText = plant.isReady ? this.t('garden.readyToHarvest') : this.t('garden.stillGrowing');
    
    // Format planted date and time
    const plantedDate = new Date(plant.plantedAt);
    const dateStr = plantedDate.toLocaleDateString();
    const timeStr = plantedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const plantedDateTime = `${dateStr} ${timeStr}`;
    
    const growthTime = this.getGrowthTimeRemaining(plant);
    
    // Get plant description based on type
    const plantDescriptions = {
      [PlantType.FLOWER]: this.t('plant.flowerDesc'),
      [PlantType.VEGETABLE]: this.t('plant.vegetableDesc'),
      [PlantType.FRUIT]: this.t('plant.fruitDesc'),
      [PlantType.HERB]: this.t('plant.herbDesc')
    };
    
    const description = plantDescriptions[plant.type];
    
    // Calculate harvest reward
    const harvestReward = this.getHarvestReward(plant);
    
    // Create a simple, formatted message without HTML
    const alertMessage = `
${description}

${this.t('garden.growth')}: ${plant.growth.toFixed(0)}%
${this.t('garden.status')}: ${statusText}
${this.t('garden.planted')}: ${plantedDateTime}
${this.t('garden.harvestReward')}: ${harvestReward.coins} ${this.t('common.coins')}, ${harvestReward.experience} XP
${!plant.isReady ? `${this.t('garden.timeRemaining')}: ${growthTime}` : ''}

${plant.isReady ? this.t('garden.tapToHarvest') : this.t('garden.keepGrowing')}`;
    
    const alert = await this.alertController.create({
      header: plantName,
      message: alertMessage,
      cssClass: 'custom-alert',
      buttons: [
        {
          text: this.t('common.ok'),
          role: 'cancel',
          cssClass: 'alert-button-full'
        }
      ]
    });

    await alert.present();
  }

  private getHarvestReward(plant: Plant) {
    const baseRewards = {
      [PlantType.FLOWER]: { coins: 20, experience: 5 },
      [PlantType.VEGETABLE]: { coins: 30, experience: 8 },
      [PlantType.FRUIT]: { coins: 50, experience: 12 },
      [PlantType.HERB]: { coins: 40, experience: 10 }
    };

    let reward = baseRewards[plant.type];
    
    // Apply coin multiplier boosts if any
    plant.boosts.forEach(boost => {
      if (boost.type === 'coin_multiplier') {
        reward.coins *= boost.multiplier;
      }
      if (boost.type === 'experience_multiplier') {
        reward.experience *= boost.multiplier;
      }
    });

    return {
      coins: Math.floor(reward.coins),
      experience: Math.floor(reward.experience)
    };
  }

  async showDailyReward() {
    if (!this.dailyReward) return;

    const alert = await this.alertController.create({
      header: 'Daily Reward! 🎁',
      message: `
        Day ${this.dailyReward.day} reward:<br>
        💰 ${this.dailyReward.coins} coins<br>
        ${this.dailyReward.gems ? `💎 ${this.dailyReward.gems} gems` : ''}
      `,
      buttons: [
        {
          text: 'Claim',
          handler: () => {
            if (this.gameService.claimDailyReward()) {
              this.dailyReward = null;
              this.presentClaimToast();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async presentClaimToast() {
    const toast = await this.toastController.create({
      message: 'Daily reward claimed! 🎉',
      duration: 2000,
      color: 'success',
      position: 'bottom',
      cssClass: 'toast-above-tabs'
    });
    toast.present();
  }

  getPlantTooltip(plant: Plant): string {
    const plantNameKey = `plant.${plant.type.toLowerCase()}`;
    const plantName = this.t(plantNameKey);
    
    if (plant.isReady) {
      return `${plantName} - ${this.t('garden.ready')} (${this.t('garden.clickToHarvest')})`;
    } else {
      const growthTime = this.getGrowthTimeRemaining(plant);
      return `${plantName} - ${plant.growth.toFixed(0)}% (${growthTime} ${this.t('garden.remaining')})`;
    }
  }

  getGrowthTimeRemaining(plant: Plant): string {
    const remainingGrowth = 100 - plant.growth;
    
    // Different base rates for different plant types (same as in game.service.ts)
    const baseRates = {
      [PlantType.FLOWER]: 0.167,    // ~10 minutes
      [PlantType.VEGETABLE]: 0.125, // ~13.3 minutes
      [PlantType.FRUIT]: 0.083,     // ~20 minutes
      [PlantType.HERB]: 0.100       // ~16.7 minutes
    };
    
    let growthRate = baseRates[plant.type] || 0.125;
    
    // Apply boost multipliers
    let totalMultiplier = 1;
    console.log('Plant boosts:', plant.boosts);
    plant.boosts.forEach(boost => {
      if (boost.type === BoostType.GROWTH_SPEED && boost.remainingTime > 0) {
        console.log('Applying boost multiplier:', boost.multiplier);
        totalMultiplier *= boost.multiplier;
      }
    });
    
    growthRate *= totalMultiplier;
    console.log('Final growth rate:', growthRate, 'Multiplier:', totalMultiplier);
    
    const secondsRemaining = Math.ceil(remainingGrowth / growthRate);
    
    if (secondsRemaining < 60) {
      return `${secondsRemaining}s`;
    } else if (secondsRemaining < 3600) {
      return `${Math.ceil(secondsRemaining / 60)}min`;
    } else {
      return `${Math.ceil(secondsRemaining / 3600)}h`;
    }
  }

  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      cssClass: 'toast-above-tabs'
    });
    toast.present();
  }
}
