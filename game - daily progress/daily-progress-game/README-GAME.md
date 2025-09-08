# Daily Progress Garden Game 🌱

Ein mobiles Spiel entwickelt mit Ionic und Capacitor für tägliches Engagement und Monetarisierung.

## Features

✅ **Core Game Mechanics**
- Garten-basiertes tägliches Fortschrittsspiel
- Pflanzen-System mit Wachstum und Ernte
- Münzen und Edelsteine als Währungen
- Level-System mit Erfahrungspunkten
- Automatischer Offline-Fortschritt

✅ **Monetization Features**
- Premium-Mitgliedschaft (50 Gems)
- Boost-Käufe (Wachstumsbeschleuniger)
- Werbesystem mit Cooldown
- Münz- und Gem-Pakete

✅ **Daily Engagement**
- Tägliche Login-Belohnungen (7-Tage-Zyklus)
- Täglicher Fortschritt mit limitierter Spielzeit
- Offline-Belohnungen (Premium: 24h, Standard: 8h)
- Streak-System für consecutive logins

✅ **Social Features**
- Leaderboards (Level, Reichtum, Daily Streaks)
- Achievement-System
- Ranking-Display

✅ **Modern UI/UX**
- Moderne Ionic-basierte Benutzeroberfläche
- Responsives Design für Tablet und Handy
- Animationen und visuelle Effekte
- Tab-basierte Navigation

## Tech Stack

- **Framework**: Ionic 8 + Angular 18
- **Mobile**: Capacitor für native iOS/Android
- **Storage**: Capacitor Preferences (lokal)
- **Notifications**: Capacitor Local Notifications
- **UI**: Ionic Components + Custom SCSS

## Projektstruktur

```
src/app/
├── models/           # TypeScript-Interfaces für Spiel-Daten
├── services/         # Game Service für Geschäftslogik
├── tab1/ (Garden)    # Haupt-Spielbereich
├── tab2/ (Shop)      # Monetarisierung & Käufe
├── tab3/ (Leaderboard) # Social Features
└── tabs/            # Navigation
```

## Entwicklung

### Voraussetzungen
- Node.js 18+
- Ionic CLI (`npm install -g @ionic/cli`)
- Capacitor CLI (`npm install -g @capacitor/cli`)

### Lokale Entwicklung
```bash
npm install
ionic serve
```

### Mobile Build
```bash
# Web-Assets bauen
npm run build

# Native Projekte synchronisieren
npx cap sync

# Android (benötigt Android Studio)
npx cap open android

# iOS (benötigt Xcode - nur auf Mac)
npx cap open ios
```

## Game Design

### Kern-Loop
1. **Login** → Tägliche Belohnung abholen
2. **Pflanzen** → Samen kaufen und pflanzen
3. **Warten** → Pflanzen wachsen lassen (offline möglich)
4. **Ernten** → Münzen und XP sammeln
5. **Upgrades** → Boosts kaufen, Premium upgraden

### Monetarisierung
- **Ads**: Kostenlose Belohnungen alle 5 Minuten
- **Boosts**: Temporäre Verbesserungen (Münzen/Gems)
- **Premium**: Erweiterte Features für 50 Gems
- **Convenience**: Beschleuniger für ungeduldige Spieler

### Retention
- **Daily Rewards**: 7-Tage-Zyklus mit steigenden Belohnungen
- **Offline Progress**: Belohnungen auch bei Abwesenheit
- **Achievements**: Langzeit-Ziele für Engagement
- **Leaderboards**: Sozialer Wettbewerb

## Next Steps für Production

### Backend Integration
- [ ] Echte Datenbank (Firebase/Supabase)
- [ ] User Authentication
- [ ] Cloud-basierte Leaderboards
- [ ] Server-validierte Transaktionen

### Monetization
- [ ] AdMob Integration für echte Werbung
- [ ] In-App-Purchases (Google Play/App Store)
- [ ] Analytics (Firebase/Amplitude)

### Features
- [ ] Push Notifications für Erntezeiten
- [ ] Mehr Pflanzentypen und Upgrades
- [ ] Events und zeitlich begrenzte Features
- [ ] Guilds/Social Features

## Deployment

### Android
1. Build: `npm run build`
2. Sync: `npx cap sync android`
3. Android Studio: `npx cap open android`
4. Build APK/Bundle in Android Studio

### iOS (nur auf Mac)
1. Build: `npm run build`
2. Sync: `npx cap sync ios`
3. Xcode: `npx cap open ios`
4. Build in Xcode für App Store

---

**Entwickelt für maximales Engagement und Monetarisierung durch tägliche Nutzung und Convenience-Käufe.** 🚀