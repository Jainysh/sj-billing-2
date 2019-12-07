import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Storage } from '@ionic/storage';
import { ServiceService } from './service.service';

@Injectable({
    providedIn: 'root'
})
export class InitializeGuard implements CanActivate {
    dbAppInitialized: string = 'isAppInitialized';

    constructor(public router: Router, private storage: Storage, private service: ServiceService) { }

    async canActivate(): Promise<boolean> {
        let val = await this.storage.get(this.dbAppInitialized);
        if (!val || val !== 'yes') {
            this.router.navigate(['intro']);
            return false;
        } else {
            return true;
        }
    }
}