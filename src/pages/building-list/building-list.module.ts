import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuildingListPage } from './building-list';

@NgModule({
  declarations: [
    BuildingListPage,
  ],
  imports: [
    IonicPageModule.forChild(BuildingListPage),
  ],
  exports: [
    BuildingListPage
  ]
})
export class BuildingListPageModule {}
