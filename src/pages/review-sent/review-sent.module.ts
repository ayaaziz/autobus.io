import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReviewSentPage } from './review-sent';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ReviewSentPage,
  ],
  imports: [
    IonicPageModule.forChild(ReviewSentPage),
    TranslateModule.forChild()
  ],
})
export class ReviewSentPageModule {}
