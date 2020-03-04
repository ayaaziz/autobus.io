import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Platform } from 'ionic-angular';
import { HelperProvider } from '../../providers/helper/helper';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { matchOtherValidator } from '../../validators/passwordValidator';
import { ServicesProvider } from '../../providers/services/services';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the ChangePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {
  passwordGroup: FormGroup;
  submit: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public translate: TranslateService
    , public platfrom: Platform, public helper: HelperProvider, private formBuilder: FormBuilder,
    public serviceApi: ServicesProvider, public storage: Storage) {
    this.passwordGroup = this.formBuilder.group({
      //validate change password form
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.compose([matchOtherValidator('newPassword')])],
    });

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePasswordPage');
  }
  //Change password function
  changePassword() {
    this.submit = true;
    console.log(this.passwordGroup.controls.confirmPassword.value);
    //check if user enter required data correctly
    if (this.passwordGroup.valid) {
      if (!navigator.onLine) {
        this.helper.presentToast(this.translate.instant("internetError"));
        return;
      }

      this.storage.get("user_token").then(val => {
        //check current password entered by user
        this.serviceApi.checkCurrentPassword(val.access_token, this.passwordGroup.controls.oldPassword.value,
          (data) => {
            console.log(data);
            if (data.success) {
              // if user enter old password successfull can change password
              this.changePasswordCall(val.access_token);
            } else {
              this.helper.presentToast(this.translate.instant("CurrentPasswordNotCorrect"));
            }
          },
          (err) => {
            if(err.name == "TimeoutError"){
              this.helper.presentToast(this.translate.instant("TimeoutError"));
            }
            else{
              this.helper.presentToast(this.translate.instant("serverErr"));
            }
          })
      });
    }
  }
  //change password function
  changePasswordCall(access_token) {
    this.serviceApi.changePassword(this.passwordGroup.controls.oldPassword.value,
      this.passwordGroup.controls.newPassword.value,this.passwordGroup.controls.confirmPassword.value,
      this.helper.currentLang,access_token,
      (data)=>{
        if(data.success){
        this.helper.presentToast(this.translate.instant("passwordChangedSuccess"));
        this.navCtrl.pop();
        }else{
          this.helper.presentToast(data.error.password[0]);
        }
      },
      (data)=>{
        if(data.name == "TimeoutError"){
          this.helper.presentToast(this.translate.instant("TimeoutError"));
        }
        else{
          this.helper.presentToast(this.translate.instant("serverErr"));
        }
      })
  }
}
