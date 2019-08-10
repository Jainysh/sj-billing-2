import { Component } from '@angular/core';
import { Router } from '@angular/router';
// import * as XLSX from 'xlsx';
import { File } from '@ionic-native/file/ngx';
import { AlertController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Bill } from '../data-model';
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
  narration: string = 'abc';

  bills: Bill[] = [];

  dbVoucherNo: string = 'voucherNo';
  dbGoldRate: string = 'goldRate';
  dbSilverRate: string = 'silverRate'
  dbBillDetails: string = 'bill';
  dbNarration: string = 'narration';

  constructor(public navCtrl: NavController, public file: File, public alertController: AlertController,
    private storage: Storage, private service: ServiceService, public router: Router) {
    this.storage.get(this.dbVoucherNo).then((val) => {
      this.presentVoucherNo = +val
    }).catch(
      (error) => this.service.presentToast('Error in getting Voucher data ' + error)
    );
    this.storage.get(this.dbGoldRate).then((val) => {
      this.presentGoldRate = +val
    }).catch(
      (error) => this.service.presentToast('Error in getting Gold Rate' + error)
    );
    this.storage.get(this.dbSilverRate).then((val) => {
      this.presentSilverRate = +val
    }).catch(
      (error) => this.service.presentToast('Error in getting Silver Rate' + error)
    );
    this.storage.get(this.dbBillDetails).then((val) => {
      if (val && val.length)
        this.bills = [...val];
    }).catch(
      (error) => this.service.presentToast('Error in getting Bill data ' + error)
    );
    this.storage.get(this.dbNarration).then((val) => {
      this.narration = val;
    }).catch(
      (error) => this.service.presentToast('Error in getting Silver Rate' + error)
    );
  }

  // excel export function
  getStoragePath() {
    let file = this.file;
    return this.file.resolveDirectoryUrl(this.file.externalRootDirectory).then(function (directoryEntry) {
      return file.getDirectory(directoryEntry, "Ionic2ExportToXLSX", {
        create: true,
        exclusive: false
      }).then(function () {
        return directoryEntry.nativeURL + "Ionic2ExportToXLSX/";
      });
    });
  }

  viewBills() {
    this.router.navigate(['/view-bill']);
  }
  // await alertConfirmBox()

  goToSavedDescriptions() {
    this.router.navigate(['/saved-descriptions']);
  }

  async resetBills() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'This will <strong>clear</strong> all bill data!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            //  console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.storage.remove(this.dbBillDetails).then(() => {
              this.bills = [];
              this.storage.set(this.dbVoucherNo, 1).then(
                () => this.presentVoucherNo = 1
              )
              this.service.presentToast("Success! Bills cleared. Voucher number updated to 1")
            }).catch(
              (error) => this.service.presentToast('Something went wrong! Try again')
            );
            //  console.log('Confirm Okay');
          }
        }
      ]
    });
    await alert.present();
  }

  // exportToExcel() {
  //   let sheet = XLSX.utils.json_to_sheet(this.bills);
  //   let book = {
  //     SheetNames: ["export"],
  //     Sheets: {
  //       "export": sheet
  //     }
  //   };

  //   let wbout = XLSX.write(book, {
  //     bookType: 'xlsx',
  //     bookSST: false,
  //     type: 'binary'
  //   });
  //   function s2ab(s) {
  //     let buf = new ArrayBuffer(s.length);
  //     let view = new Uint8Array(buf);
  //     for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  //     return buf;
  //   }

  //   let blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });

  //   this.getStoragePath().then(function (url) {
  //     this.file.writeFile(url, "export.xlsx", blob, true).then(() => {
  //      this.presentToast("file created at: " + url);
  //     }).catch(() => {
  //      this.presentToast("error creating file at :" + url);
  //     });
  //   }).catch((error)=>this.presentToast('Error in getting storage path '+error));

  //   // console.log("exported")
  // }

  updateVoucherNo(voucherNo: number) {
    this.storage.set(this.dbVoucherNo, voucherNo).then(
      () => {
        this.service.presentToast('Voucher number reseted successfully');
        this.presentVoucherNo = voucherNo;
        (<HTMLInputElement>document.getElementById("voucherNo")).value = "";
      }
    )
  }

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
    this.storage.set(this.dbSilverRate, rate).then(
      () => {
        this.service.presentToast(`Silver Rate update to Rs.${rate}/gm`);
        this.presentSilverRate = rate;
        (<HTMLInputElement>document.getElementById("silverRate")).value = "";
      }
    )
  }

  updateNarration() {
    this.storage.set(this.dbNarration, this.narration).then(
      () => {
        this.service.presentToast('Success.');
      }
    ).catch(
      error => this.service.presentToast('Error' + error)
    )
  }

  resetNarration(){
    this.narration = '';
    this.updateNarration();
  }
  ionViewDidLoad() {
    // console.log('ionViewDidLoad SettingsPage');
  }

}
