import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchPlacesPage } from './search-places';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SearchPlacesPage,
  ],
  imports: [
    TranslateModule.forChild(),
    IonicPageModule.forChild(SearchPlacesPage),
  ],
})
export class SearchPlacesPageModule {}
