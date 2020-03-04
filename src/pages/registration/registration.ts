import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { passwordValidator, matchOtherValidator, emailValidator } from '../../validators/passwordValidator';
import { StatusBar } from '@ionic-native/status-bar';
import { ServicesProvider } from '../../providers/services/services';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the RegistrationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-registration',
  templateUrl: 'registration.html',
})
export class RegistrationPage {
  registerFormOne;
  submitAttempt;
  gender=1;
  mobile="0790000000";
  refreshScroll = false;
  governorates: any;

  constructor(public navCtrl: NavController, public storage: Storage, public serviceApi: ServicesProvider, public navParams: NavParams, public helper: HelperProvider,
    public translate: TranslateService, statusBar: StatusBar, public platform: Platform, public formBuilder: FormBuilder) {
    platform.ready().then(() => {
      //change status bar background and font color
      statusBar.overlaysWebView(false);
      statusBar.backgroundColorByHexString("#006098");
    });
    // validate registration form + null validator for phone & gender
    this.registerFormOne = formBuilder.group({
      fullname: ['', Validators.required],
      mobile: ['', Validators.minLength(0)],
      email: ['', Validators.compose([Validators.required, emailValidator.isValid])],
      password: ['', Validators.compose([Validators.minLength(4), Validators.required])],
      confirmpassword: ['', Validators.compose([matchOtherValidator('password')])],
      country: ['', Validators.required],
      gender: ['', Validators.minLength(0)],
    })


  }
  countryChanged() {

  }

  // Function to allow user to register using his info entered into form
  register() {
    this.submitAttempt = true;
    console.log("register");
    console.log(this.registerFormOne.controls.country.value);
    //added to replace null submitted value with default value
    if(this.registerFormOne.controls.mobile.value != ""){this.mobile=this.registerFormOne.controls.mobile.value;}
    if(this.gender == null){this.gender=1;}

    if (this.registerFormOne.valid) {
      if (!navigator.onLine) {
        this.helper.presentToast(this.translate.instant("internetError"));
        return;
      }
      this.serviceApi.userRegister(
        this.registerFormOne.controls.fullname.value,
        this.registerFormOne.controls.email.value,
        this.registerFormOne.controls.password.value,
        this.registerFormOne.controls.confirmpassword.value,
        this.mobile,
        this.helper.currentLang == "en" ? 1 : 2,
        this.registerFormOne.controls.country.value,
        this.gender,
        (data) => {
          if (!data.success) {
            //check errors after submit * comment by Amr
            if (data.errors.email)
              this.helper.presentToast(this.translate.instant("signUpFailure"));
          } else {
            this.storage.set("user_data", data.user).then(() => {
              this.helper.presentToast(this.translate.instant("codeSent"));
              this.navCtrl.setRoot("VerifyUserPage", { email: this.registerFormOne.controls.email.value, password: this.registerFormOne.controls.password.value });
            })
          }
        },
        (data) => {
          if(data.name == "TimeoutError"){
            this.helper.presentToast(this.translate.instant("TimeoutError"));
          }
          else{
            this.helper.presentToast(this.translate.instant("serverErr"));
          }
        }
      )
      // this.navCtrl.setRoot("TransportationTypePage")
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistrationPage');
    setTimeout(() => {
      this.refreshScroll = true;
    }, 5000);
    //--------get countryList-----------
    this.getCountryList();
  }

  // Function to get countries list
  getCountryList() {
    this.serviceApi.getCountries(this.helper.currentLang,
      (data) => {
        console.log(data)
        this.governorates = data.countries;
      }, (data) => {
        if(data.name == "TimeoutError"){
          this.helper.presentToast(this.translate.instant("TimeoutError"));
        }
        else{
          this.helper.presentToast(this.translate.instant("serverErr"));
        }
      });

  }

}
