import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Events, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';
import { ServicesProvider } from '../../providers/services/services';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../../pages/login/login';
import { TabsPage } from '../tabs/tabs';
import { Diagnostic } from '@ionic-native/diagnostic';

/**
 * Generated class for the TransportationTypePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-transportation-type',
  templateUrl: 'transportation-type.html',
})
export class TransportationTypePage {

  user_id;
  locationEnabled = true;
  constructor(public navCtrl: NavController, statusBar: StatusBar,public platform: Platform, public translate: TranslateService,
     public navParams: NavParams, public helper: HelperProvider , public serviceApi: ServicesProvider,
     public storage: Storage,public diagnostic: Diagnostic, public toastCtrl: ToastController, public events: Events) {
      events.subscribe("locationEnabled",()=>{
        this.locationEnabled = true;
      })
       this.user_id = navParams.get("user_id");
       // change statusbar background and font color
    platform.ready().then(() => {
      statusBar.overlaysWebView(false);
      statusBar.backgroundColorByHexString("#2d3a46");
    });

  }
  // Function to get user current location
  getCurrentLoc(loc) {
    if (loc == "-1") {
      this.locationEnabled = false;
    }
    else {
      console.log("location " + JSON.stringify(loc));
      this.locationEnabled = true;
    }
  }
  // Function executed when view loaded
  ionViewDidLoad() {
    this.platform.ready().then(()=>{
      //  this.helper.geoLoc(data => this.getCurrentLoc(data));
    })
    let type = 4;
    this.updateTrans(type);
  }
  // update transportation type for user
  updateTrans(type){
    if(this.helper.skipLogin){
      let toast = this.toastCtrl.create({
        message: this.translate.instant("waitDetermineYourLocation"),
        showCloseButton : true,
        position: 'top',
        closeButtonText : this.translate.instant('close')
      });
      toast.present();
      this.helper.transType = type;
      //this.navCtrl.setRoot(TabsPage)
      this.helper.geoLoc(data => {
        if (data == "-1") {
          toast.dismiss();
          this.helper.presentToast(this.translate.instant("giveGPSPermission"));
          this.ionViewDidLoad();
        }
        else {
          toast.dismiss();
          this.navCtrl.setRoot(TabsPage);
        }
      })
    }
    else{
      if(!navigator.onLine){
      this.helper.presentToast(this.translate.instant("internetError"));
      return;
    }
    this.storage.get("user_data").then((val)=>{
    this.serviceApi.updateTrans(this.helper.currentLang,val.id,
      type,
      (data)=>{
        if(!data.success){
          this.helper.logout();
          this.helper.presentToast(this.translate.instant("serverErr"));
        }else{
          if(!(data.user.status == 1)){
            this.helper.presentToast(this.translate.instant("loginAgain"));
            this.helper.logout();
            return
          }
          this.storage.set("user_data",data.user).then(()=>{
            let toast = this.toastCtrl.create({
              message: this.translate.instant("waitDetermineYourLocation"),
              showCloseButton : true,
              position: 'top',
              closeButtonText : this.translate.instant('close')
            });
            toast.present();
          this.helper.transType = type;
          this.helper.geoLoc(loc => {
            if (loc == "-1") {
              toast.dismiss();
              this.helper.presentToast(this.translate.instant("giveGPSPermission"));
              this.ionViewDidLoad();
            }
            else {
              toast.dismiss();
              this.navCtrl.setRoot(TabsPage);
            }
          })
          })
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
    }

  }
}
