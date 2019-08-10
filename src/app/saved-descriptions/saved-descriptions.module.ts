import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SavedDescriptionsPage } from './saved-descriptions.page';

const routes: Routes = [
  {
    path: '',
    component: SavedDescriptionsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SavedDescriptionsPage]
})
export class SavedDescriptionsPageModule {}
