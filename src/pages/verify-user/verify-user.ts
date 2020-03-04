import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServicesProvider } from '../../providers/services/services';
import { Storage } from '@ionic/storage';
import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';
import { StatusBar } from '@ionic-native/status-bar';
import { TransportationTypePage } from '../../pages/transportation-type/transportation-type';

/**
 * Generated class for the VerifyUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-verify-user',
  templateUrl: 'verify-user.html',
})
export class VerifyUserPage {
  registerFormOne;
  submitAttempt;
  email;
  userPass;
  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder
    , public storage: Storage , public serviceApi: ServicesProvider, public helper: HelperProvider,
     public translate: TranslateService, public statusBar: StatusBar) {
      this.email = navParams.get("email");
      this.userPass = navParams.get("password");
      this.registerFormOne = formBuilder.group({
        code: ['', Validators.required]
      });
    }

    // Function executed when user enter to view
    ionViewDidEnter(){
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString("#006098");
    }

    // Function executed when view loaded
  ionViewDidLoad() {
    console.log('ionViewDidLoad VerifyUserPage');
  }
  // Function to verify user email via send activation code to this email
  verifyUser(){
    this.submitAttempt = true;

    if (this.registerFormOne.valid) {
      if(!navigator.onLine){
        this.helper.presentToast(this.translate.instant("internetError"));
        return;
      }
      this.serviceApi.verifyUser(
        this.email,
        this.registerFormOne.controls.code.value,
        this.helper.currentLang,
        (data)=>{
          if(!data.success){
            this.helper.presentToast(this.translate.instant("verifyUserFailure"));
          }else{
            this.serviceApi.userLogin(this.email,
              this.userPass,this.helper.currentLang,
              (data)=>{
                if(data){
                  if(data.status){
                    if(data.status == -1){
                      this.helper.presentToast(this.translate.instant("invalid_credentials"));
                      return;
                    }
                    else if(data.status == -2){
                      this.helper.presentToast(this.translate.instant("user_not_found"));
                      return;
                    }
                    else if(data.status == -3){
                      this.helper.presentToast(this.translate.instant("verify_email"));
                      this.navCtrl.setRoot("VerifyUserPage", {email:this.registerFormOne.controls.email.value,password:this.registerFormOne.controls.password.value});
                    }
                    else if(data.status == -4){
                      this.helper.presentToast(this.translate.instant("determine_trans_type"));
                      this.storage.set("user_data",data.user).then(()=>{
                        this.navCtrl.setRoot(TransportationTypePage,{user_id:data.user.id});
                      })

                    }
                    else if(data.status == -5){
                      this.helper.presentToast(this.translate.instant("AccountDisabeled"));
                      return;
                    }
                    else{
                      return;
                    }
                  }
                  else if(data.access_token){
                    localStorage.setItem("kdkvfkhggssoauto",data.access_token);
                    localStorage.setItem('reefdfdfvcvcauto', data.refresh_token);
                    this.storage.set("user_token",data);
                    this.serviceApi.userData(data.access_token,(data)=>{
                      this.storage.set("user_data",data.user).then(()=>{
                        this.helper.user_id = data.user.id;
                        this.navCtrl.setRoot(TransportationTypePage,{user_id:data.user.id});
                        //this.navCtrl.setRoot(TabsPage)
                      })

                    },
                    ()=>{ this.helper.presentToast(this.translate.instant("serverErr"))})
                  }
                }
                else{
                  this.helper.presentToast(this.translate.instant("serverErr"));
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
            // this.storage.set("user_data",data.user).then(()=>{
            //   this.navCtrl.setRoot("TransportationTypePage",{user_id:data.user.id})
            // })
          }
        },
        (data)=>{
          this.helper.presentToast(this.translate.instant("serverErr"));
        }
      )
    }
  }
}
