import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MaintenanceViewPage } from './maintenance-view';

@NgModule({
  declarations: [
    MaintenanceViewPage,
  ],
  imports: [
    IonicPageModule.forChild(MaintenanceViewPage),
  ],
  exports: [
    MaintenanceViewPage
  ]
})
export class MaintenanceViewPageModule {}
