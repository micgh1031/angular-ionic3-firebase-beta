import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EmployeeProfilePage } from './employee-profile';

@NgModule({
  declarations: [
    EmployeeProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(EmployeeProfilePage),
  ],
  exports: [
    EmployeeProfilePage
  ]
})
export class EmployeeProfilePageModule {}
