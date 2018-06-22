import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ItemSliding} from 'ionic-angular';
import {BuildingProvider} from '../../providers/building/building';
import {LoadingController, Loading} from 'ionic-angular';
import {OfficeProvider} from '../../providers/office/office';

/**
 * Generated class for the BuildingProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-building-profile',
    templateUrl: 'building-profile.html',
})
export class BuildingProfilePage {

    building: any;
    buildingId: any;
    offices: any;
    loading: Loading;
    floorId: any;
    floor: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, private buildingService: BuildingProvider, private loadingCtrl: LoadingController, private officeProvider: OfficeProvider) {
        this.buildingId = navParams.get('buildingId');
        this.floorId = navParams.get('floorId');
        let buildings = this.buildingService.list();
        this.building = {
            name: ''
        };
        this.floor = {
            name: ''
        };
        for (let i = 0; i < buildings.length; i ++) {
            if (buildings[i].id == this.buildingId) {
                this.building = buildings[i];
                break;
            }
        }
        if (this.floorId) {
            for (let i = 0; i < this.building.floors.length; i ++) {
                if (this.building.floors[i].id == this.floorId) {
                    this.floor = this.building.floors[i];
                    break;
                }
            }
        }
        this.offices = [];
    }

    ionViewDidEnter() {
        this.loading = this.loadingCtrl.create();
        this.loading.present();

        this.officeProvider.buildingOffices(this.buildingId, this.floorId).then((res) => {
            this.loading.dismiss();
            this.offices = res;
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad BuildingProfilePage');
    }

    public viewOffice(office) {
        this.navCtrl.push('OfficeProfilePage', {officeId: office.$id});
    }

    public editOffice(office, slidingItem: ItemSliding) {
        slidingItem.close();
        this.navCtrl.push('EditOfficePage', {officeId: office.$id});
    }
}
