import { Injectable } from '@angular/core';
import { AdMob, AdMobError, AdmobConsentStatus, AdmobConsentInfo, BannerAdOptions, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class AdMobService {
  private isInitialized = false;
  private isAdLoaded = false;

  constructor() {
    this.initialize();
  }

  async initialize(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      console.log('AdMob: Running in web mode, ads disabled');
      return;
    }

    try {
      await AdMob.initialize({
        testingDevices: [], // Entfernt für Production
        initializeForTesting: false // Production Modus
      });

      this.isInitialized = true;
      console.log('AdMob: Initialized successfully');

      // Lade Interstitial Ad vor
      await this.loadInterstitialAd();
    } catch (error) {
      console.error('AdMob: Initialization failed', error);
    }
  }

  async loadInterstitialAd(): Promise<void> {
    if (!this.isInitialized || !Capacitor.isNativePlatform()) {
      return;
    }

    try {
      const options = {
        adId: this.getInterstitialAdId(),
        isTesting: false // Production Modus
      };

      await AdMob.prepareInterstitial(options);
      this.isAdLoaded = true;
      console.log('AdMob: Interstitial ad loaded');
    } catch (error) {
      console.error('AdMob: Failed to load interstitial ad', error);
      this.isAdLoaded = false;
    }
  }

  async showInterstitialAd(): Promise<boolean> {
    if (!this.isInitialized || !this.isAdLoaded || !Capacitor.isNativePlatform()) {
      console.log('AdMob: Cannot show ad - not initialized, loaded, or not native platform');
      return false;
    }

    try {
      await AdMob.showInterstitial();
      console.log('AdMob: Interstitial ad shown');

      // Nach dem Anzeigen der Werbung, lade die nächste vor
      this.isAdLoaded = false;
      setTimeout(() => {
        this.loadInterstitialAd();
      }, 1000);

      return true;
    } catch (error) {
      console.error('AdMob: Failed to show interstitial ad', error);

      // Versuche die nächste Werbung zu laden, auch wenn diese fehlgeschlagen ist
      setTimeout(() => {
        this.loadInterstitialAd();
      }, 2000);

      return false;
    }
  }

  private getInterstitialAdId(): string {
    // Echte AdMob Ad IDs für Production
    if (Capacitor.getPlatform() === 'android') {
      return 'ca-app-pub-7398057979307491/9560101027'; // Android Interstitial Ad ID
    } else if (Capacitor.getPlatform() === 'ios') {
      return 'ca-app-pub-7398057979307491/9329054785'; // iOS Interstitial Ad ID
    }
    return '';
  }

  // Für Production: Ersetze die Test-Ad-IDs mit deinen echten AdMob Ad Unit IDs
  private getProductionInterstitialAdId(): string {
    if (Capacitor.getPlatform() === 'android') {
      return 'ca-app-pub-XXXXXXXXXXXXXXXXX/XXXXXXXXXX'; // Deine Android Interstitial Ad ID
    } else if (Capacitor.getPlatform() === 'ios') {
      return 'ca-app-pub-XXXXXXXXXXXXXXXXX/XXXXXXXXXX'; // Deine iOS Interstitial Ad ID
    }
    return '';
  }

  isAdReady(): boolean {
    return this.isInitialized && this.isAdLoaded && Capacitor.isNativePlatform();
  }
}