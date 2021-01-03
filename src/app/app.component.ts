import { Component } from '@angular/core';

import { Platform, } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

// import { dbAppInitialized} from './dbKeys';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  // dbAppInitialized: string = 'isAppInitialized';

  public appPages = [
    { title: 'Billing', url: '/home', icon: 'newspaper-outline' },
    { title: 'Order/Repair SMS', url: '/sms', icon: 'construct-outline' },
    { title: 'Reports', url: '/reports', icon: 'bar-chart-outline'},
    { title: 'Preferences', url: '/preferences', icon: 'settings-outline' },
    { title: 'About Us', url: '/about-us', icon: 'heart-outline' }
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
