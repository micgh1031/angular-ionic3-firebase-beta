import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, Events} from 'ionic-angular';
import {AuthProvider} from '../../providers/auth/auth';
import {AngularFireDatabase} from 'angularfire2/database';
import {LoadingController, Loading} from 'ionic-angular';

/**
 * Generated class for the MaintenanceViewPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-maintenance-view',
    templateUrl: 'maintenance-view.html',
})
export class MaintenanceViewPage {

    user: any;
    userKey: any;
    officeKey: any;
    requests: any;
    openedRequests: any;
    closedRequests: any;
    loading: Loading;

    constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthProvider, private db: AngularFireDatabase, private loadingCtrl: LoadingController, private events: Events) {
        this.user = {
            level: 4
        };
        this.auth.getUser().then(user => {
            this.user = user;
            this.userKey = user['id'];
            this.officeKey = user['officeKey'];
        });
        this.requests = [];
        this.openedRequests = [];
        this.closedRequests = [];

        this.events.subscribe('user:signin', (requestKey) => {
            this.navCtrl.push('MaintenanceTrackerPage', {requestKey: requestKey});
        });
    }

    ionViewDidEnter() {
        if (this.user.level == 4) {
            this.loadRequestByUser();
        }else {
            this.loadRequestByOffice();
        }
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad MaintenanceViewPage');
    }

    private loadRequestByOffice() {
        this.loading = this.loadingCtrl.create();
        this.loading.present();
        this.requests = [];
        this.openedRequests = [];
        this.closedRequests = [];

        let requests = this.db.list('/maintenance_requests',  {
            preserveSnapshot: true,
            query: {
                orderByChild: 'officeKey',
                equalTo: this.officeKey
            }
        });

        requests.subscribe(snapshots => {

            this.loading.dismiss();

            this.requests = [];
            this.openedRequests = [];
            this.closedRequests = [];

            snapshots.forEach(snapshot => {
                console.log(snapshot.key);
                console.log(snapshot.val());

                let request = snapshot.val();
                request.$id = snapshot.key;

                if (request.step >= 5) {
                    this.closedRequests.push(request);
                }else {
                    this.openedRequests.push(request);
                }

                this.requests.push(request);
            });
        });
    }

    private loadRequestByUser() {
        this.loading = this.loadingCtrl.create();
        this.loading.present();
        this.requests = [];
        this.openedRequests = [];
        this.closedRequests = [];

        let requests = this.db.list('/maintenance_requests',  {
            preserveSnapshot: true,
            query: {
                orderByChild: 'userKey',
                equalTo: this.userKey
            }
        });

        requests.subscribe(snapshots => {

            this.loading.dismiss();
            this.requests = [];

            snapshots.forEach(snapshot => {
                console.log(snapshot.key);
                console.log(snapshot.val());

                let request = snapshot.val();
                request.$id = snapshot.key;

                if (request.step >= 5) {
                    this.closedRequests.push(request);
                }else {
                    this.openedRequests.push(request);
                }

                this.requests.push(request);
            });
        });
    }

    public createNewRequest() {
        this.navCtrl.push('OtrsRequestPage');
    }

    public viewRequest(request) {
        this.navCtrl.push('MaintenanceTrackerPage', {requestKey: request.$id});
    }
}
