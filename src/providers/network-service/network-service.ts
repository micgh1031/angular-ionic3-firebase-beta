import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Network} from 'ionic-native';
import {AlertController} from 'ionic-angular';
import {Diagnostic} from '@ionic-native/diagnostic';

/*
 Generated class for the NetworkServiceProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */
@Injectable()
export class NetworkServiceProvider {

    constructor(public http: Http, private  alertCtrl: AlertController, private diagnostic: Diagnostic) {
        console.log('Hello NetworkServiceProvider Provider');
    }

    public noConnection() {
        return (Network.type === 'none');
    }

    private showSettings() {
        this.diagnostic.isWifiAvailable().then(() => {
            this.diagnostic.switchToWifiSettings();
        }).catch(() => {
            this.diagnostic.switchToSettings();
        });
    }

    public showNetworkAlert() {
        let alert = this.alertCtrl.create({
            title: 'No Internet Connection',
            message: 'Please check your internet connection.',
            buttons: [{
                text: 'Cancel',
                handler: () => {}
            }, {
                text: 'Settings',
                handler: () => {
                    alert.dismiss().then(() => {
                        this.showSettings()
                    })
                }
            }]
        });
        alert.present(prompt);
    }
}
