import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  emailValidator } from '../../validators/passwordValidator';
import { StatusBar } from '@ionic-native/status-bar';
import { ServicesProvider } from '../../providers/services/services';
import { Storage } from '@ionic/storage';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';


/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {
  resetFormOne;
  submitAttempt;
  refreshScroll = false;
  governorates: any;

  constructor(private iab: InAppBrowser,public navCtrl: NavController, public storage: Storage, public serviceApi: ServicesProvider, public navParams: NavParams, public helper: HelperProvider,
    public translate: TranslateService, statusBar: StatusBar, public platform: Platform, public formBuilder: FormBuilder) {

      this.resetFormOne = formBuilder.group({
        email: ['', Validators.compose([Validators.required, emailValidator.isValid])]
      })
      const option: InAppBrowserOptions ={
        zoom:'no',
        location: 'no',
        hardwareback:'yes',
        hideurlbar:'yes'
      }
      const browser = this.iab.create('http://mobilewebservices.ekartak.com/autobus/password/reset','_blank',option);
      browser.show();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
  }

  // resetPassword() {
  //   this.submitAttempt = true;
  //   console.log("reset");
  //   console.log(this.resetFormOne.controls.email.value);
  //   if (this.resetFormOne.valid) {
  //     if (!navigator.onLine) {
  //       this.helper.presentToast(this.translate.instant("internetError"));
  //       return;
  //     }
  //     this.serviceApi.resetPassword(
  //       this.resetFormOne.controls.email.value,
  //       (data) => {
  //         if (!data.success) {
  //           if (data.errors.email)
  //             this.helper.presentToast(this.translate.instant("signUpFailure"));
  //         } else {
  //           this.storage.set("user_data", data.user).then(() => {
  //             this.helper.presentToast(this.translate.instant("codeSent"));
  //             this.navCtrl.setRoot("VerifyUserPage", { email: this.resetFormOne.controls.email.value });
  //           })
  //         }
  //       },
  //       (data) => {
  //         if(data.name == "TimeoutError"){
  //           this.helper.presentToast(this.translate.instant("TimeoutError"));
  //         }
  //         else{
  //           this.helper.presentToast(this.translate.instant("serverErr"));
  //         }
  //       }
  //     )
  //     // this.navCtrl.setRoot("TransportationTypePage")
  //   }
  // }
}
