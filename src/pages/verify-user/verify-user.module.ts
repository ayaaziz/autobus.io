import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VerifyUserPage } from './verify-user';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    VerifyUserPage,
  ],
  imports: [
    IonicPageModule.forChild(VerifyUserPage),
    TranslateModule.forChild(),
  ],
})
export class VerifyUserPageModule {}
