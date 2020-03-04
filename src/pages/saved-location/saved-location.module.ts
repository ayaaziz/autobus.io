import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SavedLocationPage } from './saved-location';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SavedLocationPage,
  ],
  imports: [
    IonicPageModule.forChild(SavedLocationPage),
    TranslateModule.forChild()

  ],
})
export class SavedLocationPageModule {}
