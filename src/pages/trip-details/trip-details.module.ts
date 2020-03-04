import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TripDetailsPage } from './trip-details';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    TripDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(TripDetailsPage),
    TranslateModule.forChild()
  ],
})
export class TripDetailsPageModule {}
