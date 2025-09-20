import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Language = 'en' | 'de';

interface Translations {
  [key: string]: {
    en: string;
    de: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguageSubject = new BehaviorSubject<Language>('de');
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  private translations: Translations = {
    // Navigation
    'nav.garden': {
      en: 'Garden',
      de: 'Garten'
    },
    'nav.shop': {
      en: 'Shop',
      de: 'Shop'
    },
    'nav.leaderboard': {
      en: 'Leaderboard',
      de: 'Bestenliste'
    },
    'nav.settings': {
      en: 'Settings',
      de: 'Einstellungen'
    },

    // Welcome Dialog
    'welcome.title': {
      en: 'Welcome to BloomCraft!',
      de: 'Willkommen bei BloomCraft!'
    },
    'welcome.message': {
      en: 'Please enter your name and email to get started',
      de: 'Bitte gib deinen Namen und E-Mail ein, um zu beginnen'
    },
    'welcome.namePlaceholder': {
      en: 'Your Name',
      de: 'Dein Name'
    },
    'welcome.emailPlaceholder': {
      en: 'Your Email (optional)',
      de: 'Deine E-Mail (optional)'
    },
    'welcome.start': {
      en: 'Start Playing',
      de: 'Spiel starten'
    },
    'welcome.welcomeMessage': {
      en: 'Welcome {name}! Let\'s grow your garden!',
      de: 'Willkommen {name}! Lass uns deinen Garten wachsen lassen!'
    },
    'welcome.nameRequired': {
      en: 'Please enter your name to continue',
      de: 'Bitte gib deinen Namen ein, um fortzufahren'
    },

    // Garden Tab
    'garden.title': {
      en: 'My Garden',
      de: 'Mein Garten'
    },
    'garden.level': {
      en: 'Level',
      de: 'Level'
    },
    'garden.harvestAll': {
      en: 'Harvest All',
      de: 'Alles Ernten'
    },
    'garden.plantSeeds': {
      en: 'Plant Seeds',
      de: 'Samen Pflanzen'
    },
    'garden.plantSeed': {
      en: 'Plant Seed',
      de: 'Samen Pflanzen'
    },
    'garden.ready': {
      en: 'Ready!',
      de: 'Bereit!'
    },
    'garden.readyToHarvest': {
      en: 'Ready to harvest!',
      de: 'Bereit zum Ernten!'
    },
    'garden.stillGrowing': {
      en: 'Still growing',
      de: 'Wächst noch'
    },
    'garden.growth': {
      en: 'Growth',
      de: 'Wachstum'
    },
    'garden.status': {
      en: 'Status',
      de: 'Status'
    },
    'garden.planted': {
      en: 'Planted',
      de: 'Gepflanzt'
    },
    'garden.loading': {
      en: 'Loading your garden...',
      de: 'Lade deinen Garten...'
    },
    'garden.gardenFull': {
      en: 'Garden is full! Harvest some plants first.',
      de: 'Garten ist voll! Ernte zuerst einige Pflanzen.'
    },
    'garden.plantHarvested': {
      en: 'Plant harvested successfully! 🌱',
      de: 'Pflanze erfolgreich geerntet! 🌱'
    },
    'garden.plantsHarvested': {
      en: 'plants harvested! 🌾',
      de: 'Pflanzen geerntet! 🌾'
    },
    'garden.seedPlanted': {
      en: 'seed planted! 🌱',
      de: 'Samen gepflanzt! 🌱'
    },
    'garden.notEnoughCoins': {
      en: 'Not enough coins or garden is full!',
      de: 'Nicht genug Münzen oder Garten ist voll!'
    },
    'garden.stats.coinsTooltip': {
      en: 'Coins - Use to buy seeds and upgrades',
      de: 'Münzen - Zum Kauf von Samen und Upgrades'
    },
    'garden.stats.gemsTooltip': {
      en: 'Gems - Premium currency for special items',
      de: 'Edelsteine - Premium-Währung für besondere Gegenstände'
    },
    'garden.stats.levelTooltip': {
      en: 'Your current level - Higher levels unlock better plants',
      de: 'Dein aktuelles Level - Höhere Level schalten bessere Pflanzen frei'
    },
    'garden.stats.xpTooltip': {
      en: 'Experience Points (XP) - Gain experience by planting and harvesting to level up. Higher levels unlock better plants and garden features.',
      de: 'Erfahrungspunkte (XP) - Sammle Erfahrung durch Pflanzen und Ernten um aufzuleveln. Höhere Level schalten bessere Pflanzen und Garten-Features frei.'
    },
    'garden.clickToHarvest': {
      en: 'click to harvest',
      de: 'klicken zum ernten'
    },
    'garden.remaining': {
      en: 'remaining',
      de: 'verbleibend'
    },
    'garden.timeRemaining': {
      en: 'Time remaining',
      de: 'Verbleibende Zeit'
    },
    'garden.tapToHarvest': {
      en: 'Tap to harvest!',
      de: 'Tippe zum Ernten!'
    },
    'garden.keepGrowing': {
      en: 'Keep growing! Check back later.',
      de: 'Weiter wachsen lassen! Schaue später wieder vorbei.'
    },
    'garden.harvestReward': {
      en: 'Harvest reward',
      de: 'Erntebelohnung'
    },

    // Plant Types
    'plant.flower': {
      en: 'Flower',
      de: 'Blume'
    },
    'plant.vegetable': {
      en: 'Vegetable',
      de: 'Gemüse'
    },
    'plant.fruit': {
      en: 'Fruit',
      de: 'Frucht'
    },
    'plant.herb': {
      en: 'Herb',
      de: 'Kraut'
    },
    'plant.flowerDesc': {
      en: 'Beautiful flowers that bring joy and color to your garden',
      de: 'Wunderschöne Blumen, die Freude und Farbe in deinen Garten bringen'
    },
    'plant.vegetableDesc': {
      en: 'Fresh vegetables full of nutrients and flavor',
      de: 'Frisches Gemüse voller Nährstoffe und Geschmack'
    },
    'plant.fruitDesc': {
      en: 'Sweet fruits that grow slowly but yield more coins',
      de: 'Süße Früchte, die langsam wachsen, aber mehr Münzen bringen'
    },
    'plant.herbDesc': {
      en: 'Aromatic herbs with special properties',
      de: 'Aromatische Kräuter mit besonderen Eigenschaften'
    },

    // Plant Selection
    'plant.select.header': {
      en: 'Choose a seed to plant',
      de: 'Wähle einen Samen zum Pflanzen'
    },
    'plant.select.flower': {
      en: 'Flower (10 coins)',
      de: 'Blume (10 Münzen)'
    },
    'plant.select.vegetable': {
      en: 'Vegetable (15 coins)',
      de: 'Gemüse (15 Münzen)'
    },
    'plant.select.fruit': {
      en: 'Fruit (25 coins)',
      de: 'Frucht (25 Münzen)'
    },
    'plant.select.herb': {
      en: 'Herb (20 coins)',
      de: 'Kraut (20 Münzen)'
    },
    'plant.select.cancel': {
      en: 'Cancel',
      de: 'Abbrechen'
    },

    // Plant Info
    'plant.info.growth': {
      en: 'Growth',
      de: 'Wachstum'
    },
    'plant.info.status': {
      en: 'Status',
      de: 'Status'
    },
    'plant.info.readyHarvest': {
      en: 'Ready to harvest!',
      de: 'Bereit zur Ernte!'
    },
    'plant.info.stillGrowing': {
      en: 'Still growing...',
      de: 'Wächst noch...'
    },
    'plant.info.planted': {
      en: 'Planted',
      de: 'Gepflanzt'
    },

    // Daily Rewards
    'daily.reward.title': {
      en: 'Daily Reward! 🎁',
      de: 'Tägliche Belohnung! 🎁'
    },
    'daily.reward.day': {
      en: 'Day',
      de: 'Tag'
    },
    'daily.reward.claim': {
      en: 'Claim',
      de: 'Abholen'
    },
    'daily.reward.claimed': {
      en: 'Daily reward claimed! 🎉',
      de: 'Tägliche Belohnung abgeholt! 🎉'
    },
    'daily.coins': {
      en: 'coins',
      de: 'Münzen'
    },
    'daily.gems': {
      en: 'gems',
      de: 'Edelsteine'
    },

    // Shop Tab
    'shop.title': {
      en: 'Shop',
      de: 'Shop'
    },
    'shop.premium.title': {
      en: 'Premium Membership',
      de: 'Premium-Mitgliedschaft'
    },
    'shop.premium.benefits': {
      en: 'Unlock premium benefits:',
      de: 'Premium-Vorteile freischalten:'
    },
    'shop.premium.benefit1': {
      en: '24 hours offline progress (vs 8 hours)',
      de: '24 Stunden Offline-Fortschritt (statt 8 Stunden)'
    },
    'shop.premium.benefit2': {
      en: '2x daily rewards',
      de: '2x tägliche Belohnungen'
    },
    'shop.premium.benefit3': {
      en: 'Exclusive premium plants',
      de: 'Exklusive Premium-Pflanzen'
    },
    'shop.premium.benefit4': {
      en: 'No ads',
      de: 'Keine Werbung'
    },
    'shop.coins.tooltip': {
      en: 'Coins - Main currency to buy seeds and upgrades. Earn by harvesting plants.',
      de: 'Münzen - Hauptwährung für Samen und Upgrades. Verdiene sie durch Ernten.'
    },
    'shop.gems.tooltip': {
      en: 'Gems - Premium currency. Get them only through daily rewards and Premium benefits.',
      de: 'Edelsteine - Premium-Währung. Nur durch tägliche Belohnungen und Premium-Vorteile.'
    },
    'shop.premium.buyNow': {
      en: 'Buy Premium - $4.99',
      de: 'Premium kaufen - 4,99€'
    },
    'shop.premium.member': {
      en: 'Premium Member',
      de: 'Premium-Mitglied'
    },
    'shop.premium.purchaseTitle': {
      en: 'Purchase Premium',
      de: 'Premium kaufen'
    },
    'shop.premium.purchaseMessage': {
      en: 'Unlock premium membership for $4.99/month? Includes no ads, 2x rewards, and exclusive content!',
      de: 'Premium-Mitgliedschaft für 4,99€/Monat freischalten? Keine Werbung, 2x Belohnungen und exklusive Inhalte!'
    },
    'shop.premium.purchaseConfirm': {
      en: 'Purchase',
      de: 'Kaufen'
    },
    'shop.premium.activated': {
      en: 'Premium membership activated! Welcome to the VIP garden! 🌟',
      de: 'Premium-Mitgliedschaft aktiviert! Willkommen im VIP-Garten! 🌟'
    },
    'shop.premium.offline': {
      en: '24 hours offline progress (vs 8 hours)',
      de: '24 Stunden Offline-Fortschritt (statt 8 Stunden)'
    },
    'shop.premium.rewards': {
      en: '2x daily rewards',
      de: '2x tägliche Belohnungen'
    },
    'shop.premium.plants': {
      en: 'Exclusive premium plants',
      de: 'Exklusive Premium-Pflanzen'
    },
    'shop.premium.noAds': {
      en: 'No ads',
      de: 'Keine Werbung'
    },
    'shop.buy.pack': {
      en: 'Buy Pack (x5)',
      de: 'Pack kaufen (x5)'
    },
    'shop.loading': {
      en: 'Loading shop...',
      de: 'Lade Shop...'
    },
    'shop.premium.buy': {
      en: 'Buy Premium - 50 Gems',
      de: 'Premium Kaufen - 50 Edelsteine'
    },
    'shop.premium.active': {
      en: 'Active',
      de: 'Aktiv'
    },
    'shop.premium.notEnough': {
      en: 'Not enough gems! Watch ads or purchase gems.',
      de: 'Nicht genug Edelsteine! Schaue Werbung oder kaufe Edelsteine.'
    },

    // Shop Sections
    'shop.boosts.title': {
      en: 'Boosts & Accelerators',
      de: 'Boosts & Beschleuniger'
    },
    'shop.seeds.title': {
      en: 'Premium Seeds',
      de: 'Premium-Samen'
    },
    'shop.upgrades.title': {
      en: 'Garden Upgrades',
      de: 'Garten-Upgrades'
    },
    'shop.ads.title': {
      en: 'Free Rewards',
      de: 'Kostenlose Belohnungen'
    },

    // Shop Items
    'shop.growth.boost': {
      en: 'Growth Boost',
      de: 'Wachstums-Boost'
    },
    'shop.growth.desc': {
      en: '5x growth speed for 30 minutes',
      de: '5x Wachstumsgeschwindigkeit für 30 Minuten'
    },
    'shop.coin.multiplier': {
      en: 'Coin Multiplier',
      de: 'Münz-Multiplikator'
    },
    'shop.coin.desc': {
      en: '2x coins from harvest for 30 min',
      de: '2x Münzen von Ernte für 30 Min'
    },
    'shop.mega.boost': {
      en: 'Mega Boost',
      de: 'Mega-Boost'
    },
    'shop.mega.desc': {
      en: '10x growth speed + 5x coins for 15 minutes!',
      de: '10x Wachstum + 5x Münzen für 15 Minuten!'
    },
    'shop.exp.boost': {
      en: 'XP Boost',
      de: 'XP-Boost'
    },
    'shop.exp.desc': {
      en: '3x experience for 2 hours',
      de: '3x Erfahrung für 2 Stunden'
    },

    // Premium Seeds
    'shop.rare.flowers': {
      en: 'Rare Flowers',
      de: 'Seltene Blumen'
    },
    'shop.rare.desc': {
      en: 'High-value decorative plants',
      de: 'Wertvolle Zierpflanzen'
    },
    'shop.exotic.fruits': {
      en: 'Exotic Fruits',
      de: 'Exotische Früchte'
    },
    'shop.exotic.desc': {
      en: 'Premium fruits with bonus rewards',
      de: 'Premium-Früchte mit Bonusbelohnungen'
    },
    'shop.magic.herbs': {
      en: 'Magic Herbs',
      de: 'Magische Kräuter'
    },
    'shop.magic.desc': {
      en: 'Special herbs that grant random boosts',
      de: 'Spezielle Kräuter mit zufälligen Boosts'
    },

    // Shop Actions
    'shop.buy.now': {
      en: 'Buy Now',
      de: 'Jetzt Kaufen'
    },
    'shop.insufficient': {
      en: 'Insufficient funds!',
      de: 'Unzureichende Mittel!'
    },
    'shop.activated': {
      en: 'activated! 🚀',
      de: 'aktiviert! 🚀'
    },
    'shop.purchased': {
      en: 'pack purchased! Check your inventory. 🌱',
      de: 'Paket gekauft! Prüfe dein Inventar. 🌱'
    },

    // Ads
    'shop.ads.desc': {
      en: 'Watch an ad to get free rewards!',
      de: 'Schaue Werbung für kostenlose Belohnungen!'
    },
    'shop.ads.coins': {
      en: '50-100 Coins',
      de: '50-100 Münzen'
    },
    'shop.ads.boost': {
      en: 'Random Boost',
      de: 'Zufälliger Boost'
    },
    'shop.ads.watch': {
      en: 'Watch Ad',
      de: 'Werbung Schauen'
    },
    'shop.ads.next': {
      en: 'Next ad in',
      de: 'Nächste Werbung in'
    },
    'shop.ads.modal.title': {
      en: 'Watch Ad',
      de: 'Werbung Schauen'
    },
    'shop.ads.simulating': {
      en: 'Simulating ad playback...\n(In production, this would show a real ad)',
      de: 'Simuliere Werbung...\n(In der Produktion würde hier echte Werbung gezeigt)'
    },
    'shop.ads.skip': {
      en: 'Skip (for demo)',
      de: 'Überspringen (für Demo)'
    },
    'shop.ads.reward': {
      en: 'Ad reward',
      de: 'Werbebelohnung'
    },
    'shop.insufficientFunds': {
      en: 'Insufficient funds!',
      de: 'Nicht genügend Guthaben!'
    },
    'shop.packPurchased': {
      en: 'pack purchased! Check your inventory',
      de: 'Paket gekauft! Prüfe dein Inventar'
    },
    'shop.rare.flowersDesc': {
      en: 'High-value decorative plants',
      de: 'Hochwertige Zierpflanzen'
    },
    'shop.exotic.fruitsDesc': {
      en: 'Premium fruits with bonus rewards',
      de: 'Premium-Früchte mit Bonus-Belohnungen'
    },
    'shop.magic.herbsDesc': {
      en: 'Special herbs that grant random boosts',
      de: 'Spezielle Kräuter mit zufälligen Boosts'
    },
    'shop.extra.field': {
      en: 'Extra Garden Field',
      de: 'Zusätzliches Gartenfeld'
    },
    'shop.extra.fieldDesc': {
      en: 'Add one more planting slot to your garden',
      de: 'Füge einen weiteren Pflanzplatz zu deinem Garten hinzu'
    },
    'shop.boostOnCooldown': {
      en: 'This boost is on cooldown. Please wait before purchasing again.',
      de: 'Dieser Boost hat eine Abklingzeit. Bitte warte vor dem nächsten Kauf.'
    },
    'shop.confirmPurchase': {
      en: 'Confirm Purchase',
      de: 'Kauf bestätigen'
    },
    'shop.confirmMessage': {
      en: 'Do you want to buy',
      de: 'Möchtest du kaufen'
    },
    'shop.for': {
      en: 'for',
      de: 'für'
    },

    // Leaderboard Tab
    'leaderboard.title': {
      en: 'Leaderboard',
      de: 'Bestenliste'
    },
    'leaderboard.rank': {
      en: 'Rank #',
      de: 'Rang #'
    },
    'leaderboard.points': {
      en: 'points',
      de: 'Punkte'
    },
    'leaderboard.days': {
      en: 'days',
      de: 'Tage'
    },
    'leaderboard.level.title': {
      en: 'Level',
      de: 'Level'
    },
    'leaderboard.wealth.title': {
      en: 'Wealth',
      de: 'Reichtum'
    },
    'leaderboard.daily.title': {
      en: 'Daily Streak',
      de: 'Tägliche Serie'
    },
    'leaderboard.loading': {
      en: 'Loading leaderboard...',
      de: 'Lade Bestenliste...'
    },

    // Leaderboard Categories
    'leaderboard.category.level': {
      en: 'Top Players by Level',
      de: 'Top-Spieler nach Level'
    },
    'leaderboard.category.coins': {
      en: 'Richest Gardeners',
      de: 'Reichste Gärtner'
    },
    'leaderboard.category.daily': {
      en: 'Daily Streak',
      de: 'Tagesserie'
    },
    'leaderboard.category.wealth': {
      en: 'Wealth',
      de: 'Reichtum'
    },
    'leaderboard.category.dailyDesc': {
      en: 'Consecutive login days - How many days in a row you have played',
      de: 'Aufeinanderfolgende Login-Tage - Wie viele Tage hintereinander du gespielt hast'
    },
    'leaderboard.category.levelDesc': {
      en: 'Your garden level - Increase by gaining experience points',
      de: 'Dein Garten-Level - Steigt durch das Sammeln von Erfahrungspunkten'
    },
    'leaderboard.category.wealthDesc': {
      en: 'Total score - Based on level, coins, and achievements',
      de: 'Gesamtpunktzahl - Basiert auf Level, Münzen und Erfolgen'
    },
    'leaderboard.empty': {
      en: 'No players on the leaderboard yet!',
      de: 'Noch keine Spieler in der Bestenliste!'
    },
    'leaderboard.empty.sub': {
      en: 'Be the first to climb the rankings!',
      de: 'Sei der Erste, der die Rankings erklimmt!'
    },
    'leaderboard.emptySubtext': {
      en: 'Be the first to climb the rankings!',
      de: 'Sei der Erste, der die Rangliste erklimmt!'
    },
    'leaderboard.level': {
      en: 'Level',
      de: 'Level'
    },
    'leaderboard.achievements': {
      en: 'Your Achievements',
      de: 'Deine Erfolge'
    },
    'leaderboard.unlocked': {
      en: 'Unlocked',
      de: 'Freigeschaltet'
    },
    'leaderboard.online': {
      en: 'Online',
      de: 'Online'
    },

    // Achievements
    'achievements.title': {
      en: 'Your Achievements',
      de: 'Deine Erfolge'
    },
    
    // Achievement Names and Descriptions
    'achievements.firstSteps.name': {
      en: 'First Steps',
      de: 'Erste Schritte'
    },
    'achievements.firstSteps.desc': {
      en: 'Start your garden journey',
      de: 'Beginne deine Gartenreise'
    },
    'achievements.firstHarvest.name': {
      en: 'First Harvest',
      de: 'Erste Ernte'
    },
    'achievements.firstHarvest.desc': {
      en: 'Harvest your first plant',
      de: 'Ernte deine erste Pflanze'
    },
    'achievements.level5.name': {
      en: 'Growing Strong',
      de: 'Starkes Wachstum'
    },
    'achievements.level5.desc': {
      en: 'Reach level 5',
      de: 'Erreiche Level 5'
    },
    'achievements.level10.name': {
      en: 'Experienced Gardener',
      de: 'Erfahrener Gärtner'
    },
    'achievements.level10.desc': {
      en: 'Reach level 10',
      de: 'Erreiche Level 10'
    },
    'achievements.level25.name': {
      en: 'Master Gardener',
      de: 'Meistergärtner'
    },
    'achievements.level25.desc': {
      en: 'Reach level 25',
      de: 'Erreiche Level 25'
    },
    'achievements.level50.name': {
      en: 'Legendary Gardener',
      de: 'Legendärer Gärtner'
    },
    'achievements.level50.desc': {
      en: 'Reach level 50',
      de: 'Erreiche Level 50'
    },
    'achievements.level100.name': {
      en: 'Garden God',
      de: 'Gartengott'
    },
    'achievements.level100.desc': {
      en: 'Reach level 100',
      de: 'Erreiche Level 100'
    },
    'achievements.coins100.name': {
      en: 'Penny Saver',
      de: 'Sparschwein'
    },
    'achievements.coins100.desc': {
      en: 'Save 100 coins',
      de: 'Spare 100 Münzen'
    },
    'achievements.coins1000.name': {
      en: 'Wealthy Gardener',
      de: 'Wohlhabender Gärtner'
    },
    'achievements.coins1000.desc': {
      en: 'Accumulate 1,000 coins',
      de: 'Sammle 1.000 Münzen'
    },
    'achievements.coins10000.name': {
      en: 'Rich Farmer',
      de: 'Reicher Bauer'
    },
    'achievements.coins10000.desc': {
      en: 'Accumulate 10,000 coins',
      de: 'Sammle 10.000 Münzen'
    },
    'achievements.coins100000.name': {
      en: 'Millionaire',
      de: 'Millionär'
    },
    'achievements.coins100000.desc': {
      en: 'Accumulate 100,000 coins',
      de: 'Sammle 100.000 Münzen'
    },
    'achievements.gems10.name': {
      en: 'Gem Finder',
      de: 'Edelsteinfinder'
    },
    'achievements.gems10.desc': {
      en: 'Collect 10 gems',
      de: 'Sammle 10 Diamanten'
    },
    'achievements.gems50.name': {
      en: 'Gem Collector',
      de: 'Edelsteinsammler'
    },
    'achievements.gems50.desc': {
      en: 'Collect 50 gems',
      de: 'Sammle 50 Diamanten'
    },
    'achievements.gems100.name': {
      en: 'Gem Master',
      de: 'Edelsteinmeister'
    },
    'achievements.gems100.desc': {
      en: 'Collect 100 gems',
      de: 'Sammle 100 Diamanten'
    },
    'achievements.gems500.name': {
      en: 'Diamond King',
      de: 'Diamantenkönig'
    },
    'achievements.gems500.desc': {
      en: 'Collect 500 gems',
      de: 'Sammle 500 Diamanten'
    },
    'achievements.streak3.name': {
      en: 'Weekend Warrior',
      de: 'Wochenendkrieger'
    },
    'achievements.streak3.desc': {
      en: '3 day login streak',
      de: '3 Tage hintereinander eingeloggt'
    },
    'achievements.streak7.name': {
      en: 'Dedicated Farmer',
      de: 'Engagierter Bauer'
    },
    'achievements.streak7.desc': {
      en: '7 day login streak',
      de: '7 Tage hintereinander eingeloggt'
    },
    'achievements.streak14.name': {
      en: 'Loyal Gardener',
      de: 'Treuer Gärtner'
    },
    'achievements.streak14.desc': {
      en: '14 day login streak',
      de: '14 Tage hintereinander eingeloggt'
    },
    'achievements.streak30.name': {
      en: 'Monthly Champion',
      de: 'Monatschampion'
    },
    'achievements.streak30.desc': {
      en: '30 day login streak',
      de: '30 Tage hintereinander eingeloggt'
    },
    'achievements.streak100.name': {
      en: 'Century Player',
      de: 'Jahrhundert-Spieler'
    },
    'achievements.streak100.desc': {
      en: '100 day login streak',
      de: '100 Tage hintereinander eingeloggt'
    },
    'achievements.streak365.name': {
      en: 'Year-Round Gardener',
      de: 'Ganzjahresgärtner'
    },
    'achievements.streak365.desc': {
      en: '365 day login streak',
      de: '365 Tage hintereinander eingeloggt'
    },
    'achievements.premium.name': {
      en: 'VIP Gardener',
      de: 'VIP Gärtner'
    },
    'achievements.premium.desc': {
      en: 'Purchase premium membership',
      de: 'Premium-Mitgliedschaft erwerben'
    },
    'achievements.nightOwl.name': {
      en: 'Night Owl',
      de: 'Nachteule'
    },
    'achievements.nightOwl.desc': {
      en: 'Play between midnight and 4 AM',
      de: 'Spiele zwischen Mitternacht und 4 Uhr morgens'
    },
    'achievements.earlyBird.name': {
      en: 'Early Bird',
      de: 'Frühaufsteher'
    },
    'achievements.earlyBird.desc': {
      en: 'Play between 5 AM and 7 AM',
      de: 'Spiele zwischen 5 und 7 Uhr morgens'
    },
    'achievements.top10.name': {
      en: 'Top 10 Player',
      de: 'Top 10 Spieler'
    },
    'achievements.top10.desc': {
      en: 'Reach top 10 in leaderboard',
      de: 'Erreiche die Top 10 der Bestenliste'
    },
    'achievements.top3.name': {
      en: 'Podium Finish',
      de: 'Podiumsplatz'
    },
    'achievements.top3.desc': {
      en: 'Reach top 3 in leaderboard',
      de: 'Erreiche die Top 3 der Bestenliste'
    },
    'achievements.first.name': {
      en: 'Champion',
      de: 'Champion'
    },
    'achievements.first.desc': {
      en: 'Become #1 in leaderboard',
      de: 'Werde Nummer 1 der Bestenliste'
    },
    'achievements.plants100.name': {
      en: 'Green Thumb',
      de: 'Grüner Daumen'
    },
    'achievements.plants100.desc': {
      en: 'Plant 100 seeds',
      de: 'Pflanze 100 Samen'
    },
    'achievements.plants1000.name': {
      en: 'Master Planter',
      de: 'Meisterpflanzer'
    },
    'achievements.plants1000.desc': {
      en: 'Plant 1000 seeds',
      de: 'Pflanze 1000 Samen'
    },
    'achievements.harvest100.name': {
      en: 'Harvest Moon',
      de: 'Erntemond'
    },
    'achievements.harvest100.desc': {
      en: 'Harvest 100 plants',
      de: 'Ernte 100 Pflanzen'
    },
    'achievements.harvest1000.name': {
      en: 'Harvest King',
      de: 'Erntekönig'
    },
    'achievements.harvest1000.desc': {
      en: 'Harvest 1000 plants',
      de: 'Ernte 1000 Pflanzen'
    },
    'achievements.allPlantTypes.name': {
      en: 'Variety Master',
      de: 'Vielfaltmeister'
    },
    'achievements.allPlantTypes.desc': {
      en: 'Plant all types of seeds',
      de: 'Pflanze alle Samenarten'
    },
    'achievements.speedGrower.name': {
      en: 'Speed Grower',
      de: 'Schnellzüchter'
    },
    'achievements.speedGrower.desc': {
      en: 'Use 10 growth boosts',
      de: 'Verwende 10 Wachstums-Boosts'
    },
    'achievements.shopaholic.name': {
      en: 'Shopaholic',
      de: 'Kaufrausch'
    },
    'achievements.shopaholic.desc': {
      en: 'Buy 50 items from shop',
      de: 'Kaufe 50 Artikel im Shop'
    },
    'achievements.unlocked': {
      en: 'Unlocked',
      de: 'Freigeschaltet'
    },
    'achievements.green.thumb': {
      en: 'Green Thumb',
      de: 'Grüner Daumen'
    },
    'achievements.green.desc': {
      en: 'Plant your first seed',
      de: 'Pflanze deinen ersten Samen'
    },
    'achievements.growing.strong': {
      en: 'Growing Strong',
      de: 'Stark Wachsend'
    },
    'achievements.growing.desc': {
      en: 'Reach level 5',
      de: 'Erreiche Level 5'
    },
    'achievements.wealthy': {
      en: 'Wealthy Gardener',
      de: 'Reicher Gärtner'
    },
    'achievements.wealthy.desc': {
      en: 'Accumulate 1000 coins',
      de: 'Sammle 1000 Münzen'
    },
    'achievements.gem.collector': {
      en: 'Gem Collector',
      de: 'Edelstein-Sammler'
    },
    'achievements.gem.desc': {
      en: 'Collect 50 gems',
      de: 'Sammle 50 Edelsteine'
    },
    'achievements.loyal': {
      en: 'Loyal Gardener',
      de: 'Treuer Gärtner'
    },
    'achievements.loyal.desc': {
      en: 'Login for 7 consecutive days',
      de: 'Logge dich 7 Tage hintereinander ein'
    },
    'achievements.vip': {
      en: 'VIP Gardener',
      de: 'VIP-Gärtner'
    },
    'achievements.vip.desc': {
      en: 'Purchase premium membership',
      de: 'Kaufe Premium-Mitgliedschaft'
    },

    // Settings
    'settings.title': {
      en: 'Settings',
      de: 'Einstellungen'
    },
    'settings.profile.title': {
      en: 'Profile',
      de: 'Profil'
    },
    'settings.profile.name': {
      en: 'Name',
      de: 'Name'
    },
    'settings.profile.namePlaceholder': {
      en: 'Your Name',
      de: 'Dein Name'
    },
    'settings.profile.email': {
      en: 'Email',
      de: 'E-Mail'
    },
    'settings.profile.emailPlaceholder': {
      en: 'Your Email (optional)',
      de: 'Deine E-Mail (optional)'
    },
    'settings.language.title': {
      en: 'Language',
      de: 'Sprache'
    },
    'settings.language.germanDesc': {
      en: 'German language',
      de: 'Deutsche Sprache'
    },
    'settings.language.englishDesc': {
      en: 'English language',
      de: 'Englische Sprache'
    },
    'settings.language.changed': {
      en: 'Language changed',
      de: 'Sprache geändert'
    },
    'settings.game.title': {
      en: 'Game Settings',
      de: 'Spieleinstellungen'
    },
    'settings.game.notifications': {
      en: 'Notifications',
      de: 'Benachrichtigungen'
    },
    'settings.game.sound': {
      en: 'Sound Effects',
      de: 'Soundeffekte'
    },
    'settings.game.vibration': {
      en: 'Vibration',
      de: 'Vibration'
    },
    'settings.notifications.enabled': {
      en: 'Notifications enabled',
      de: 'Benachrichtigungen aktiviert'
    },
    'settings.notifications.disabled': {
      en: 'Notifications disabled',
      de: 'Benachrichtigungen deaktiviert'
    },
    'settings.data.title': {
      en: 'Data Management',
      de: 'Datenverwaltung'
    },
    'settings.data.export': {
      en: 'Export Data',
      de: 'Daten exportieren'
    },
    'settings.data.import': {
      en: 'Import Data',
      de: 'Daten importieren'
    },
    'settings.data.reset': {
      en: 'Reset Game',
      de: 'Spiel zurücksetzen'
    },
    'settings.data.resetTitle': {
      en: 'Reset Game?',
      de: 'Spiel zurücksetzen?'
    },
    'settings.data.resetMessage': {
      en: 'This will delete all your progress. This action cannot be undone!',
      de: 'Dies wird deinen gesamten Fortschritt löschen. Diese Aktion kann nicht rückgängig gemacht werden!'
    },
    'settings.data.resetConfirm': {
      en: 'Reset',
      de: 'Zurücksetzen'
    },
    'settings.data.resetSuccess': {
      en: 'Game reset successfully',
      de: 'Spiel erfolgreich zurückgesetzt'
    },
    'settings.data.exportSuccess': {
      en: 'Data exported successfully',
      de: 'Daten erfolgreich exportiert'
    },
    'settings.data.exportError': {
      en: 'Export failed',
      de: 'Export fehlgeschlagen'
    },
    'settings.data.importSuccess': {
      en: 'Data imported successfully',
      de: 'Daten erfolgreich importiert'
    },
    'settings.data.importError': {
      en: 'Import failed',
      de: 'Import fehlgeschlagen'
    },
    'settings.about.title': {
      en: 'About',
      de: 'Über'
    },
    'settings.about.version': {
      en: 'Version',
      de: 'Version'
    },
    'settings.about.developer': {
      en: 'Developer',
      de: 'Entwickler'
    },
    'settings.about.contact': {
      en: 'Contact',
      de: 'Kontakt'
    },
    'settings.howToPlay.title': {
      en: 'How to Play',
      de: 'Spielanleitung'
    },
    'settings.howToPlay.basics': {
      en: 'Game Basics',
      de: 'Spiel-Grundlagen'
    },
    'settings.howToPlay.basicsDesc': {
      en: 'Plant seeds in your garden, wait for them to grow, and harvest them for coins and experience. Login daily to get bonus rewards and build your streak!',
      de: 'Pflanze Samen in deinen Garten, warte bis sie wachsen und ernte sie für Münzen und Erfahrung. Logge dich täglich ein für Bonus-Belohnungen und baue deine Serie auf!'
    },
    'settings.howToPlay.currency': {
      en: 'Currency System',
      de: 'Währungssystem'
    },
    'settings.howToPlay.currencyDesc': {
      en: 'Coins are the main currency - earn them by harvesting plants. Gems are premium currency obtained through daily rewards and Premium membership.',
      de: 'Münzen sind die Hauptwährung - verdiene sie durch das Ernten von Pflanzen. Edelsteine sind Premium-Währung, die du durch tägliche Belohnungen und Premium-Mitgliedschaft erhältst.'
    },
    'settings.howToPlay.leaderboard': {
      en: 'Leaderboard & Competition',
      de: 'Bestenliste & Wettbewerb'
    },
    'settings.howToPlay.leaderboardDesc': {
      en: 'Compete with other players on the leaderboard! Rankings are based on your level, total score, and daily login streaks. Currently only your own progress is stored locally.',
      de: 'Messe dich mit anderen Spielern in der Bestenliste! Ranglisten basieren auf deinem Level, der Gesamtpunktzahl und täglichen Login-Serien. Aktuell wird nur dein eigener Fortschritt lokal gespeichert.'
    },
    'settings.howToPlay.premium': {
      en: 'Premium Benefits',
      de: 'Premium-Vorteile'
    },
    'settings.howToPlay.premiumDesc': {
      en: 'Premium membership gives you 24h offline progress (vs 8h), 2x daily rewards, exclusive plants, and removes ads. Available for 4,99€/month.',
      de: 'Die Premium-Mitgliedschaft bietet 24h Offline-Fortschritt (statt 8h), 2x tägliche Belohnungen, exklusive Pflanzen und entfernt Werbung. Verfügbar für 4,99€/Monat.'
    },

    // Common
    'common.ok': {
      en: 'OK',
      de: 'OK'
    },
    'common.coins': {
      en: 'coins',
      de: 'Münzen'
    },
    'common.gems': {
      en: 'gems',
      de: 'Diamanten'
    },
    'common.cancel': {
      en: 'Cancel',
      de: 'Abbrechen'
    },
    'common.confirm': {
      en: 'Confirm',
      de: 'Bestätigen'
    },
    'common.purchase': {
      en: 'Purchase',
      de: 'Kaufen'
    },
    'common.loading': {
      en: 'Loading...',
      de: 'Lädt...'
    },
    'common.days': {
      en: 'days',
      de: 'Tage'
    }
  };

  constructor() {
    // Load saved language or detect browser language
    const savedLang = localStorage.getItem('game-language') as Language;
    const browserLang = navigator.language.startsWith('de') ? 'de' : 'en';
    const initialLang = savedLang || browserLang;
    
    this.setLanguage(initialLang);
  }

  setLanguage(lang: Language) {
    this.currentLanguageSubject.next(lang);
    localStorage.setItem('game-language', lang);
  }

  getCurrentLanguage(): Language {
    return this.currentLanguageSubject.value;
  }

  translate(key: string): string {
    const translation = this.translations[key];
    if (!translation) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    
    const currentLang = this.getCurrentLanguage();
    return translation[currentLang] || translation['en'] || key;
  }

  // Short alias for easier use in templates
  t(key: string): string {
    return this.translate(key);
  }
}