import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {BuildingProvider} from '../../providers/building/building';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import {CommonProvider} from '../../providers/common/common';
import {LoadingController, Loading} from 'ionic-angular';
import {NetworkServiceProvider} from '../../providers/network-service/network-service';

/**
 * Generated class for the CreateOfficePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-create-office',
    templateUrl: 'create-office.html',
})
export class CreateOfficePage {

    buildings: any;
    floors: any;
    office: any;
    loading: Loading;
    offices: FirebaseListObservable<any>;
    owner: any;
    renter: any;
    phoneMask: any;
    isConnected: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, private buildingService: BuildingProvider, private db: AngularFireDatabase, private common: CommonProvider, private loadingCtrl: LoadingController, private networkService: NetworkServiceProvider) {
        this.offices = this.db.list('/offices', {preserveSnapshot: true});
        this.phoneMask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
        this.isConnected = true;
        this.init();
    }

    ionViewDidEnter() {
        this.isConnected = !this.networkService.noConnection();
        if (this.networkService.noConnection()) {
            this.networkService.showNetworkAlert();
        }
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad CreateOfficePage');
    }

    private init() {
        this.buildings = this.buildingService.list();
        this.floors = this.buildings[0].floors;
        this.office = {
            name: '',
            buildingId: 1,
            floorId: 1,
            company: '',
            area: '',
            garages: '',
            coPay: '',
            is_rented: false,
            employees: {}
        };
        this.owner = {
            first_name: '',
            last_name: '',
            phone_number: '',
            email: '',
            level: 3.1, // Office Renter (Owner)
            password: this.makePassword(),
            blood_type: '',
            officeKey: ''
        };
        this.renter = {
            first_name: '',
            last_name: '',
            phone_number: '',
            email: '',
            level: 3.2, // Office Renter (Owner)
            password: this.makePassword(),
            blood_type: '',
            officeKey: ''
        }
    }

    private makePassword() {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    public updateFloors() {
        for (let i = 0; i < this.buildings.length; i ++) {
            if (this.buildings[i].id == this.office.buildingId) {
                this.floors = this.buildings[i].floors;
                break;
            }
        }
    }

    public createOffice() {
        this.loading = this.loadingCtrl.create();
        this.loading.present();
        this.offices.push(this.office).then(res => {
            console.log(res);
            let officeKey = "";
            if (!res.path.o) {
                officeKey = res.path.pieces_[1];
            }else {
                officeKey = res.path.o[1];
            }
            console.log(officeKey);
            this.owner.officeKey = officeKey;
            this.renter.officeKey = officeKey;
            let users = this.db.list('/users', {preserveSnapshot: true});
            users.push(this.owner);
            users.push(this.renter);

            this.loading.dismiss();
            this.common.showAlert('Office is created successfully!');
            this.navCtrl.pop();
        })
    }
}
