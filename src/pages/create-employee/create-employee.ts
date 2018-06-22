import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AngularFireDatabase} from 'angularfire2/database';
import {LoadingController, Loading} from 'ionic-angular';
import {CommonProvider} from '../../providers/common/common';
import {NetworkServiceProvider} from '../../providers/network-service/network-service';

/**
 * Generated class for the CreateEmployeePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-create-employee',
    templateUrl: 'create-employee.html',
})
export class CreateEmployeePage {

    employee: any;
    loading: Loading;
    isConnected: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, private db: AngularFireDatabase, private loadingCtrl: LoadingController, private common: CommonProvider, private networkSerivce: NetworkServiceProvider) {
        this.employee = {
            first_name: '',
            last_name: '',
            password: this.makePassword(),
            phone_number: '',
            email: '',
            level: 4,  // Office Employee + Assigned Access
            blood_type: '',
            officeKey: navParams.get('officeId'),
            can_create_employee: false,
            can_pre_authorize: false,
            can_maintenance: false,
            can_mail_view: false,
        };
        this.isConnected = true;
    }

    ionViewDidEnter() {
        this.isConnected = !this.networkSerivce.noConnection();
        if (this.networkSerivce.noConnection()) {
            this.networkSerivce.showNetworkAlert();
        }
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad CreateEmployeePage');
    }

    private makePassword() {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    public createEmployee() {

        this.loading = this.loadingCtrl.create();
        this.loading.present();


        let employees = this.db.list('/users', {preserveSnapshot: true});
        console.log(this.employee);
        employees.push(this.employee).then(_ => {
            this.loading.dismiss();
            this.common.showAlert('Employee created successfully!');
            this.navCtrl.pop();
        })
    }
}
