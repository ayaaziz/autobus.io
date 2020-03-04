import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChangePasswordPage } from './change-password';
import { TranslateModule } from '@ngx-translate/core';
import { HelperProvider } from '../../providers/helper/helper';


@NgModule({
  declarations: [
    ChangePasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(ChangePasswordPage),
    TranslateModule.forChild()
  ],
})
export class ChangePasswordPageModule {}
