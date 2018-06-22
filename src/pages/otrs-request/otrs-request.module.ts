import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OtrsRequestPage } from './otrs-request';

@NgModule({
  declarations: [
    OtrsRequestPage,
  ],
  imports: [
    IonicPageModule.forChild(OtrsRequestPage),
  ],
  exports: [
    OtrsRequestPage
  ]
})
export class OtrsRequestPageModule {}
