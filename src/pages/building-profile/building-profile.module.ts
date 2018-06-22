import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuildingProfilePage } from './building-profile';

@NgModule({
  declarations: [
    BuildingProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(BuildingProfilePage),
  ],
  exports: [
    BuildingProfilePage
  ]
})
export class BuildingProfilePageModule {}
