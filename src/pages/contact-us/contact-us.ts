import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { ServicesProvider } from '../../providers/services/services';

/**
 * Generated class for the ContactUsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contact-us',
  templateUrl: 'contact-us.html',
})
export class ContactUsPage {

  supportPhoneNumber:string;
  messageSubject:string="";
  message:string="";
  messageEmail;
  messageTel;

  constructor(public navCtrl: NavController, public navParams: NavParams,public helper:HelperProvider,
    public translate:TranslateService, public storage: Storage, public serviceApi: ServicesProvider) {
  }
// Code executed when view loaded
  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactUsPage');
    // Get user data stored offline
    this.storage.get("user_token").then(user => {
      if(!navigator.onLine){
        this.helper.presentToast(this.translate.instant("internetError"));
        return;
      }
      let access = null ;
      if(user)
      access = user.access_token;
      // Get support telephone number
      this.serviceApi.contactInfo(access,(data)=>{
        if(data.success){
          this.supportPhoneNumber = data.data[0].config_value;
        }
        else{
          this.helper.presentToast(this.translate.instant("serverErr"));
        }
        console.log("data"+ JSON.stringify(data));
      },(err)=>{
        if(err.name == "TimeoutError"){
          this.helper.presentToast(this.translate.instant("TimeoutError"));
        }
        else{
          this.helper.presentToast(this.translate.instant("serverErr"));
        }
      })
    })

  }

  // send message
  sendMessage(){
    console.log(this.messageSubject);
    console.log(this.message);
    // if(this.helper.skipLogin){
    //   this.helper.presentToast(this.translate.instant('loginFirst'))
    //   return;
    // }
    if( String(this.messageSubject).length == 0){
      this.helper.presentToast(this.translate.instant("enterMsgSubject"));
      return;
    }
    if(String(this.message).length == 0 ){
      this.helper.presentToast(this.translate.instant("enterMsgData"));
      return;
    }
      // Get user data stored offline
      this.storage.get("user_token").then(val => {
        this.storage.get("user_data").then(user => {
          let access = null ;
          let email = "";
      if(val){
        access = val.access_token;
        email = user.email;
      }
      else{
        if(!this.messageEmail){
          this.helper.presentToast(this.translate.instant("enterEmail"));
          return;
        }
        // validate user email input
        if (/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(String(this.messageEmail).trim()) == false){
          this.helper.presentToast(this.translate.instant("enterEmail"));
          return;
      }
      // check if user enter mobile
        if(!this.messageTel){
          this.helper.presentToast(this.translate.instant("enterMobile"));
          return;
        }
        email = this.messageEmail;
      }
      //check internet connection
      if(!navigator.onLine){
        this.helper.presentToast(this.translate.instant("internetError"));
        return;
      }
      // Send message into server
        this.serviceApi.contactUs(access,email,this.messageSubject,this.message,this.messageTel,this.helper.currentLang,
          (data)=>{
            if(data.success){
              this.helper.presentToast(this.translate.instant("messageSent"));
              this.navCtrl.pop();
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
        })
      })

  }

}
