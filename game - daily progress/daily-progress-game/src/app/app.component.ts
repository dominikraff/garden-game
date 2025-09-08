import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private platform: Platform) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();
    
    // Only run on native platforms
    if (Capacitor.isNativePlatform()) {
      // Configure StatusBar
      try {
        // Set the status bar to use the default style
        await StatusBar.setStyle({ style: Style.Light });
        
        // Set background color to match our primary color
        await StatusBar.setBackgroundColor({ color: '#4CAF50' });
        
        // Make sure the status bar doesn't overlay our content
        await StatusBar.setOverlaysWebView({ overlay: false });
      } catch (error) {
        console.error('Error configuring StatusBar:', error);
      }
    }
  }
}
