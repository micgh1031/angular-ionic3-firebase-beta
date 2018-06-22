import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ItemSliding} from 'ionic-angular';
import {AngularFireDatabase} from 'angularfire2/database';
import {LoadingController, Loading} from 'ionic-angular';
import {BuildingProvider} from '../../providers/building/building';
import {CommonProvider} from '../../providers/common/common';
import {NetworkServiceProvider} from '../../providers/network-service/network-service';
import {OfficeProvider} from '../../providers/office/office';
import {UserProvider} from '../../providers/user/user';

/**
 * Generated class for the OfficeProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-office-profile',
    templateUrl: 'office-profile.html',
})
export class OfficeProfilePage {

    loading: Loading;
    officeId: any;
    office: any;
    employee: any;
    employees: any;
    owner: any;
    renter: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, private db: AngularFireDatabase, private loadingCtrl: LoadingController, private buildingService: BuildingProvider, private common: CommonProvider, private networkService: NetworkServiceProvider, private officeProvider: OfficeProvider, private userProvider: UserProvider) {
        this.officeId = navParams.get('officeId');
        this.office = {};
        this.owner = {};
        this.renter = {};
        this.employee = {};
        this.employees = [];
    }

    ionViewDidEnter() {
        this.loading = this.loadingCtrl.create();
        this.loading.present();

        this.officeProvider.getOffice(this.officeId).then(office => {
            this.loading.dismiss();
            if (office) {
                this.office = office;

                let buildings = this.buildingService.list();
                for (let i = 0; i < buildings.length; i ++) {
                    if (buildings[i].id == this.office.buildingId) {
                        this.office.buildingName = buildings[i].name;

                        for (let j = 0; j < buildings[i].floors.length; j ++) {
                            if (this.office.floorId == buildings[i].floors[j].id) {
                                this.office.floorName = buildings[i].floors[j].name;
                            }
                        }
                    }
                }
            }else {
                this.networkService.showNetworkAlert();
            }
        });

        this.loadEmployees();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad OfficeProfilePage');
    }

    private loadEmployees() {
        this.employees = [];

        this.userProvider.officeEmployees(this.officeId).then(res => {
            this.owner = res['owner'];
            this.renter = res['renter'];
            this.employees = res['employees'];
        });
    }

    public updateOffice() {
        if (this.networkService.noConnection()) {
            this.networkService.showNetworkAlert();
        }else {
            let office = this.db.object('/offices/'+this.officeId);

            office.update({
                is_rented: this.office.is_rented
            });

            this.common.showAlert('Office updated successfully!');
        }
    }

    public editEmployee(employee, slidingItem: ItemSliding) {
        slidingItem.close();
        this.navCtrl.push('EmployeeProfilePage', {employeeId: employee.$id})
    }

    public createEmployee() {
        this.navCtrl.push('CreateEmployeePage', {officeId: this.officeId});
    }
}
