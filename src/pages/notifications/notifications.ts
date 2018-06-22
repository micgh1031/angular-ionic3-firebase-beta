import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {PushServiceProvider} from "../../providers/push-service/push-service"
import {LoadingController, Loading} from 'ionic-angular';
import {AuthProvider} from '../../providers/auth/auth';

/**
 * Generated class for the NotificationsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-notifications',
    templateUrl: 'notifications.html',
})
export class NotificationsPage {

    loading: Loading;
    notifications: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, private pushService: PushServiceProvider, private loadingCtrl: LoadingController, private auth: AuthProvider) {
        this.notifications = [];
    }

    ionViewDidEnter() {
        this.loading = this.loadingCtrl.create();
        this.loading.present();

        this.pushService.getNotifiactionList().then(res => {
            this.loading.dismiss();
            console.log(res);
            let notifications = res['data'];
            let device_notifications = [];
            this.notifications = [];
            for (let i = 0; i < notifications.length; i ++) {
                let notification = notifications[i];
                console.log(notification);
                if (typeof notification.config.tokens == "undefined") continue;
                if (notification.config.tokens.indexOf(this.auth.deviceToken) >= 0) {
                    device_notifications.push(notification);
                }
            }
            let notiFlag = {};
            for (let i = device_notifications.length - 1; i >= 0; i --) {
                let notification = device_notifications[i];
                let payload = notification.config.notification.payload;
                if (typeof notiFlag[payload.typeKey] == "undefined") {
                    this.notifications.splice(0, 0, notification);
                    notiFlag[payload.typeKey] = true;
                }
            }
        }).catch(err => {
            this.loading.dismiss();
            console.log(err);
        })
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad NotificationsPage');
    }

    viewNotification(notification) {
        let payload = notification.config.notification.payload;
        if (payload.type == "request") {
            this.navCtrl.push('MaintenanceTrackerPage', {requestKey: payload.typeKey});
        }
    }
}
