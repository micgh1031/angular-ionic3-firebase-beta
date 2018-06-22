import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AngularFireDatabase} from 'angularfire2/database';
import {LoadingController, Loading} from 'ionic-angular';
import {BuildingProvider} from '../../providers/building/building';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    loading: Loading;
    offices: any;
    buildings: any;

    constructor(public navCtrl: NavController, private db: AngularFireDatabase, private loadingCtrl: LoadingController, private buildingService: BuildingProvider) {
        this.offices = [];
        this.buildings = this.buildingService.list();
    }

    ionViewDidEnter() {
        this.loading = this.loadingCtrl.create();
        this.loading.present();

        let offices = this.db.list('/offices', {
            preserveSnapshot: true,
            query: {
                orderByChild: "floorId"
            }
        });

        offices.subscribe(snapshots => {

            this.loading.dismiss();
            this.offices = [];

            snapshots.forEach(snapshot => {
                console.log(snapshot.key);
                console.log(snapshot.val());

                let office = snapshot.val();
                office['$id'] = snapshot.key;
                this.offices.push(office);
            });
        });
    }

    public rentedOffices(buildingId) {
        let count = 0;
        for (let i = 0; i < this.offices.length; i ++) {
            if (this.offices[i]['buildingId'] == buildingId && this.offices[i]['is_rented']) {
                count ++;
            }
        }
        return count;
    }

    public vacantOffices(buildingId) {
        let count = 0;
        for (let i = 0; i < this.offices.length; i ++) {
            if (this.offices[i]['buildingId'] == buildingId && !this.offices[i]['is_rented']) {
                count ++;
            }
        }
        return count;
    }

    public occupancyOffices(buildingId) {
        let count = 0;
        let officeCount = 0;
        for (let i = 0; i < this.offices.length; i ++) {
            if (this.offices[i]['buildingId'] == buildingId) {
                officeCount ++;
                if (this.offices[i]['is_rented']) count ++;
            }
        }
        return count / officeCount * 100;
    }

    public buildingOffices(buildingId) {
        let offices = [];
        for (let i = 0; i < this.offices.length; i ++) {
            if (this.offices[i]['buildingId'] == buildingId) {
                offices.push(this.offices[i]);
            }
        }

        return offices;
    }

    public viewFloorOfffice(buildingId, floorId) {
        this.navCtrl.push('BuildingProfilePage', {buildingId: buildingId, floorId: floorId});
    }

    public viewOffice(office) {
        this.navCtrl.push('OfficeProfilePage', {officeId: office.$id});
    }

    public viewBuildingList() {
        this.navCtrl.push('BuildingListPage');
    }

    public viewNotifications() {
        this.navCtrl.push('NotificationsPage');
    }

}
