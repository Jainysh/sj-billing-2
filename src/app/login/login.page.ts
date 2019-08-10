import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from '../service.service';
import { MenuController } from '@ionic/angular';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, AfterViewInit, OnDestroy {

  password: string[] = [];
  backButtonSubscription;

  constructor(private router: Router, private service: ServiceService,
    private menu: MenuController, private platform: Platform) {
    this.menu.enable(false);
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(0, () => {
      console.log("login back pressed");
      navigator['app'].exitApp();
    });
    /**
     * on back button, exit app
     */
  }
  ngAfterViewInit() {
    this.menu.enable(false);

   
  }
  ngOnInit() {
    this.menu.enable(false);
  }
  ngOnDestroy() {
    this.backButtonSubscription.unsubscribe();
  }
  addPin(pin: string) {
    if (this.password.length < 4) {
      this.password.push(pin);
    }
    if (this.password.length === 4) {
      if (this.password.toString() === '2,0,1,9') {
        this.password = [];
        this.router.navigate(['/home'])
      }
      else {
        this.service.presentToast('Wrong Pin', 1000);
        setTimeout(() => {
          this.password = [];
        }, 1000);
      }
    }
  }

  removePin() {
    if (this.password.length !== 0) {
      this.password.pop();
    }
  }

  exitApp() {
    navigator['app'].exitApp();
  }

  ionViewWillLeave() {
    this.menu.enable(true);
  }
}
