import {Injectable} from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {AngularFireDatabase} from 'angularfire2/database';

/*
 Generated class for the PushServiceProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */
@Injectable()
export class PushServiceProvider {

    public authOpt: RequestOptions;
    private PUSH_CREATE_URL = 'https://api.ionic.io/push/notifications';

    constructor(public http: Http, private db: AngularFireDatabase) {
        console.log('Hello PushServiceProvider Provider');

        let myHeaders: Headers = new Headers;
        myHeaders.set('Authorization', "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwMjdmMjU2NC0wMGYzLTRkMGMtYTFjOS0zYTVhNzVjOGQzN2YifQ.mWF9QvbohsVsRGjuyyCeU79pDd3Xmn9bKWMDH_uL22A");
        myHeaders.set('Content-Type', 'application/json');
        this.authOpt = new RequestOptions({
            headers: myHeaders,
        });
    }

    public notiBuildingManagerForRequest(requestId, message) {
        let buildingManagers = this.db.list('/users', {
            preserveSnapshot: true,
            query: {
                orderByChild: 'level',
                equalTo: 7,
            }
        });

        buildingManagers.subscribe(snapshots => {

            console.log(snapshots.length);

            snapshots.forEach(snapshot => {
                console.log(snapshot.key);
                console.log(snapshot.val());

                let userDevices = this.db.list('/user_devices', {
                    preserveSnapshot: true,
                    query: {
                        orderByChild: 'userKey',
                        equalTo: snapshot.key,
                    }
                });

                userDevices.subscribe(snapshots => {

                    console.log(snapshots.length);

                    snapshots.forEach(snapshot => {
                        console.log(snapshot.key);
                        console.log(snapshot.val());

                        let userDevice = snapshot.val();
                        let pushData = {
                            "tokens": [userDevice['device_token']],
                            "profile": "test_push",
                            "notification": {
                                "message": message,
                                "payload": {
                                    "type": "request",
                                    "typeKey": requestId
                                }
                            }
                        };

                        this.http.post(this.PUSH_CREATE_URL, pushData, this.authOpt).map(res => res.json()).subscribe(
                            data => {
                                console.log('Notification sent successfully!');
                            },
                            err => {
                                console.log('Notification sending error!');
                            },
                            () => console.log('Create Notification')
                        );
                    });
                });
            });
        });
    }

    public notiUserForRequest(userId, requestId, message) {
        let userDevices = this.db.list('/user_devices', {
            preserveSnapshot: true,
            query: {
                orderByChild: 'userKey',
                equalTo: userId,
            }
        });

        userDevices.subscribe(snapshots => {

            console.log(snapshots.length);

            snapshots.forEach(snapshot => {
                console.log(snapshot.key);
                console.log(snapshot.val());

                let userDevice = snapshot.val();
                let pushData = {
                    "tokens": [userDevice['device_token']],
                    "profile": "test_push",
                    "notification": {
                        "message": message,
                        "payload": {
                            "type": "request",
                            "typeKey": requestId
                        }
                    }
                };

                this.http.post(this.PUSH_CREATE_URL, pushData, this.authOpt).map(res => res.json()).subscribe(
                    data => {
                        console.log('Notification sent successfully!');
                    },
                    err => {
                        console.log('Notification sending error!');
                    },
                    () => console.log('Create Notification')
                );
            });
        });
    }


    public getNotifiactionList() {
        return new Promise((resolve, reject) => {
            this.http.get(this.PUSH_CREATE_URL, this.authOpt).map(res => res.json()).subscribe(
                data => {
                    console.log(data);
                    resolve(data);
                },
                err => {
                    reject(false);
                },
                () => console.log('Get Notification List')
            );
        });
    }
}
