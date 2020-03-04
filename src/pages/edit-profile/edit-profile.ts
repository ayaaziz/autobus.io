import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { HelperProvider } from '../../providers/helper/helper';
import { Storage } from '@ionic/storage'
import { ServicesProvider } from '../../providers/services/services';

/**
 * Generated class for the EditProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

  newUserName: string;
  newUserEmail: string;
  newUserPhoneNumber: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events,
    public storage: Storage, public translate: TranslateService, public helper: HelperProvider, public serviceApi: ServicesProvider) {
  }
  // Code executed when view loaded
  ionViewDidLoad() {
    this.storage.get("user_data").then(val => {
      this.newUserName = val.fullname;
      this.newUserEmail = val.email;
      this.newUserPhoneNumber = val.phone;
    })
  }
  // Update Profile function
  updateProfile() {
    this.storage.get("user_token").then(val => {
      this.serviceApi.updateUserInfo(val.access_token, this.helper.currentLang, this.newUserName, this.newUserEmail, this.newUserPhoneNumber,
        (data) => {
          this.storage.set("user_data", data.user).then(() => {
            if (data.success) {
              if (this.newUserEmail == data.user.email) {
                //updated the view
                this.newUserName = data.user.fullname;
                //this.userName = data.user.fullname;
                this.newUserPhoneNumber = data.user.phone;
               // this.userPhoneNumber = data.user.phone;
                this.helper.presentToast(this.translate.instant("ProfileUpdated"));
                this.navCtrl.pop();
              } else {
                //logout
                this.helper.presentToast(this.translate.instant("loginAgainEmailChanged"));
                this.storage.clear().then(() => { });
                this.events.publish("logout_app");
              }
            }else{
              this.helper.presentToast(this.translate.instant("serverErr"));
            }
          })


        },
        (err) => {
          if(err.name == "TimeoutError"){
            this.helper.presentToast(this.translate.instant("TimeoutError"));
          }
          else{
            this.helper.presentToast(this.translate.instant("serverErr"));
          }
        });
    });
  }

}
