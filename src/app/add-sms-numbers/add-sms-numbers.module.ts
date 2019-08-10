import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddSmsNumbersPage } from './add-sms-numbers.page';

const routes: Routes = [
  {
    path: '',
    component: AddSmsNumbersPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
 // declarations: [AddSmsNumbersPage]
})
export class AddSmsNumbersPageModule {}
