import { Component, OnDestroy, ViewChild } from '@angular/core';
import { NavController, ToastController, LoadingController, Platform } from '@ionic/angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Bill, Item, Less, SavedDescription } from '../data-model';
import { Storage } from '@ionic/storage';
import { ServiceService } from '../service.service';
// import { LocalNotifications } from '@ionic-native/local-notifications';
// import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnDestroy {


  /**
   * 
   * AUTH KEY: XX<abcd random>XX >> stored in hex
   * isAppInitialized = false
   * generateAuthKey, state = authKeyGenerated
   * sendAuthKey, state = authKeySent
   * confirmAuthKey, state = authKeyConfirmed
   * gold, silver rate set and suggestion library loaded, isAppInitialized = true
   *
   */


  /**
   * 
   * 
   * double tab issue
   * new item control to category selection
   * suggestion improvement
   * page size from settings and remove size prompt
   * saving draft
   * reset bills
   * 
   */

  @ViewChild('oldValue') oldValue;

  isNettWeight = false;
  //db storage keys
  dbVoucherNo: string = 'voucherNo';
  dbBillDetails: string = 'bill';
  dbGoldRate: string = 'goldRate';
  dbSilverRate: string = 'silverRate'
  dbSavedDescriptions: string = 'savedDescriptions';
  dbNarration: string = 'narration';
  dbAppInitialized: string = 'isAppInitialized';
  dbPrintPageSize: string = 'printPageSize';

  selectedPage: string = '';
  isWhatsapp: boolean = false;
  is916Hallmark: boolean = false;

  // html attributes
  goldFill = "outline";
  silverFill = "outline";
  otherFill = "outline";

  billClear: boolean = true;
  itemForm: FormGroup;
  lessForm: FormGroup;

  narration: string = '';

  isNewBillingItem: boolean = true;

  voucherNo: number = 1;
  today: string = '';
  custAddress: string = 'Jaysingpur';
  //itemCategorySelected: boolean = false;
  currentDescription: string = '';
  category: string = '';
  categoryRate: number;
  makingType: string = '/gram';
  weight: number = 0
  backButtonSubscription;

  // makingRates = [100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240];

  bill: Bill = null;
  items: Item[] = [];
  lesses: Less[] = [];
  //savedDescriptions: SavedDescription[] = [];
  goldSavedDescriptions: SavedDescription[] = [];
  silverSavedDescriptions: SavedDescription[] = [];
  descriptions: SavedDescription[] = [];
  //local notification item
  bills: Bill[] = [];

  //pdf items
  itemCounter: number = 0;
  lessCounter: number = 0;

  constructor(private formBuilder: FormBuilder, public navCtrl: NavController, private storage: Storage,
    private toastController: ToastController, public loadingCtrl: LoadingController, public router: Router,
    public service: ServiceService, private platform: Platform
    // private localNotifications: LocalNotifications , private socialSharing: SocialSharing, 
  ) {
    this.today = new Date().toISOString();

    this.storage.get(this.dbVoucherNo).then(val => this.voucherNo = val ? +val : 1)
      .catch(error => this.service.presentToast('Error in getting voucher data' + error));

    this.storage.get(this.dbPrintPageSize).then(val => this.selectedPage = val || 'A5')
      .catch(error => this.service.presentToast('Error in pageSize' + error));

    this.storage.get(this.dbSavedDescriptions).then((val) => {
      this.goldSavedDescriptions = val ? val.filter(element => element.category === 'Gold') : [];
      this.silverSavedDescriptions = val ? val.filter(element => element.category === 'Silver') : [];
    }).catch(error => this.service.presentToast('Error in autocomplete' + error));

    this.storage.get(this.dbNarration).then((val) => this.narration = val ? val : '')
      .catch(error => this.service.presentToast('Error getting narration ' + error));

    this.itemForm = this.formBuilder.group({
      name: [],
      address: ['Jaysingpur'],
      contact: [],
      //  category:[''],
      description: [],
      weight1: [],
      lessWeight: [],
      weight2: [],
      rate: [],
      making: [],
      // makingType : [],
      amount: [],
    });

    this.itemForm.controls['weight2'].disable();
    this.categorySelected('Gold');

    this.lessForm = this.formBuilder.group({
      description: [],
      amount: []
    });
  }

  public getSavedDescription(inputValue): void {
    let abc = inputValue; // this.itemForm.value.description;
    if (abc && abc.length) {
      if (this.category === 'Gold') {
        this.descriptions = this.goldSavedDescriptions.filter((element) => {
          return element.description.toLowerCase().indexOf(abc.toLowerCase()) > -1;
        })
      }
      else if (this.category === 'Silver') {
        this.descriptions = this.silverSavedDescriptions.filter((element) => {
          return element.description.toLowerCase().indexOf(abc.toLowerCase()) > -1;
        })
      }
      else {
        this.descriptions = [];
      }
    }
    else {
      this.descriptions = [];
    }
  }

  closeDescription(ev: Event) {
    ev.stopPropagation();
    this.descriptions = [];
  }

  public saveSearchedItem(description): void {
    this.descriptions = [];
    this.itemForm.patchValue({ description: description })
  }

  hardwareBackButton() {
    this.platform.backButton.subscribe(() => {
      navigator['app'].exitApp();
    });
  }

  ngOnDestroy() {
    //  this.backButtonSubscription.unsubscribe();
  }

  toggleWhatsapp() {
    this.isWhatsapp = !this.isWhatsapp;
  }

  getTotalAmount(): number {
    let amt: number = 0;
    if (this.items.length) {
      for (let item of this.items) {
        amt += +item.amount;
      }
    }
    if (this.lesses.length) {
      for (let less of this.lesses) {
        amt -= +less.amount;
      }
    }
    return amt;
  }

  getWeight2() {
    let abc = this.itemForm.value;
    if (this.isNettWeight) {
      const weight2 = +(Math.abs(abc.weight1) - Math.abs(abc.lessWeight)).toFixed(3)
      this.itemForm.controls['weight2'].setValue(weight2 >= 0 ? weight2 : 0);
    }
  }

  comment() {
    this.is916Hallmark = !this.is916Hallmark;
  }

  categorySelected(category: string) {
    this.category = category;
    if (category === 'Gold') {
      this.storage.get(this.dbGoldRate).then(
        (val) => {
          this.categoryRate = val;
          this.itemForm.patchValue({ rate: val ? +val : '' })
        }).catch(
          error => this.service.presentToast('Error in gold rate' + error)
        )
      this.goldFill = "solid";
      this.otherFill = "outline";
      this.silverFill = "outline";
      this.itemForm.patchValue({ making: 180 });
    }
    else if (category === 'Silver') {
      this.storage.get(this.dbSilverRate).then(
        (val) => {
          this.categoryRate = val;
          this.itemForm.patchValue({ rate: val ? +val : '' })
        }).catch(
          error => this.service.presentToast('Error in silver rate' + error)
        );
      this.silverFill = "solid";
      this.otherFill = "outline";
      this.goldFill = "outline";
      this.itemForm.patchValue({ making: '' });
    }
    else {
      this.goldFill = "outline";
      this.silverFill = "outline";
      this.otherFill = "solid";
      // this.categoryRate = 0;
      this.categoryRate = 0;
      this.itemForm.patchValue({ rate: '' })
      this.itemForm.patchValue({ making: '' });
    }
  }

  saveItem() {
    let abc = this.itemForm.getRawValue();
    this.items.push({
      id: this.itemCounter++,
      category: this.category,
      description: abc.description,
      grossWeight: this.isNettWeight ? abc.weight1 : 0,
      lessWeight: this.isNettWeight ? abc.lessWeight : 0,
      nettWeight: this.isNettWeight ? abc.weight2 : abc.weight1,
      rate: +abc.rate,
      making: abc.making,
      makingType: this.makingType,
      amount: abc.amount,
      comments: this.is916Hallmark ? '916Hallmark' : ''
    })
    this.itemForm.reset({
      name: this.itemForm.value.name,
      address: this.itemForm.value.address,
      contact: this.itemForm.value.contact
    });
    this.is916Hallmark = false;
    this.categorySelected('Gold');
    this.isNettWeight = false;
    this.makingType = '/gram';
  }

  deleteItem(item: Item) {
    this.items.splice(this.items.indexOf(item), 1)
  }

  deleteLess(less: Less) {
    this.lesses.splice(this.lesses.indexOf(less), 1)
  }

  addNewItem() {
    this.saveItem();
  }

  goToLessBill() {
    this.saveItem();
    this.toggleBill();
  }

  addNewLess(addMore?: boolean) {
    let abc = this.lessForm.value;
    this.lesses.push({
      id: this.lessCounter++,
      description: abc.description,
      amount: abc.amount
    })
    this.lessForm.reset();
    if (!addMore) {
      this.toggleBill();
    } else {
      setTimeout(() => this.oldValue.setFocus(), 100);
    }
  }

  toggleBill() {
    this.isNewBillingItem = !this.isNewBillingItem;
  }


  getAmount(): number {
    let abc = this.itemForm.getRawValue();
    let weight: number = 0;
    if (abc.weight1 && abc.lessWeight) {
      weight = abc.weight2 >= 0 ? abc.weight2 : 0;
    }
    else {
      weight = abc.weight1;
    }
    if (this.isNettWeight) {
      return this.makingType === '/item' ? +(+weight * +abc.rate + +abc.making).toFixed(2)
        : +(+weight * +abc.rate + (+abc.making * +weight)).toFixed(2);
    }
    else {
      return this.makingType === '/item' ? +(+weight * +abc.rate + +abc.making).toFixed(2)
        : +(+weight * +abc.rate + (+abc.making * +weight)).toFixed(2);
    }
  }

  addBill() {
    this.voucherNo++;
    this.storage.set(this.dbVoucherNo, this.voucherNo);
  }

  finishBilling(paidAmount) {
    let custDetails = this.itemForm.value;
    this.bill = {
      voucherNo: this.voucherNo,
      customerName: custDetails.name || '',
      customerAddress: custDetails.address || '',
      customerContact: custDetails.contact || '',
      isWhatsapp: this.isWhatsapp,
      date: this.today,
      items: this.items,
      lesses: this.lesses,
      totalAmount: this.getTotalAmount(),
      outstandingAmount: this.billClear ? 0 : this.getTotalAmount() - paidAmount,
      paidAmount: paidAmount,
      billClear: this.billClear,
      narration: this.narration
    }

    this.storage.get(this.dbBillDetails).then((val) => {
      let bill: Bill[] = [];
      if (val) {
        bill = [...val];
        bill.push(this.bill);
        this.storage.set(this.dbBillDetails, bill).then(
          () => {
            this.service.presentToast('Bill Saved Successfully');
            this.addBill();
            //   this.resetForms();  DO NOT RESET BILL DATA ON FINISHING BILL
            this.service.makePdf(this.bill, this.selectedPage);
            //      this.service.selectPageSize(this.bill, this.pageSize);
          }
        ).catch(error => this.service.presentToast(`Error in saving bill ${error}`))
      }
      else {
        bill.push(this.bill);
        this.storage.set(this.dbBillDetails, bill).then(
          () => {
            this.service.presentToast('Bill Saved Successfully');
            this.addBill();
            this.service.makePdf(this.bill, this.selectedPage);
            // this.service.selectPageSize(this.bill, this.pageSize);
          }
        ).catch(
          (error) => this.service.presentToast(`Error in saving bill ${error}`)
        )
      }
    }
    ).catch((error) => {
      this.service.presentToast('Error in getting bill details: ' + error)
    });
  }

  resetForms() {
    this.itemForm.reset(
      { address: 'Jaysingpur' }
    );
    this.lessForm.reset();
    this.items = [];
    this.lesses = [];
    this.categorySelected('Gold');
    this.is916Hallmark = false;
    this.isWhatsapp = false;
    this.makingType = '/gram';
    this.isNettWeight = false;
    this.today = new Date().toISOString();
    this.billClear = true;
  }

  toggleMakingType() {
    if (this.makingType === '/gram') {
      this.makingType = '/item';
    } else {
      this.makingType = '/gram';
    }
  }

  toggleNettWeight() {
    this.isNettWeight = !this.isNettWeight;
  }

  updateRate() {
    if (this.category === 'Gold') {
      this.storage.set(this.dbGoldRate, this.itemForm.get('rate').value).
        then(() => this.service.presentToast(`Gold rate updated to Rs.${this.itemForm.get('rate').value}/gm`));
    } else if (this.category === 'Silver') {
      this.storage.set(this.dbSilverRate, this.itemForm.get('rate').value).
        then(() => this.service.presentToast(`Silver rate updated to Rs.${this.itemForm.get('rate').value}/gm`));
    }
  }
  //    this.plt.ready().then(() => {
  //    let smsSend: boolean = false;

  //       this.localNotifications.fireQueuedEvents().then(
  //         () => {
  //           this.presentToast("Sending queued notification")
  //           let sendSMSTo: string = '';
  //           let smsText =
  //             `**Shankheshwar Jewellers**  

  // Thank you for shopping with us!`;
  //           this.storage.get(this.dbBillDetails).then((val) => {
  //             smsSend = true;
  //             if (val && val.length) {
  //               this.bills = [...val];
  //               let today: string = new Date().toISOString();
  //               let todayBills: Bill[] = this.bills.filter(element => element.customerContact.length && (element.date.substr(0, 9) === today.substr(0, 9)));
  //               todayBills.forEach(element => sendSMSTo += element.customerContact + ",");
  //               sendSMSTo = sendSMSTo.substr(0, sendSMSTo.length - 1);
  //               this.socialSharing.shareViaSMS(smsText, sendSMSTo);
  //             }
  //           });
  //           if (!smsSend) {
  //             //    this.router.navigate(['/sms'])
  //           }

  //         }
  //       ).catch(
  //         error => this.presentToast(`Error occurred for queued notification: ${error}`)
  //       )


  //       this.localNotifications.on('click').subscribe(res => {

  //         //   let msg = res.data ? res.data.mydata : '';
  //         let sendSMSTo: string = '';
  //         let smsText =
  //           `**Shankheshwar Jewellers**

  // Thank you for shopping with us!`;
  //         this.storage.get(this.dbBillDetails).then((val) => {
  //           smsSend = true;
  //           if (val && val.length) {
  //             this.bills = [...val];
  //             let today: string = new Date().toISOString();
  //             let todayBills: Bill[] = this.bills.filter(element => element.customerContact.length && (element.date.substr(0, 9) === today.substr(0, 9)));
  //             todayBills.forEach(element => sendSMSTo += element.customerContact + ",");
  //             sendSMSTo = sendSMSTo.substr(0, sendSMSTo.length - 1);
  //             this.socialSharing.shareViaSMS(smsText, sendSMSTo);
  //           }
  //         });
  //         if (!smsSend) {
  //           //    this.router.navigate(['/sms'])
  //         }
  //       },
  //         error => this.presentToast(`Error ocurred for local notification: ${error}`));

  //       this.localNotifications.on('trigger').subscribe(res => {
  //        //    let msg = res.data ? res.data.mydata : '';
  //              this.presentToast('SMS reminder scheduled ')
  //       });
  //     });
  //     this.repeatingDaily();
  // }

  // repeatingDaily() {
  //   let isScheduled: boolean = false;
  //   this.localNotifications.getScheduledIds().then((res: number[]) => {
  //     if (res.indexOf(1930) !== -1 || res.indexOf(2030) !== -1) {
  //       isScheduled = true;
  //     }
  //     else{
  //       this.localNotifications.schedule({
  //         id: 1930,
  //         title: 'Aaj ke customers ko SMS kiya?',
  //         text: 'Tap here to send SMS now',
  //         trigger: { every: { hour: 19, minute: 30 } }
  //       });
  //       this.localNotifications.schedule({
  //         id: 2030,
  //         title: 'Aaj ke customers ko SMS kiya?',
  //         text: 'Tap here to send SMS now',
  //         trigger: { every: { hour: 20, minute: 30 } }
  //       });
  //       this.presentToast("Reminder scheduled at 7.30 & 8.30 pm")
  //     }
  //   })
  //   // this.localNotifications.schedule({
  //   //   id: Math.random() * 10 / 1,
  //   //   title: 'Aaj ke customers ko SMS kiya?',
  //   //   text: 'Tap here to send SMS now',
  //   //   //  trigger: { every: { hour: 19, minute: 30 } }
  //   // });

  // }
}
