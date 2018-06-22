import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {AngularFireDatabase} from 'angularfire2/database';
import {NetworkServiceProvider} from '../network-service/network-service';
import {Storage} from '@ionic/storage';

/*
 Generated class for the OfficeProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */
@Injectable()
export class OfficeProvider {

    constructor(public http: Http, private db: AngularFireDatabase, private networkService: NetworkServiceProvider, private storage: Storage) {
        console.log('Hello OfficeProvider Provider');
    }

    private updateStorageOffices(offices) {
        this.storage.get('offices').then(storageOffices => {
            if (!storageOffices) storageOffices = {};
            for (let i = 0; i < offices.length; i ++ ) {
                storageOffices[offices[i]['$id']] = offices[i];
            }
            this.storage.set('offices', storageOffices);
        });
    }

    buildingOffices(buildingId, floorId) {

        return new Promise((resolve, reject) => {
            if (this.networkService.noConnection()) {
                this.storage.get('offices').then(storageOffices => {
                    if (storageOffices) {
                        let officeIds = Object.keys(storageOffices);
                        let offices = [];
                        for (let i = 0; i < officeIds.length; i ++) {
                            let office = storageOffices[officeIds[i]];
                            if (office.buildingId == buildingId) {
                                if (floorId) {
                                    if (office.floorId != floorId) continue;
                                    offices.push(office);
                                }
                            }
                        }
                        resolve(offices);
                    } else {
                        resolve([]);
                    }
                }).catch(console.log);
            }else {
                let db_offices = this.db.list('/offices', {
                    preserveSnapshot: true,
                    query: {
                        orderByChild: 'buildingId',
                        equalTo: buildingId
                    }
                });

                let offices = [];

                db_offices.subscribe(snapshots => {

                    snapshots.forEach(snapshot => {
                        console.log(snapshot.key);
                        console.log(snapshot.val());

                        let office = snapshot.val();
                        office['$id'] = snapshot.key;

                        if (floorId) {
                            if (floorId != office['floorId']) {
                                return;
                            }
                        }
                        offices.push(office);
                    });

                    this.updateStorageOffices(offices);

                    resolve(offices);
                });
            }
        });
    }

    getOffice(officeId) {
        return new Promise((resolve, reject) => {
            if (this.networkService.noConnection()) {
                this.storage.get('offices').then(storageOffices => {
                    if (storageOffices) {
                        let office = storageOffices[officeId];
                        resolve(office);
                    } else {
                        resolve(false);
                    }
                }).catch(console.log);
            }else {
                let db_offices = this.db.list('/offices', {
                    preserveSnapshot: true,
                    query: {
                        orderByKey: true,
                        equalTo: officeId
                    }
                });

                db_offices.subscribe(snapshots => {

                    snapshots.forEach(snapshot => {
                        console.log(snapshot.key);
                        console.log(snapshot.val());

                        let office = snapshot.val();
                        office['$id'] = snapshot.key;

                        this.updateStorageOffices([office]);

                        resolve(office);
                    });
                });
            }
        });
    }

}
