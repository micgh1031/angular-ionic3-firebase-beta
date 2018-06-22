import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import {CommonProvider} from '../../providers/common/common';
import {LoadingController, Loading} from 'ionic-angular';

/**
 * Generated class for the SignupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-signup',
    templateUrl: 'signup.html',
})
export class SignupPage {

    user = {
        name: '',
        email: '',
        password: '',
        level: 3
    };
    loading: Loading;
    users: FirebaseListObservable<any>;
    isSignup: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, private db: AngularFireDatabase, private common: CommonProvider, private loadingCtrl: LoadingController) {
        this.users = db.list('/users', {preserveSnapshot: true});
        this.isSignup = false;
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SignupPage');
    }

    public doSignUp() {
        this.isSignup = true;
        this.users.push(this.user).then(res => {
            console.log(res);
            this.common.showAlert('Your account is created successfully!');
            this.navCtrl.pop();
        })
    }

    public checkUser() {
        this.loading = this.loadingCtrl.create();
        this.loading.present();

        let existUsers = this.db.list('/users', {
            preserveSnapshot: true,
            query: {
                orderByChild: 'email',
                equalTo: this.user.email
            }
        });

        existUsers.subscribe(snapshots => {

            if (this.isSignup) return;

            this.loading.dismiss();

            console.log(snapshots.length);

            snapshots.forEach(snapshot => {
                console.log(snapshot.key);
                console.log(snapshot.val());
            });

            if (snapshots.length > 0) {
                this.common.showAlert('Email is already exist!');
            }else {
                this.doSignUp();
            }
        });

    }
}
