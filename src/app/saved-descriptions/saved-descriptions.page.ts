import { Component, OnInit } from '@angular/core';
import { SavedDescription } from '../data-model';
import { Storage } from '@ionic/storage';
import { ServiceService } from '../service.service';

@Component({
  selector: 'app-saved-descriptions',
  templateUrl: './saved-descriptions.page.html',
  styleUrls: ['./saved-descriptions.page.scss'],
})


export class SavedDescriptionsPage implements OnInit {

  goldItems: SavedDescription[] = [];
  silverItems: SavedDescription[] = [];
  savedDescriptions: SavedDescription[] = [];

  dbSavedDescriptions: string = 'savedDescriptions';

  newGoldItem: string = '';
  newSilverItem: string = '';

  constructor(private storage: Storage, private service: ServiceService) {
  }

  addDescription(category: string) {
    this.savedDescriptions.push({ id: this.savedDescriptions.length, category: category, description: category === 'Gold' ? this.newGoldItem : this.newSilverItem })
    category === 'Gold' ? this.newGoldItem = '' : this.newSilverItem = '';
    this.storage.set(this.dbSavedDescriptions, this.savedDescriptions).then(
      val => this.mapValues(val)
    )
  }

  removeDescription(description: SavedDescription) {
    this.savedDescriptions.splice(this.savedDescriptions.indexOf(description), 1);
    this.storage.set(this.dbSavedDescriptions, this.savedDescriptions).then(
      val => this.mapValues(val)
    )
  }

  mapValues(savedDescriptions) {
    this.savedDescriptions = savedDescriptions;
    this.goldItems = this.savedDescriptions.filter(element => element.category === 'Gold');
    this.silverItems = this.savedDescriptions.filter(element => element.category === 'Silver');
  }

  resetDefaultSettings() {
    this.savedDescriptions = this.service.getDefaultSavedDescriptions();
    this.storage.set(this.dbSavedDescriptions, this.savedDescriptions).then(
      val => { this.mapValues(val) }
    )
  }
  ngOnInit() {
    this.storage.get(this.dbSavedDescriptions).then(
      val => {
        if (val) this.mapValues(val);
      }
    ).catch(error => this.service.presentToast('Error getting list' + error))
  }

}
