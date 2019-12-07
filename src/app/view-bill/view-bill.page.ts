import { Component } from '@angular/core';
import { Bill } from '../data-model';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage'
import { ToastController, AlertController } from '@ionic/angular';
import { ServiceService } from '../service.service';

@Component({
  selector: 'app-view-bill',
  templateUrl: './view-bill.page.html',
  styleUrls: ['./view-bill.page.scss'],
})
export class ViewBillPage {

  bills: Bill[] = [];
  dbBillDetails: string = 'bill';

  printBill(bill: Bill) {
    console.log(bill)
    this.service.selectPageSize(bill);
  }

  constructor(public router: Router, public storage: Storage, public service: ServiceService,
    public toastController: ToastController, public alertCtrl: AlertController) {

    // setTimeout(() => {
    this.storage.get(this.dbBillDetails).then((val) => {
      // console.log(val)
      if (val && val.length) {
        this.bills = [...val];
        service.presentToast('Tap on the card to download the bill', 3000)
      }
      console.log(this.bills)
    });

    //  }, 1200);

  }

  goToBilling() {
    this.router.navigate(['/home']);
  }
}