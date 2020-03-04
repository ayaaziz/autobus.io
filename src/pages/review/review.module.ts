import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReviewPage } from './review';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ReviewPage,
  ],
  imports: [
    IonicPageModule.forChild(ReviewPage),
    TranslateModule.forChild()
  ],
})
export class ReviewPageModule {}
