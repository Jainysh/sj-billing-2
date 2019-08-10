import { Component, OnInit } from '@angular/core';
//import { ServiceService } from '../service.service';
import { Storage } from '@ionic/storage'
import { Bill } from '../data-model';
//import { AlertController, NavParams } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
//import { ActionSheetController } from '@ionic/angular';
import { ModalController} from '@ionic/angular';
import { AddSmsNumbersPage } from '../add-sms-numbers/add-sms-numbers.page';
//import { LocalNotifications, ELocalNotificationTriggerUnit, ILocalNotificationActionType, ILocalNotification } from '@ionic-native/local-notifications/ngx';


@Component({
  selector: 'app-sms',
  templateUrl: './sms.page.html',
  styleUrls: ['./sms.page.scss'],
})
export class SmsPage implements OnInit {

  dbBillDetails: string = 'bill';
  bills: Bill[] = [];

  constructor(public storage: Storage,
    // private service: ServiceService, 
    //public actionSheetController: ActionSheetController,
    private socialSharing: SocialSharing,
    public modalCtrl: ModalController,
    //   private alertCtrl: AlertController
  ) {  }


  async  repair() {
    let smsText =
      `शंखेश्वर ज्वेलर्स
आपली दुरुस्ती वस्तू तयार आहे. कृपया घेऊन जावे.
धन्यवाद.
    
वेळः
सकाळी 10.00 to 1.30
दुपारी 2.30 to 8.00
(शनिवारी बंद)`;
    const modal = await this.modalCtrl.create({
      component: AddSmsNumbersPage,
      componentProps: { title: 'Repair' }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data.result !== "Closed")
      this.socialSharing.shareViaSMS(smsText, data.result);
  }

  async order() {
    let smsText =
      `शंखेश्वर ज्वेलर्स

आपले ऑर्डर वस्तु तयार आहे.
कृपया घेऊन जावे.

वेळ:
10.00 to 1.30
2.30 to 8.00
#शनिवार बंद#
आमच्या येथे खरेदी करण्यासाठी धन्यवाद`;
    const modal = await this.modalCtrl.create({
      component: AddSmsNumbersPage,
      componentProps: { title: 'Order' }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data.result !== "Closed")
      this.socialSharing.shareViaSMS(smsText, data.result);
  }

  thanks() {
    let sendSMSTo: string = '';
    let smsText =
      `**Shankheshwar Jewellers**

Thank you for shopping with us!`;
    this.storage.get(this.dbBillDetails).then((val) => {
      if (val && val.length) {
        this.bills = [...val];
        let today: string = new Date().toISOString();
        let todayBills: Bill[] = this.bills.filter(element => element.customerContact.length && (element.date.substr(0, 9) === today.substr(0, 9)));
        todayBills.forEach(element => sendSMSTo += element.customerContact + ",");
        sendSMSTo = sendSMSTo.substr(0, sendSMSTo.length - 1);
        this.socialSharing.shareViaSMS(smsText, sendSMSTo);
      }
    });
  }
  /* 
    async presentActionSheet() {
      const actionSheet = await this.actionSheetController.create({
        header: 'Share via',
        buttons: [{
          text: 'SMS',
          icon: 'text',
          handler: () => {
            console.log('Delete clicked');
          }
        }, {
          text: 'Whatsapp',
          icon: 'logo-whatsapp',
          handler: () => {
            console.log('Share clicked');
          }
        }]
      });
      await actionSheet.present();
    }
   */

//  scheduled = [];

  /*  scheduleNotification() {
     this.localNotifications.schedule({
       id: 1,
       title: 'Attention',
       text: 'Simons Notification',
       data: { mydata: 'My hidden message this is' },
       //  trigger: { in: 5, unit: ELocalNotificationTriggerUnit.SECOND },
       foreground: true // Show the notification while app is open
     });
 
     // Works as well!
     // this.localNotifications.schedule({
     //   id: 1,
     //   title: 'Attention',
     //   text: 'Simons Notification',
     //   data: { mydata: 'My hidden message this is' },
     //   trigger: { at: new Date(new Date().getTime() + 5 * 1000) }
     // });
   } */

  /*   recurringNotification() {
      this.localNotifications.schedule({
        id: 22,
        title: 'Recurring',
        text: 'Simons Recurring Notification',
        trigger: { every: ELocalNotificationTriggerUnit.MINUTE }
      });
    } */

 

 /*  showAlert(header: string, sub: string, msg: string) {
    this.alertCtrl.create({
      header: header,
      subHeader: sub,
      message: msg,
      buttons: ['Ok']
    }).then(alert => alert.present());
  }

  getAll() {
    this.localNotifications.getAll().then((res: ILocalNotification[]) => {
      this.scheduled = res;
    })
  } */

  ngOnInit() {
  }

}

