import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {CreateOfficePage} from './create-office';
import {TextMaskModule} from 'angular2-text-mask';

@NgModule({
    declarations: [
        CreateOfficePage,
    ],
    imports: [
        IonicPageModule.forChild(CreateOfficePage),
        TextMaskModule
    ],
    exports: [
        CreateOfficePage
    ]
})
export class CreateOfficePageModule {
}
