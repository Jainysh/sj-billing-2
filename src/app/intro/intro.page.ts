import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, MenuController, AlertController } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Storage } from '@ionic/storage';
import { ServiceService } from '../service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {

  @ViewChild('slides') slides: IonSlides;


  // config 1

  dbAppInitialized: string = 'isAppInitialized';
  dbSavedDescriptions: string = 'savedDescriptions';
  dbGoldRate: string = 'goldRate';
  dbSilverRate: string = 'silverRate'
  dbVoucherNo: string = 'voucherNo';
  // dbPrintPageSize: string = 'printPageSize';

  // config 2

  authKey = '';
  decryptedAuthKey = '';
  selectedPage6x4 = true;

  slideOpts = {
    allowTouchMove: false,
    // direction: 'vertical'
    // initialSlide: 0,
    // allowSlidePrev: false,
    //  allowSlideNext: false
  };
  constructor(private socialSharing: SocialSharing, private storage: Storage, public service: ServiceService,
    public router: Router, private menu: MenuController, private alertCtrl: AlertController) {
    this.menu.enable(false);
    this.storage.get(this.dbAppInitialized).then(
      val => {
        if (val == 'yes') {
          this.menu.enable(true);
          this.router.navigate(['home'])
        }
      }
    )
    // config 3
  }

  // config 4

  updatePageSize() {
    this.selectedPage6x4 = !this.selectedPage6x4;
  }

  setRate(goldRate, silverRate) {
    this.storage.set(this.dbGoldRate, goldRate).then(
      () => this.storage.set(this.dbSilverRate, silverRate).then(
        () => this.storage.set(this.dbSavedDescriptions, this.service.getDefaultSavedDescriptions()).then(
          // () => this.storage.set(this.dbPrintPageSize, this.selectedPage6x4 ? '6x4' : 'A5').then(
            () => {
              this.storage.set(this.dbVoucherNo, 1);
              this.storage.set(this.dbAppInitialized, 'yes');
              this.menu.enable(true);
              this.router.navigate(['home'])
            }))
            // )
            );
  }

  ngOnInit() {
  }

}
