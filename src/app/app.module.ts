import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';

import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {LoginPage} from '../pages/login/login';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {Network} from '@ionic-native/network';
import {Diagnostic} from '@ionic-native/diagnostic';
import {AuthProvider} from '../providers/auth/auth';
import {HttpModule} from '@angular/http';
import {IonicStorageModule} from '@ionic/storage';
import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {CommonProvider} from '../providers/common/common';
import {BuildingProvider} from '../providers/building/building';
import {CloudSettings, CloudModule} from '@ionic/cloud-angular';
import {PushServiceProvider} from '../providers/push-service/push-service';
import {NetworkServiceProvider} from '../providers/network-service/network-service';
import { OfficeProvider } from '../providers/office/office';
import { UserProvider } from '../providers/user/user';

export const firebaseConfig = {
    apiKey: "AIzaSyBBzf4gxU2tEkE7S7myNCrxXxtOgQX2XWs",
    authDomain: "wtcb-9eee6.firebaseapp.com",
    databaseURL: "https://wtcb-9eee6.firebaseio.com",
    projectId: "wtcb-9eee6",
    storageBucket: "wtcb-9eee6.appspot.com",
    messagingSenderId: "554352493400"
};

const cloudSettings: CloudSettings = {
    'core': {
        'app_id': '035b2a01'
    },
    'push': {
        'sender_id': '554352493400',
        'pluginConfig': {
            'ios': {
                'badge': true,
                'sound': true
            },
            'android': {
                'iconColor': '#ff0000'
            }
        }
    }
};

@NgModule({
    declarations: [
        MyApp,
        HomePage,
        LoginPage
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireDatabaseModule,
        HttpModule,
        IonicStorageModule.forRoot(),
        CloudModule.forRoot(cloudSettings)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        LoginPage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        Network,
        Diagnostic,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        AuthProvider,
        CommonProvider,
        BuildingProvider,
        PushServiceProvider,
        NetworkServiceProvider,
    OfficeProvider,
    UserProvider
    ]
})
export class AppModule {
}
