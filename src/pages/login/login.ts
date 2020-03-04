import { Component } from '@angular/core';
import { NavController, NavParams, Platform, Events } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { Storage } from '@ionic/storage';
import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServicesProvider } from '../../providers/services/services';
import { StatusBar } from '@ionic-native/status-bar';
import { passwordValidator, matchOtherValidator, emailValidator } from '../../validators/passwordValidator';
import { TransportationTypePage } from '../../pages/transportation-type/transportation-type';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  email: any;
  password: any;
  registerFormOne;
  submitAttempt = false;
  constructor(public statusBar: StatusBar, public serviceApi: ServicesProvider, public storage: Storage, public navCtrl: NavController, public translate: TranslateService,
     public navParams: NavParams, public helper: HelperProvider,public platform: Platform, public formBuilder: FormBuilder) {
      this.registerFormOne = formBuilder.group({
        email: ['', Validators.compose([Validators.required,emailValidator.isValid])],
        password: ['', Validators.compose([Validators.minLength(4), Validators.required])]
      })
  }

  // Function executed when view loaded
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.helper.skipLogin = false;
  }

  // Function executed when user enter to view
  ionViewDidEnter(){
    this.statusBar.overlaysWebView(false);
    this.statusBar.backgroundColorByHexString("#006098");
    this.helper.skipLogin = false;
  }

  // Function to login into app
  login() {
    this.submitAttempt = true;
    console.log("ss "+ this.registerFormOne.controls.email.value);
    console.log("register")
    if (this.registerFormOne.valid) {
      if(!navigator.onLine){
        this.helper.presentToast(this.translate.instant("internetError"));
        return
      }
      this.serviceApi.userLogin(this.registerFormOne.controls.email.value,
        this.registerFormOne.controls.password.value,this.helper.currentLang,
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
                  this.navCtrl.setRoot("TransportationTypePage",{user_id:data.user.id});
                })

              }
              else if(data.status == -5){
                this.helper.presentToast(this.translate.instant("AccountDisabeled"));
                return;
              }
              else{
                return
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

    }
  }

  // Allow user to skip login and act as visitor
  skipToApp(){
    this.helper.skipLogin = true;
    this.navCtrl.setRoot(TransportationTypePage,{user_id:-1});
  }

  // open register view
  register(){
    this.navCtrl.push("RegistrationPage");
  }
  forgotPassword(){
    this.navCtrl.push("ForgotPasswordPage");
  }
}
