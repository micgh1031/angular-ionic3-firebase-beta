import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { KioskViewPage } from './kiosk-view';

@NgModule({
  declarations: [
    KioskViewPage,
  ],
  imports: [
    IonicPageModule.forChild(KioskViewPage),
  ],
  exports: [
    KioskViewPage
  ]
})
export class KioskViewPageModule {}
