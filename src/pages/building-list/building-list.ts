import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {BuildingProvider} from '../../providers/building/building';

/**
 * Generated class for the BuildingListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-building-list',
    templateUrl: 'building-list.html',
})
export class BuildingListPage {

    buildings: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, private buildingService: BuildingProvider) {
        this.buildings = this.buildingService.list();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad BuildingListPage');
    }


    public createOffice() {
        this.navCtrl.push('CreateOfficePage');
    }

    public viewBuilding(building) {
        this.navCtrl.push('BuildingProfilePage', {buildingId: building['id']});
    }
}
