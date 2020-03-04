import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StripeWebPage } from './stripe-web';

@NgModule({
  declarations: [
    StripeWebPage,
  ],
  imports: [
    IonicPageModule.forChild(StripeWebPage),
  ],
})
export class StripeWebPageModule {}
