import { Component } from '@angular/core';

import { Platform, } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  dbAppInitialized: string = 'isAppInitialized';

  public appPages = [
    { title: 'Billing', url: '/home', icon: 'paper' },
    { title: 'Order/Repair SMS', url: '/sms', icon: 'bonfire' },
    { title: 'Preferences', url: '/preferences', icon: 'build' },
    { title: 'About Us', url: '/about-us', icon: 'flower' }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public storage: Storage, public router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // this.storage.get(this.dbAppInitialized).then(
      //   (appInitialized) => {
      //     if (!appInitialized || appInitialized !== 'yes') {
      //       console.log('not intialized');
      //       this.router.navigate(['/intro']);

      //     }
      //   }
      // )
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
