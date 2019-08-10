import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-sms-numbers',
  templateUrl: './add-sms-numbers.page.html',
  styleUrls: ['./add-sms-numbers.page.scss'],
})
export class AddSmsNumbersPage {
  @Input() title: string;

  newNumber: string = "";
  contactList: string[] = [];
  constructor(public modalCtrl: ModalController) {
  }

  closeModal() {
    this.modalCtrl.dismiss({
      'result' : 'Closed'
    });
  }

  addNumber() {
    this.contactList.push(this.newNumber);
    this.newNumber = ""
  }

  removeContact(contact) {
    this.contactList.splice(this.contactList.indexOf(contact), 1)
  }


  sendSMS() {
    let sendSMSTo = '';
    this.contactList.forEach(element => sendSMSTo += element + ",");
    sendSMSTo = sendSMSTo.substr(0, sendSMSTo.length - 1);
    this.modalCtrl.dismiss({
      'result': sendSMSTo
    })
  }
}
