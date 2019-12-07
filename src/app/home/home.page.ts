import { Component, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { NavController, ToastController, LoadingController, Platform } from '@ionic/angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Bill, Item, Less, SavedDescription } from '../data-model';
import { Storage } from '@ionic/storage';
import { ServiceService } from '../service.service';
// import { LocalNotifications } from '@ionic-native/local-notifications';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements AfterViewInit, OnDestroy {


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
  @ViewChild('weightTag') weightTag;
  @ViewChild('makingRateTag') makingRateTag;
  //db storage keys
  dbVoucherNo: string = 'voucherNo';
  dbBillDetails: string = 'bill';
  dbGoldRate: string = 'goldRate';
  dbSilverRate: string = 'silverRate'
  dbSavedDescriptions: string = 'savedDescriptions';
  dbNarration: string = 'narration';
  dbAppInitialized: string = 'isAppInitialized';
  isWhatsapp: boolean = false;
  is916Hallmark: boolean = false;

  // html attributes
  goldFill = "outline";
  silverFill = "outline";
  otherFill = "outline";

  billClear: boolean = true;
  public itemForm: FormGroup;
  public lessForm: FormGroup;

  narration: string = '';

  isNewBillingItem: boolean = true;

  voucherNo: number = 1;
  today: string = new Date().toISOString();
  custAddress: string = 'Jaysingpur';
  //itemCategorySelected: boolean = false;
  currentDescription: string = '';
  category: string = '';
  categoryRate: number;
  makingType: string = '/gram';
  weight: number = 0

  backButtonSubscription;

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
    public service: ServiceService, private socialSharing: SocialSharing, private platform: Platform,
    // private localNotifications: LocalNotifications 
  ) {

    this.storage.get(this.dbAppInitialized).then((val) => {
      if (!val || val !== 'yes') {
        this.initialState();
      }
    }
    ).catch(
      error => {
        console.log(error);
        this.service.presentToast('Error in initializing App' + error);
      }
    )

    this.storage.get(this.dbVoucherNo).then((val) => {
      this.voucherNo = val ? +val : 1
    }).catch(
      error => this.service.presentToast('Error in getting voucher data' + error)
    );

    this.storage.get(this.dbSavedDescriptions).then((val) => {
      this.goldSavedDescriptions = val ? val.filter(element => element.category === 'Gold') : [];
      this.silverSavedDescriptions = val ? val.filter(element => element.category === 'Silver') : [];
    }).catch(
      error => this.service.presentToast('Error in autocomplete' + error)
    );

    this.storage.get(this.dbNarration).then((val) => {
      this.narration = val ? val : '';
    }).catch(
      error => this.service.presentToast('Error getting narration ' + error)
    )

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

    this.categorySelected('Gold');

    this.lessForm = this.formBuilder.group({
      description: [],
      amount: []
    });

  }


  async initialState() {
    console.log('initialize inside home.ts');

    // const loader = await this.loadingCtrl.create({
    //   message: 'Initializing app...'
    // });
    // loader.present();
    // setTimeout(() => {
    // loader.dismiss();
    //  this.router.navigate(['/intro']);
    // }, 1000);
  }
  public getSavedDescription(inputValue): void {
    let abc = inputValue; // this.itemForm.value.description;
    console.log(abc);
    
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

  public saveSearchedItem(description): void {
    this.descriptions = [];
    this.itemForm.patchValue({ description: description })
  }

  ngAfterViewInit() { }

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

  getWeight2(): number {
    let abc = this.itemForm.value;
    if (abc.weight1 && abc.lessWeight) {
      return +(Math.abs(abc.weight1) - Math.abs(abc.lessWeight)).toFixed(3);
    }
    else {
      return -1;
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
          this.itemForm.patchValue({ rate: val ? +val : '' })
        }).catch(
          error => this.service.presentToast('Error in gold rate' + error)
        )
      this.goldFill = "solid";
      this.otherFill = "outline";
      this.silverFill = "outline";
    }
    else if (category === 'Silver') {
      this.storage.get(this.dbSilverRate).then(
        (val) => {
          // this.categoryRate = val;
          this.itemForm.patchValue({ rate: val ? +val : '' })
        }).catch(
          error => this.service.presentToast('Error in silver rate' + error)
        );
      this.silverFill = "solid";
      this.otherFill = "outline";
      this.goldFill = "outline";
    }
    else {
      this.goldFill = "outline";
      this.silverFill = "outline";
      this.otherFill = "solid";
      // this.categoryRate = 0;
      this.itemForm.patchValue({ rate: '' })
    }
  }

  saveItem(makingTag, weightTag) {
    let abc = this.itemForm.value;
    if (makingTag)
      this.makingType = '/item';
    else
      this.makingType = '/gram';

    this.items.push({
      id: this.itemCounter++,
      category: this.category,
      description: abc.description,
      grossWeight: weightTag ? abc.weight1 : 0,
      lessWeight: weightTag ? abc.lessWeight : 0,
      nettWeight: weightTag ? abc.weight2 : abc.weight1,
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
    this.weightTag.checked = false;
    this.makingRateTag.checked = false;
  }

  deleteItem(item: Item) {
    this.items.splice(this.items.indexOf(item), 1)
  }

  deleteLess(less: Less) {
    this.lesses.splice(this.lesses.indexOf(less), 1)
  }

  addNewItem(makingTag, weightTag) {
    this.saveItem(makingTag, weightTag);
  }

  goToLessBill(makingTag, weightTag) {
    this.saveItem(makingTag, weightTag);
    this.toggleBill();
  }

  addNewLess() {
    let abc = this.lessForm.value;
    this.lesses.push({
      id: this.lessCounter++,
      description: abc.description,
      amount: abc.amount
    })
    this.lessForm.reset();
    this.toggleBill();
  }

  toggleBill() {
    this.isNewBillingItem = !this.isNewBillingItem;
  }

  getAmount(makingTagGross, weightTagLess): number {
    let abc = this.itemForm.value;
    let weight: number = 0;
    if (abc.weight1 && abc.lessWeight) {
      weight = this.getWeight2() >= 0 ? this.getWeight2() : 0;
    }
    else {
      weight = abc.weight1;
    }
    if (weightTagLess) {
      return makingTagGross ? +(+weight * +abc.rate + +abc.making).toFixed(2)
        : +(+weight * +abc.rate + (+abc.making * +weight)).toFixed(2);
    }
    else {
      return makingTagGross ? +(+weight * +abc.rate + +abc.making).toFixed(2)
        : +(+weight * +abc.rate + (+abc.making * +weight)).toFixed(2);
    }
  }

  addBill() {
    this.storage.get(this.dbVoucherNo).then(
      (val) => {
        if (val) {
          this.voucherNo = +val;
        }
        else {
          this.voucherNo = 1;
        }
        this.storage.set(this.dbVoucherNo, this.voucherNo + 1)
      }
    ).catch(
      (error) => this.service.presentToast('Failed to load voucher number. Using default')
    );
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
            this.resetForms();
            this.service.selectPageSize(this.bill);
          }
        ).catch(
          (error) => this.service.presentToast(`Error in saving bill\n${error}`)
        )
      }
      else {
        bill.push(this.bill);
        this.storage.set(this.dbBillDetails, bill).then(
          () => {
            this.service.presentToast('Bill Saved Successfully');
            this.addBill();
            this.resetForms();
            this.service.selectPageSize(this.bill);
          }
        ).catch(
          (error) => this.service.presentToast(`Error in saving bill\n${error}`)
        )
      }
    }
    ).catch((error) => {
      this.service.presentToast('Error in getting bill details: ' + error)
    });
  }

  resetForms() {
    this.itemForm.reset(
      { address: 'Jaysingur' }
    );
    this.lessForm.reset();
    this.items = [];
    this.lesses = [];
    this.categorySelected('Gold');
    this.is916Hallmark = false;
    this.isWhatsapp = false;
    this.makingRateTag.checked = false;
    this.weightTag.checked = false;
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




  /* previous code
  
  
  
   dbVoucherNo: string = 'voucherNo';
   dbBillDetails: string = 'bill';
   dbGoldRate: string = 'goldRate';
   dbSilverRate: string = 'silverRate'
  
   public itemForm : FormGroup;
  mystring : string = "yash"
   voucherNo: string = "0";
   today: string = new Date().toISOString();
   custAddress: string = 'Jaysingpur';
   //itemCategorySelected: boolean = false;
   currentDescription: string = '';
   category: string = '';
   categoryRate: number;
   makingType:string = '';
  
   bill : Bill;
   items : Item[] = [];
   lesses : Less[] = [];
  
  
   // specialDetails: string = '';
   //specialDetailsSelected : boolean = false;
   constructor(private formBuilder: FormBuilder,
     public navCtrl: NavController, private storage: Storage, private toastController: ToastController) {
     this.storage.get(this.dbVoucherNo).then((val) => {
       this.voucherNo = val
     });
  
     this.itemForm = this.formBuilder.group({
     //  category:[''],
       description:[],
       weight1:[],
       lessWeight:[],
       weight2:[],
       rate : [],
       making : [],
      // makingType : [],
       amount: [],
     });
   }
  
   async presentToast(message: string) {
     const toast = await this.toastController.create({
       message: message,
       duration: 1500
     });
     toast.present();
   }
  
   categorySelected(category: string) {
     this.category = category;
     // this.itemCategorySelected = true;
     if (category === 'Gold') {
       this.storage.get(this.dbGoldRate).then((val) => {
         this.categoryRate = +val
       });
     }
     else if (category === 'Silver') {
       this.storage.get(this.dbSilverRate).then((val) => {
         this.categoryRate = +val
       });
     }
     else {
       this.categoryRate = 0;
     }
     //    this.specialDetailsSelected = true;
   }
  
   saveItem(){
     let abc= this.itemForm.value;
     // if(abc.weight2 || abc.lessWeight ){
  
     // }
     this.items.push({
       category : this.category,
       description : abc.description,
       grossWeight : abc.weight2 ? abc.weight1 : 0,
       lessWeight : abc.weight2 ? abc.lessWeight : 0,
       nettWeight : abc.weight2 ? abc.weight2 : abc.weight1,
       rate : abc.rate,
       making : abc.making,
       makingType : '',
       amount : abc.amount
     })
     this.itemForm.reset();
   }
  
   getAmount(weight: number, rate: number, making: number, tag: any): number {
     if (tag) {
       this.makingType = 'gross';
       return +weight * +rate + +making;
     }
     else {
       this.makingType = 'per gram';      
       return Math.round((+weight * +rate + (+making * +weight))*100)/100;
     }
   }
  
  
   addBill() {
     this.storage.get(this.dbVoucherNo).then(
       (val) => {
         if (val) {
           this.voucherNo = val;
         }
         else {
           this.voucherNo = "1";
         }
         this.storage.set(this.dbVoucherNo, this.voucherNo + 1)
       }
     ).catch(
       (error) => this.presentToast('Failed to load voucher number. Using default')
     );
   } */

}
