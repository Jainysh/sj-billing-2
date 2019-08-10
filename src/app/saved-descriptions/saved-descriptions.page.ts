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
    this.savedDescriptions = [
      { id: 0, category: 'Gold', description: 'Ring Ladies' },
      { id: 1, category: 'Gold', description: 'Ring Gents' },
      { id: 2, category: 'Gold', description: 'Mangalsutra Short' },
      { id: 3, category: 'Gold', description: 'Mangalsutra Long' },
      { id: 4, category: 'Gold', description: 'Ring Barsa' },
      { id: 5, category: 'Gold', description: 'Badam' },
      { id: 6, category: 'Gold', description: 'Locket' },
      { id: 7, category: 'Gold', description: 'Pendent' },
      { id: 8, category: 'Gold', description: 'Bali' },
      { id: 9, category: 'Gold', description: 'Dul' },
      { id: 10, category: 'Gold', description: 'Tops' },
      { id: 11, category: 'Gold', description: 'Ringa/ Ringa Fancy' },
      { id: 12, category: 'Gold', description: 'Latkan' },
      { id: 13, category: 'Gold', description: 'Kanvel' },
      { id: 14, category: 'Gold', description: 'Chain' },
      { id: 15, category: 'Gold', description: 'Ringa Stone' },
      { id: 16, category: 'Gold', description: 'Necklace' },
      { id: 17, category: 'Gold', description: 'Ranihar' },
      { id: 18, category: 'Gold', description: 'Thushi' },
      { id: 19, category: 'Gold', description: 'Mani' },
      { id: 20, category: 'Gold', description: 'Mani Lakhi' },
      { id: 21, category: 'Gold', description: 'Mugwat' },
      { id: 22, category: 'Gold', description: 'Nath' },
      { id: 23, category: 'Gold', description: 'Bormal' },
      { id: 24, category: 'Gold', description: 'Bracelet Gents' },
      { id: 25, category: 'Gold', description: 'Bracelet Ladies' },
      { id: 26, category: 'Gold', description: 'Laxmihar' },
      { id: 27, category: 'Gold', description: 'Zuba Gold' },
      { id: 28, category: 'Gold', description: 'Zuba Coimatur Fancy' },
      { id: 29, category: 'Gold', description: 'Shimpla' },
      { id: 30, category: 'Gold', description: 'Vati set' },
      { id: 31, category: 'Gold', description: 'Braslet Baccha' },
      { id: 32, category: 'Gold', description: 'Bindlya' },
      { id: 33, category: 'Gold', description: 'Panadi Gadha Jod' },
      { id: 34, category: 'Gold', description: 'Kanpatti' },
      { id: 35, category: 'Gold', description: 'Chowki' },
      { id: 36, category: 'Gold', description: 'Mudi Jod' },
      { id: 37, category: 'Gold', description: 'Kesvel' },
      { id: 38, category: 'Gold', description: 'Bilver' },
      { id: 39, category: 'Gold', description: 'Patali' },
      { id: 40, category: 'Gold', description: 'Bilver Patali Set' },
      { id: 41, category: 'Gold', description: 'Kangan' },
      { id: 42, category: 'Gold', description: 'Bugadi' },
      { id: 43, category: 'Silver', description: 'Payal' },
      { id: 44, category: 'Silver', description: 'Jodavi' },
      { id: 45, category: 'Silver', description: 'Bichua' },
      { id: 46, category: 'Silver', description: 'Braslet' },
      { id: 47, category: 'Silver', description: 'Bindlya' },
      { id: 48, category: 'Silver', description: 'Kardora' },
      { id: 49, category: 'Silver', description: 'Kada' },
      { id: 50, category: 'Silver', description: 'Samayi' },
      { id: 51, category: 'Silver', description: 'Karanda' },
      { id: 52, category: 'Silver', description: 'Dabba' },
      { id: 53, category: 'Silver', description: 'Fulpatra' },
      { id: 54, category: 'Silver', description: 'Karanda Plate' },
      { id: 55, category: 'Silver', description: 'Jod Kamal' },
      { id: 56, category: 'Silver', description: 'Bowl Set' },
      { id: 57, category: 'Silver', description: 'Chamcha' },
      { id: 58, category: 'Silver', description: 'Glass' },
      { id: 59, category: 'Silver', description: 'Murti Ganesha' },
      { id: 60, category: 'Silver', description: 'Murti Laxmi' },
      { id: 61, category: 'Silver', description: 'Murti Annapurna' },
      { id: 62, category: 'Silver', description: 'Kalas Gindi' },
      { id: 63, category: 'Silver', description: 'Panzari' },
      { id: 64, category: 'Silver', description: 'Naral' },
      { id: 65, category: 'Silver', description: 'Niranjan' },
      { id: 66, category: 'Silver', description: 'Ghee Loti' },
      { id: 67, category: 'Silver', description: 'Kajal Dabi' },
      { id: 68, category: 'Silver', description: 'Attardani' },
      { id: 69, category: 'Silver', description: 'Gulabdani' },
      { id: 70, category: 'Silver', description: 'Dhup Stand' },
      { id: 71, category: 'Silver', description: 'Haar' },
      { id: 72, category: 'Silver', description: 'Masole' },
      { id: 73, category: 'Silver', description: 'Jodavi Fancy' },
      { id: 74, category: 'Silver', description: 'Bracelet Baccha' },
      { id: 75, category: 'Silver', description: 'Pan Naral' },
      { id: 76, category: 'Silver', description: 'Aarti Set' },
      { id: 77, category: 'Silver', description: 'Plate' },
      { id: 78, category: 'Silver', description: 'Plate Pure (T-100)' },
      { id: 79, category: 'Silver', description: 'Lota Plain' },
      { id: 80, category: 'Silver', description: 'Lota Design' },
      { id: 81, category: 'Silver', description: 'Chain' },
      { id: 82, category: 'Silver', description: 'Mukhvata' },
      { id: 83, category: 'Silver', description: 'Ghoda' },
      { id: 84, category: 'Silver', description: 'Gayvasaru' },
      { id: 85, category: 'Silver', description: 'Gulgudagi' },
      { id: 86, category: 'Silver', description: 'Bal Krishna' },
      { id: 87, category: 'Silver', description: 'Koyari' },
      { id: 88, category: 'Silver', description: 'Kasav Dabi' },
      { id: 89, category: 'Silver', description: 'Kamal' },
      { id: 90, category: 'Silver', description: 'Chatra' },
      { id: 91, category: 'Silver', description: 'Anklet' },
      { id: 92, category: 'Silver', description: 'Ring' },
      { id: 93, category: 'Silver', description: 'Ringa' },
      { id: 94, category: 'Silver', description: 'Pendent' },
      { id: 95, category: 'Silver', description: 'Tode Vale' },
      { id: 96, category: 'Silver', description: 'Challa' },
      { id: 97, category: 'Silver', description: 'Mekala' },
      { id: 98, category: 'Silver', description: 'Ghanti' }
    ]
    this.storage.set(this.dbSavedDescriptions, this.savedDescriptions).then(
      val => { console.log(val); this.mapValues(val) }
    )
  }
  ngOnInit() {
    this.storage.get(this.dbSavedDescriptions).then(
      val => {
        this.mapValues(val);
      }
    ).catch(error => this.service.presentToast('Error getting list' + error))
  }

}
