import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage'
import { HelperProvider } from '../../providers/helper/helper';
import { ServicesProvider } from '../../providers/services/services';
import { LoginPage } from '../../pages/login/login';

@Component({
  selector: 'page-account-tab',
  templateUrl: 'account-tab.html'
})
export class AccountPage {

  userName: string;
  userEmail: string;
  userPhoneNumber: string = 'xxx-xxxxxxxx';

  constructor(public navCtrl: NavController, public storage: Storage, public events: Events,
    public helper: HelperProvider, public service: ServicesProvider,
    public translate: TranslateService
    , public platform: Platform) {

  }
  // open contact view
  openContact(){
    this.navCtrl.push("ContactUsPage")
  }
  // code excuted whin view did load
  ionViewDidLoad() {
    //get user info stored offline
    if(!this.helper.skipLogin){
    this.storage.get("user_data").then(val => {
      this.userName=val.fullname;
      this.userEmail=val.email;
      this.userPhoneNumber=val.phone;

    })
  }
  }
   // code excuted whin view did enter
  ionViewDidEnter(){
    if(!this.helper.skipLogin){
      this.storage.get("user_data").then(val => {
      this.userName=val.fullname;
      this.userEmail=val.email;
      this.userPhoneNumber=val.phone;

    })
    }

  }
   // calling client
   callClient() {
    console.log('call');
  }
  //redirect user into login view
  loginToApp(){
    this.navCtrl.setRoot(LoginPage);
  }
  //change language
  changeLanguage() {
   this.helper.changelang();
   if (!navigator.onLine) {
    this.helper.presentToast(this.translate.instant("internetError"));
    return;
  }
  if(!this.helper.skipLogin){
  this.storage.get("user_token").then(val => {
    let lang = this.helper.currentLang == "en" ? 1 : 2;
    //update user language on server
  this.service.changeLanguage(lang,val.access_token,()=>{},()=>{});
  })
}
  }


  // go saved Loactions
  goToSavedLocationsPage() {
    console.log("go saved locations");
    this.navCtrl.push("SavedLocationPage", {
      item: "userdID"
    });

  }
  // change password
  changePassword() {
    console.log("change password");
    this.navCtrl.push("ChangePasswordPage", {
      item: "userdID"
    });
  }
  // go Notifications
  goToNotifications() {
    console.log("go to Notifications");
  }
  // go to contact us
  goToContactUs() {
    console.log("go to contact us");
    this.navCtrl.push("ContactUsPage");
  }
  // go to terms and conditions
  goToTermsAndConditions() {
    console.log("go to terms and conditions");
    this.navCtrl.push("TermsAndConditionsPage");
  }
  // logout
  logout() {
    this.storage.clear().then(()=>{})
    this.events.publish("logout_app");
  }
  //Edit user profile
  updateUserData(){
    console.log("Update");
    this.navCtrl.push("EditProfilePage");
  }

}
