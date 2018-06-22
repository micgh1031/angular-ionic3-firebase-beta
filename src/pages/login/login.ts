import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import {LoadingController, Loading, Events} from 'ionic-angular';
import {CommonProvider} from '../../providers/common/common';
import {AuthProvider} from '../../providers/auth/auth';
import {HomePage} from '../home/home';

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {

    user = {
        email: '',
        password: ''
    };
    loading: Loading;
    users: FirebaseListObservable<any>;

    constructor(public navCtrl: NavController, public navParams: NavParams, private db: AngularFireDatabase, private loadingCtrl: LoadingController, private common: CommonProvider, private auth: AuthProvider, public events: Events) {
        this.users = db.list('/users');
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad LoginPage');
    }

    public signUp() {
        this.navCtrl.push('SignupPage');
    }

    public doLogin() {
        this.loading = this.loadingCtrl.create();
        this.loading.present();

        let existUsers = this.db.list('/users', {
            preserveSnapshot: true,
            query: {
                orderByChild: 'email',
                equalTo: this.user.email,
            }
        });

        existUsers.subscribe(snapshots => {

            this.loading.dismiss();

            console.log(snapshots.length);

            if (snapshots.length > 0) {
                snapshots.forEach(snapshot => {
                    console.log(snapshot.key);
                    console.log(snapshot.val());
                    let user = snapshot.val();
                    user.id = snapshot.key;

                    if (user.password != this.user.password) {
                        this.common.showAlert('Your credential is incorrect!');
                    }else {
                        this.auth.setUser(user).then((res) => {
                            this.events.publish('user:signin');
                        });

                        this.auth.setToken(snapshot.key).then((result) => {
                            this.auth.registerDeviceToken();
                            this.navCtrl.setRoot(HomePage);
                        });
                    }
                });
            }else {
                this.common.showAlert('Your credential is incorrect!');
            }
        });
    }
}
