import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Storage } from '@ionic/storage';
import { ServiceService } from './service.service';
import { dbDataKeys } from './dbKeys';

@Injectable({
    providedIn: 'root'
})
export class InitializeGuard implements CanActivate {

    constructor(public router: Router, private storage: Storage, private service: ServiceService) { }

    async canActivate(): Promise<boolean> {
        let appInitialized = await this.storage.get(dbDataKeys.dbAppInitialized);
        let goldRate = await this.storage.get(dbDataKeys.dbGoldRate);
        let silverRate = await this.storage.get(dbDataKeys.dbSilverRate);
        let printPageSize = await this.storage.get(dbDataKeys.dbPrintPageSize);
        let voucherNo = await this.storage.get(dbDataKeys.dbVoucherNo);

        let data = []
        console.log('1');

        Object.keys(dbDataKeys).forEach(key => {
            {
                console.log('2', key, typeof key);
                this.storage.get(key.toString()).then(value => {
                    data.push(value);
                    console.log(data, value, key);
                }
                );
            }
        });
        console.log('4');

        this.storage.get(dbDataKeys.dbGoldRate).then(
            data => console.log(data, '5')

        )

        // dbDataKeys.forEach(element => {

        // });
        for (let key in dbDataKeys) {
            data.push(await this.storage.get(key));
            // let data = [await this.storage.get(dbDataKeys.dbAppInitialized),
            // await this.storage.get(dbDataKeys.dbGoldRate),
            // await this.storage.get(dbDataKeys.dbSilverRate),
            // await this.storage.get(dbDataKeys.dbPrintPageSize),
            // await this.storage.get(dbDataKeys.dbVoucherNo)]
            // console.log(data);

        }
        console.log(data);


        let newDb = await this.storage.get('newKey');

        const undefinedArray = [appInitialized, goldRate, silverRate, printPageSize, voucherNo, newDb].map(
            (ele, index) => {
                console.log(ele);
                if (!ele || ele == null) return index;
            })
        // .filter(ele => ele);

        console.log(undefinedArray);

        return true;
        // if (undefinedArray.length) {
        //     console.log('here');

        //     await this.storage.remove(dbAppInitialized);
        //     console.log('3');

        //     this.router.navigate(['intro']);
        //     return false;
        // } else {
        //     console.log('2')
        //     return true;
        // }
    }
}