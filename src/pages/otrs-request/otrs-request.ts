import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ActionSheetController} from 'ionic-angular';
import {Camera} from 'ionic-native';
import {AuthProvider} from '../../providers/auth/auth';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import {LoadingController, Loading} from 'ionic-angular';
import {BuildingProvider} from '../../providers/building/building';
import {CommonProvider} from '../../providers/common/common';
import * as moment from 'moment';
import {PushServiceProvider} from '../../providers/push-service/push-service';
import {NetworkServiceProvider} from '../../providers/network-service/network-service';

/**
 * Generated class for the OtrsRequestPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-otrs-request',
    templateUrl: 'otrs-request.html',
})
export class OtrsRequestPage {

    office: any;
    loading: Loading;
    officeKey: any;
    otrsRequest: any;
    userKey: any;
    requests: FirebaseListObservable<any>;
    steps: FirebaseListObservable<any>;
    isConnected: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthProvider, private db: AngularFireDatabase, private loadingCtrl: LoadingController, private buildingService: BuildingProvider, private common: CommonProvider, public actionSheetCtrl: ActionSheetController, public pushService: PushServiceProvider, private networkService: NetworkServiceProvider) {
        this.auth.getUser().then(user => {
            console.log(user);
            this.userKey = user['id'];
            this.officeKey = user['officeKey'];
        });
        this.otrsRequest = {
            comment: '',
            is_urgent: false,
            photos: [],
            step: 1,
            created_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
        };
        this.office = {};
        this.requests = this.db.list('/maintenance_requests', {preserveSnapshot: true});
        this.steps = this.db.list('/maintenance_steps', {preserveSnapshot: true});
        this.isConnected = true;
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad OtrsRequestPage');
    }

    ionViewDidEnter() {
        this.loading = this.loadingCtrl.create();
        this.loading.present();

        this.isConnected = !this.networkService.noConnection();
        if (this.networkService.noConnection()) {
            this.networkService.showNetworkAlert();
        }

        let offices = this.db.list('/offices', {
            preserveSnapshot: true,
            query: {
                orderByKey: true,
                equalTo: this.officeKey
            }
        });

        offices.subscribe(snapshots => {

            this.loading.dismiss();

            snapshots.forEach(snapshot => {
                console.log(snapshot.key);
                console.log(snapshot.val());

                this.office = snapshot.val();

                this.office.$id = snapshot.key;
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
            });
        });
    }

    addPhoto() {
        let actionSheet = this.actionSheetCtrl.create({
            buttons: [
                {
                    text: 'Take Photo',
                    handler: () => {
                        Camera.getPicture({
                            destinationType: Camera.DestinationType.DATA_URL,
                            sourceType: Camera.PictureSourceType.CAMERA,
                            allowEdit: true,
                            encodingType: Camera.EncodingType.JPEG,
                            saveToPhotoAlbum: false
                        }).then((imageData) => {
                            let imgData = "data:image/jpeg;base64," + imageData;
                            console.log(imgData);
                            this.otrsRequest.photos.push(imgData);
                        }, (err) => {
                            console.log(err);
                        })
                    }
                },
                {
                    text: 'Choose Photo',
                    handler: () => {
                        Camera.getPicture({
                            destinationType: Camera.DestinationType.DATA_URL,
                            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                            allowEdit: true,
                            encodingType: Camera.EncodingType.JPEG,
                            saveToPhotoAlbum: false
                        }).then((imageData) => {
                            let imgData = "data:image/jpeg;base64," + imageData;
                            console.log(imgData);
                            this.otrsRequest.photos.push(imgData);
                        }, (err) => {
                            console.log(err);
                        })
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler:() => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    }

    createNewRequest() {
        this.otrsRequest.userKey = this.userKey;
        this.otrsRequest.officeKey = this.officeKey;

        this.loading = this.loadingCtrl.create();
        this.loading.present();
        this.requests.push(this.otrsRequest).then(res => {
            console.log(res);

            let requestKey = '';

            if (!res.path.o) {
                requestKey = res.path.pieces_[1];
            }else {
                requestKey = res.path.o[1];
            }

            this.pushService.notiBuildingManagerForRequest(requestKey, "New request is created!");

            let newSteps = {
                maintenanceKey: requestKey,
                1: {
                    status: 0,
                    quote: '',
                    updated_at: ''
                },
                2: {
                    status: 0,
                    technician_date: '',
                    technician_time: '',
                    technician_name: '',
                    technician_company: '',
                    technician_phone: '',
                    updated_at: ''
                },
                3: {
                    status: 0,
                    invoice: '',
                    is_completed: false,
                    updated_at: ''
                },
                4: {
                    is_paid: false,
                    status: 0,
                    updated_at: ''
                },
                5: {
                    star: '',
                    comment: '',
                    status: 0,
                    updated_at: ''
                }
            };

            this.steps.push(newSteps).then(res => {
                this.loading.dismiss();
                this.common.showAlert('Request is submitted successfully!');
                this.navCtrl.pop();
            });
        })
    }

}
