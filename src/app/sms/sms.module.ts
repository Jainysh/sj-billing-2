import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AddSmsNumbersPage } from '../add-sms-numbers/add-sms-numbers.page';
import { IonicModule } from '@ionic/angular';

import { SmsPage } from './sms.page';

const routes: Routes = [
  {
    path: '',
    component: SmsPage
  }
];

@NgModule({
    entryComponents: [
      AddSmsNumbersPage
    //AddSmsNumbersPageModule
  ],
  declarations: [SmsPage, AddSmsNumbersPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    
  //  AddSmsNumbersPageModule,
  ],
  exports: [SmsPage]

})
export class SmsPageModule { }
