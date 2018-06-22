import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {Storage} from '@ionic/storage';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';

/*
 Generated class for the AuthProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */
@Injectable()
export class AuthProvider {

    public userKey: any;
    public deviceToken: any;
    userDevices: FirebaseListObservable<any>;

    constructor(private storage: Storage, private db: AngularFireDatabase) {
        console.log('Hello AuthProvider Provider');

        this.userDevices = db.list('/user_devices', {preserveSnapshot: true});

        storage.ready().then(() => {
            storage.get('user_key').then(userKey => {
                this.userKey = userKey;
            }).catch(console.log);

            storage.get('device_token').then(deviceToken => {
                this.deviceToken = deviceToken;
            }).catch(console.log);
        });
    }

    public isAuthenticated() {
        return new Promise((resolve, reject) => {
            this.storage.ready().then(() => {
                this.storage.get('user_key').then(userKey => {
                    if (userKey)
                        resolve(userKey);
                    else
                        reject(false);
                }).catch(console.log);
            });
        });
    }

    public setDeviceToken(token) {
        return new Promise((resolve, reject) => {
            this.storage.set('device_token', token).then(() => {
                this.deviceToken = token;

                resolve(true);
            });
        });
    }

    public setToken(token) {
        return new Promise((resolve, reject) => {
            this.storage.set('user_key', token).then(() => {
                this.userKey = token;

                resolve(true);
            });
        });
    }

    public logout() {
        return new Promise((resolve, reject) => {
            this.storage.remove('user_key').then(() => {
                resolve(true);
            })
        });
    }

    public getUser() {
        return new Promise((resolve, reject) => {
            this.storage.ready().then(() => {
                this.storage.get('user').then(user => {
                    if (user)
                        resolve(user);
                    else
                        reject(false);
                }).catch(console.log);
            });
        });
    }

    public setUser(user) {
        return new Promise((resolve, reject) => {
            this.storage.set('user', user).then(() => {
                resolve(true);
            });
        });
    }

    public registerDeviceToken() {

        if (!this.userKey || !this.deviceToken) return;

        let existDevices = this.db.list('/user_devices', {
            preserveSnapshot: true,
            query: {
                orderByChild: 'userKey',
                equalTo: this.userKey,
            }
        });

        existDevices.subscribe(snapshots => {

            console.log(snapshots.length);

            if (snapshots.length == 0) {
                this.userDevices.push({
                    userKey: this.userKey,
                    device_token: this.deviceToken
                });
            }
        });
    }
}
