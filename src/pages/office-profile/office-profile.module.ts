import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OfficeProfilePage } from './office-profile';

@NgModule({
  declarations: [
    OfficeProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(OfficeProfilePage),
  ],
  exports: [
    OfficeProfilePage
  ]
})
export class OfficeProfilePageModule {}
