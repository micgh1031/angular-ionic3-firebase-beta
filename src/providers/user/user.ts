import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {AngularFireDatabase} from 'angularfire2/database';
import {NetworkServiceProvider} from '../network-service/network-service';
import {Storage} from '@ionic/storage';

/*
 Generated class for the UserProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */
@Injectable()
export class UserProvider {

    constructor(public http: Http, private db: AngularFireDatabase, private networkService: NetworkServiceProvider, private storage: Storage) {
        console.log('Hello UserProvider Provider');
    }

    private updateStorageUsers(users) {
        this.storage.get('users').then(storageUsers => {
            if (!storageUsers) storageUsers = {};
            for (let i = 0; i < users.length; i ++ ) {
                storageUsers[users[i]['$id']] = users[i];
            }
            this.storage.set('offices', storageUsers);
        });
    }

    officeEmployees(officeId) {

        return new Promise((resolve, reject) => {
            if (this.networkService.noConnection()) {
                this.storage.get('users').then(storageUsers => {
                    if (storageUsers) {
                        let userIds = Object.keys(storageUsers);
                        let renter = {};
                        let owner = {};
                        let employees = [];
                        for (let i = 0; i < userIds.length; i ++) {
                            let user = storageUsers[userIds[i]];
                            if (user.officeKey == officeId) {
                                if (user.level == 3.1) {
                                    owner = user;
                                }else if (user.level == 3.2) {
                                    renter = user;
                                }else if (user.level == 4) {
                                    employees.push(user);
                                }
                            }
                        }
                        resolve({owner: owner, renter: renter, employees: employees});
                    } else {
                        resolve({owner: {}, renter: {}, employees: []});
                    }
                }).catch(console.log);
            }else {
                let users = this.db.list('/users',  {
                    preserveSnapshot: true,
                    query: {
                        orderByChild: 'officeKey',
                        equalTo: officeId
                    }
                });

                let owner = {};
                let renter = {};
                let dbUsers = [];
                let employees = [];

                users.subscribe(snapshots => {

                    snapshots.forEach(snapshot => {
                        console.log(snapshot.key);
                        console.log(snapshot.val());

                        let user = snapshot.val();
                        user.$id = snapshot.key;

                        if (user.level == 3.1) {
                            owner = user;
                        }else if (user.level == 3.2) {
                            renter = user;
                        }else if (user.level == 4) {
                            employees.push(user);
                        }
                        dbUsers.push(user);
                    });

                    this.updateStorageUsers(users);
                    resolve({owner: owner, renter: renter, employees: employees});
                });
            }
        });
    }

    getUser(userId) {
        return new Promise((resolve, reject) => {
            if (this.networkService.noConnection()) {
                this.storage.get('users').then(storageUsers => {
                    if (storageUsers) {
                        let user = storageUsers[userId];
                        resolve(user);
                    } else {
                        resolve(false);
                    }
                }).catch(console.log);
            }else {
                let dbUsers = this.db.list('/users',  {
                    preserveSnapshot: true,
                    query: {
                        orderByKey: true,
                        equalTo: userId
                    }
                });

                dbUsers.subscribe(snapshots => {

                    snapshots.forEach(snapshot => {
                        console.log(snapshot.key);
                        console.log(snapshot.val());

                        let user = snapshot.val();
                        user['$id'] = snapshot.key;

                        this.updateStorageUsers([user]);

                        resolve(user);
                    });
                });
            }
        });
    }
}
