# AdMob Integration für Bloom Garden

## Was wurde implementiert

AdMob Interstitial-Werbung wurde erfolgreich in dein Garten-Spiel integriert. Die Werbung erscheint automatisch nach dem Ernten von Pflanzen (sowohl einzeln als auch beim "Alle ernten").

## Installierte Pakete

- `@capacitor-community/admob@^7.0.3`

## Erstellte/Geänderte Dateien

### Neue Dateien:
- `src/app/services/admob.service.ts` - AdMob Service für Werbung
- `ADMOB_SETUP.md` - Diese Dokumentation

### Geänderte Dateien:
- `src/app/tab1/tab1.page.ts` - Integration der Werbung nach dem Ernten
- `android/app/src/main/AndroidManifest.xml` - Android AdMob Konfiguration
- `ios/App/App/Info.plist` - iOS AdMob Konfiguration

## Für Production

### 1. Erstelle ein AdMob-Konto
- Gehe zu https://admob.google.com/
- Erstelle eine neue App
- Erstelle Interstitial Ad Units für Android und iOS

### 2. Ersetze Test-IDs mit echten Ad Unit IDs
In `src/app/services/admob.service.ts`:

```typescript
private getInterstitialAdId(): string {
  if (Capacitor.getPlatform() === 'android') {
    return 'ca-app-pub-DEINE_PUB_ID/DEINE_ANDROID_AD_UNIT_ID';
  } else if (Capacitor.getPlatform() === 'ios') {
    return 'ca-app-pub-DEINE_PUB_ID/DEINE_iOS_AD_UNIT_ID';
  }
  return '';
}
```

### 3. Aktualisiere App IDs
- Android: `android/app/src/main/AndroidManifest.xml`
- iOS: `ios/App/App/Info.plist`

### 4. Testing deaktivieren
In `src/app/services/admob.service.ts`:
```typescript
initializeForTesting: false  // auf false setzen
isTesting: false            // auf false setzen
```

## Wie es funktioniert

1. **Initialisierung**: AdMob wird beim App-Start initialisiert
2. **Vorabladen**: Interstitial Ads werden im Hintergrund geladen
3. **Anzeige**: Nach dem Ernten wird automatisch eine Werbung gezeigt
4. **Nachladen**: Nach jeder Anzeige wird die nächste Werbung vorgeladen

## Befehle für Build

```bash
# Sync mit nativen Plattformen
npx cap sync

# Android Build
npx cap run android

# iOS Build (nur auf macOS)
npx cap run ios
```

## Hinweise

- Die Integration verwendet Test-Ad-IDs von Google
- Werbung wird nur auf echten Geräten angezeigt, nicht im Browser
- Im Web-Browser werden keine Ads geladen (normales Verhalten)
- Die Werbung ist kurz und vollbildschirmig (Interstitial)