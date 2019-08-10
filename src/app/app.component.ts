import { Component } from '@angular/core';

import { Platform, } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    { title: 'Billing', url: '/home', icon: 'paper' },
    { title: 'Order/Repair SMS', url: '/sms', icon: 'bonfire' },
    { title: 'Preferences', url: '/preferences', icon: 'build' },
    { title: 'About Us', url: '/about-us', icon: 'flower' }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
