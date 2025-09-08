import { Component, OnInit } from '@angular/core';
import { TranslationService, Language } from '../services/translation.service';
import { GameService } from '../services/game.service';
import { AlertController, ToastController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { Player } from '../models/game.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: false
})
export class SettingsPage implements OnInit {
  selectedLanguage: Language = 'de';
  playerName: string = '';
  playerEmail: string = '';
  notificationsEnabled: boolean = true;
  soundEnabled: boolean = true;
  vibrationEnabled: boolean = false;
  private player: Player | null = null;

  constructor(
    private translationService: TranslationService,
    private gameService: GameService,
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.loadSettings();
  }

  async loadSettings() {
    // Load current language
    this.selectedLanguage = this.translationService.getCurrentLanguage();
    
    // Load player data
    this.gameService.player$.subscribe(player => {
      if (player) {
        this.player = player;
        this.playerName = player.name;
      }
    });

    // Load email from storage
    const email = await Preferences.get({ key: 'player_email' });
    if (email.value) {
      this.playerEmail = email.value;
    }

    // Load game settings
    const notifications = await Preferences.get({ key: 'notifications_enabled' });
    this.notificationsEnabled = notifications.value !== 'false';

    const sound = await Preferences.get({ key: 'sound_enabled' });
    this.soundEnabled = sound.value !== 'false';

    const vibration = await Preferences.get({ key: 'vibration_enabled' });
    this.vibrationEnabled = vibration.value === 'true';
  }

  t(key: string): string {
    return this.translationService.translate(key);
  }

  changeLanguage(event: any) {
    const lang = event.detail.value as Language;
    this.translationService.setLanguage(lang);
    
    this.showToast(this.t('settings.language.changed'));
  }

  setLanguage(lang: Language) {
    this.selectedLanguage = lang;
    this.translationService.setLanguage(lang);
    this.showToast(this.t('settings.language.changed'));
  }

  async updatePlayerName() {
    if (this.player && this.playerName.trim()) {
      this.player.name = this.playerName.trim();
      this.gameService.updatePlayer(this.player);
      await Preferences.set({ key: 'player_name', value: this.playerName });
    }
  }

  async updatePlayerEmail() {
    if (this.playerEmail.trim()) {
      await Preferences.set({ key: 'player_email', value: this.playerEmail });
    }
  }

  async toggleNotifications() {
    await Preferences.set({ 
      key: 'notifications_enabled', 
      value: this.notificationsEnabled.toString() 
    });
    
    if (this.notificationsEnabled) {
      // Request notification permissions here
      this.showToast(this.t('settings.notifications.enabled'));
    } else {
      this.showToast(this.t('settings.notifications.disabled'));
    }
  }

  async toggleSound() {
    await Preferences.set({ 
      key: 'sound_enabled', 
      value: this.soundEnabled.toString() 
    });
  }

  async toggleVibration() {
    await Preferences.set({ 
      key: 'vibration_enabled', 
      value: this.vibrationEnabled.toString() 
    });
    
    if (this.vibrationEnabled && 'vibrate' in navigator) {
      navigator.vibrate(100);
    }
  }

  async exportData() {
    try {
      const playerData = await Preferences.get({ key: 'player_data' });
      const gardenData = await Preferences.get({ key: 'garden_data' });
      const leaderboardData = await Preferences.get({ key: 'leaderboard_data' });
      
      const exportData = {
        player: playerData.value ? JSON.parse(playerData.value) : null,
        garden: gardenData.value ? JSON.parse(gardenData.value) : null,
        leaderboard: leaderboardData.value ? JSON.parse(leaderboardData.value) : null,
        email: this.playerEmail,
        exportDate: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      // Create download link
      const url = window.URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `garden-game-backup-${Date.now()}.json`;
      link.click();
      
      this.showToast(this.t('settings.data.exportSuccess'));
    } catch (error) {
      this.showToast(this.t('settings.data.exportError'));
    }
  }

  async importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        
        if (data.player) {
          await Preferences.set({ 
            key: 'player_data', 
            value: JSON.stringify(data.player) 
          });
        }
        
        if (data.garden) {
          await Preferences.set({ 
            key: 'garden_data', 
            value: JSON.stringify(data.garden) 
          });
        }
        
        if (data.email) {
          this.playerEmail = data.email;
          await this.updatePlayerEmail();
        }
        
        this.showToast(this.t('settings.data.importSuccess'));
        
        // Reload the game
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {
        this.showToast(this.t('settings.data.importError'));
      }
    };
    
    input.click();
  }

  async resetGame() {
    const alert = await this.alertController.create({
      header: this.t('settings.data.resetTitle'),
      message: this.t('settings.data.resetMessage'),
      buttons: [
        {
          text: this.t('common.cancel'),
          role: 'cancel'
        },
        {
          text: this.t('settings.data.resetConfirm'),
          role: 'destructive',
          handler: async () => {
            await Preferences.clear();
            this.showToast(this.t('settings.data.resetSuccess'));
            
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          }
        }
      ]
    });

    await alert.present();
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
