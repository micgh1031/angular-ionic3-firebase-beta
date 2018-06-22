import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {AlertController} from 'ionic-angular';

/*
 Generated class for the CommonProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */
@Injectable()
export class CommonProvider {

    constructor(public http: Http, private  alertCtrl: AlertController) {
        console.log('Hello CommonProvider Provider');
    }

    public showAlert(msg) {
        let alert = this.alertCtrl.create({
            subTitle: msg,
            buttons: ['OK']
        });
        alert.present(prompt);
    }
}
