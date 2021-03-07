import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Bill } from '../data-model';
import { ServiceService } from '../service.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { File } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {

  dbBillDetails: string = 'bill';
  dbVoucherNo: string = 'voucherNo';
  dbPrintPageSize: string = 'printPageSize';

  bills: Bill[] = [];
  printPageSize = '';

  constructor(private storage: Storage, private service: ServiceService, private alertController: AlertController,
    private router: Router, public file: File) {
    this.storage.get(this.dbBillDetails).then((val) => {
      if (val && val.length)
        this.bills = [...val];
      service.presentToast('Tap on the card to download the bill', 3000)
    }).catch(
      (error) => this.service.presentToast('Error in getting Bill data ' + error)
    );
    this.storage.get(this.dbPrintPageSize).then((val) => this.printPageSize = val || 'A5').catch(
      (error) => this.service.presentToast('Error in setting page size ' + error)
    )
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
              this.storage.set(this.dbVoucherNo, 1).then(() => this.service.presentToast("Success! Bills cleared. Voucher number updated to 1"));
            }).catch(error => this.service.presentToast('Something went wrong! Try again'));
          }
        }
      ]
    });
    await alert.present();
  }

  printBill(bill: Bill) {
    this.service.makePdf(bill, this.printPageSize);
  }

  // excel export function
  getStoragePath() {
    let file = this.file;
    return this.file.resolveDirectoryUrl(this.file.externalRootDirectory).then(function (directoryEntry) {
      return file.getDirectory(directoryEntry, "Ionic2ExportToXLSX", {
        create: true,
        exclusive: false
      }).then(function () {
        return directoryEntry.nativeURL + "XLS_DATA/";
      }).catch(error => {
        this.service.presentToast("error in getStoragePath", error)
      });
    });
  }

  goToBilling() {
    this.router.navigate(['/home']);
  }

  exportToExcel = function () {

    let billData: any[] = [];
    let salesData: any[] = [];

    this.bills.forEach((element: Bill) => {
      element.items.forEach(
        itemElement => salesData.push(
          //   { 'voucherNo': element.voucherNo, 'customerName': element.customerName, 'cus'}
        )
      )

    });
    let billSheet = XLSX.utils.json_to_sheet(this.billData);
    let salesSheet = XLSX.utils.json_to_sheet(this.salesData)
    let book = {
      SheetNames: ["export"],
      Sheets: {
        "bills": billSheet,
        "sales": salesSheet
      }
    };

    let wbout = XLSX.write(book, {
      bookType: 'xlsx',
      bookSST: false,
      type: 'binary'
    });
    function s2ab(s) {
      let buf = new ArrayBuffer(s.length);
      let view = new Uint8Array(buf);
      for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    }

    let blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
    let self = this;

    this.getStoragePath().then(function (url) {
      self.file.writeFile(url, "export.xlsx", blob, true).then(() => {
        this.service.presentToast("file created at: " + url);
      }).catch(() => {
        this.service.presentToast("error creating file at :" + url);
      });
    }).catch((error) => this.service.presentToast('Error in getting storage path ' + error));

    // console.log("exported")
  }


  ngOnInit() {
  }

}
