import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditOfficePage } from './edit-office';

@NgModule({
  declarations: [
    EditOfficePage,
  ],
  imports: [
    IonicPageModule.forChild(EditOfficePage),
  ],
  exports: [
    EditOfficePage
  ]
})
export class EditOfficePageModule {}
