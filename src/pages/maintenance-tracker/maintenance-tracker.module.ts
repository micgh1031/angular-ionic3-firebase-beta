import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MaintenanceTrackerPage } from './maintenance-tracker';

@NgModule({
  declarations: [
    MaintenanceTrackerPage,
  ],
  imports: [
    IonicPageModule.forChild(MaintenanceTrackerPage),
  ],
  exports: [
    MaintenanceTrackerPage
  ]
})
export class MaintenanceTrackerPageModule {}
