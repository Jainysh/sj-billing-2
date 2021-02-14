import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ServiceService } from '../service.service';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.page.html',
  styleUrls: ['./preferences.page.scss'],
})
export class PreferencesPage {

  presentVoucherNo: number;
  presentGoldRate: number;
  presentSilverRate: number;
  narration: string = '';
  gstPercent: number;
  selectedPage6x4: boolean = false;

  dbVoucherNo: string = 'voucherNo';
  dbGoldRate: string = 'goldRate';
  dbSilverRate: string = 'silverRate'
  dbBillDetails: string = 'bill';
  dbNarration: string = 'narration';
  dbGSTPercent: string = 'gstPercent';
  // dbPrintPageSize: string = 'printPageSize';

  constructor(public navCtrl: NavController, public alertController: AlertController,
    private storage: Storage, private service: ServiceService, public router: Router) {
    this.storage.get(this.dbVoucherNo).then((val) => this.presentVoucherNo = +val).catch(
      (error) => this.service.presentToast('Error in getting Voucher data ' + error)
    );
    this.storage.get(this.dbGoldRate).then((val) => this.presentGoldRate = +val).catch(
      (error) => this.service.presentToast('Error in getting Gold Rate' + error)
    );
    this.storage.get(this.dbSilverRate).then(val => this.presentSilverRate = +val)
      .catch(error => this.service.presentToast('Error in getting Silver Rate' + error));
    this.storage.get(this.dbNarration).then(val => this.narration = val ? val : '')
      .catch(error => this.service.presentToast('Error in getting Narration' + error));
    this.storage.get(this.dbGSTPercent).then(val => {
      this.gstPercent = +val;
      if (this.gstPercent === 0) {
        this.storage.set(this.dbGSTPercent, 3);
      }
    })
      .catch(error => this.service.presentToast('Error in getting GST percent' + error));


    // this.storage.get(this.dbPrintPageSize).then((val) => {
    //   // this.pageSize = val;
    //   this.selectedPage6x4 = val === '6x4' ? true : false
    // })

    //  debugger;
    //   this.storage.get(this.dbPrintPageSize).then((val) => {
    //     console.log('here')
    //     this.selectedPage6x4 = val === '6x4' ? true : false;
    // console.log(val);
    // }).catch(
    //     (error) => this.service.presentToast('Error in getting default page size, selected 6x4')
    //   )
  }

  // await alertConfirmBox()

  goToSavedDescriptions() {
    this.router.navigate(['/saved-descriptions']);
  }

  updateVoucherNo(voucherNo: number) {
    this.storage.set(this.dbVoucherNo, voucherNo).then(
      () => {
        this.service.presentToast('Voucher number reseted successfully');
        this.presentVoucherNo = voucherNo;
        (<HTMLInputElement>document.getElementById("voucherNo")).value = "";
      }
    )
  }

  // updatePageSize() {
  //   this.selectedPage6x4 = !this.selectedPage6x4;
  //   this.storage.set(this.dbPrintPageSize, this.selectedPage6x4 ? '6x4' : 'A5').then(
  //     () => this.service.presentToast(`Paper size set to ${this.selectedPage6x4 ? '6x4' : 'A5'}`)
  //   )
  // }

  updateGold(rate: number) {
    this.storage.set(this.dbGoldRate, rate).then(
      () => {
        this.service.presentToast(`Gold rate updated to Rs.${rate}/gm`);
        this.presentGoldRate = rate;
        (<HTMLInputElement>document.getElementById("goldRate")).value = "";
      }
    )
  }

  updateSilver(rate: number) {
    this.storage.set(this.dbSilverRate, rate).then(() => {
      this.service.presentToast(`Silver Rate update to Rs.${rate}/gm`);
      this.presentSilverRate = rate;
      (<HTMLInputElement>document.getElementById("silverRate")).value = "";
    });
  }

  updateNarration() {
    this.storage.set(this.dbNarration, this.narration).then(
      () => this.service.presentToast('Success. Narration updated.')
    ).catch(
      error => this.service.presentToast('Error' + error)
    )
  }

  resetNarration() {
    this.narration = '';
    this.updateNarration();
  }

}
