import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { ServicesProvider } from '../../providers/services/services';
import { Storage } from '@ionic/storage';
import { HelperProvider } from '../../providers/helper/helper';
/**
 * Generated class for the TermsAndConditionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-terms-and-conditions',
  templateUrl: 'terms-and-conditions.html',
})
export class TermsAndConditionsPage {

  termsAndConditions:string="";

  constructor(public navCtrl: NavController, public navParams: NavParams,public helper:HelperProvider,
    public translate:TranslateService,public serviceApi: ServicesProvider,public storage: Storage) {

  }

  // Function executed when view loaded
  ionViewDidLoad() {
    if (!navigator.onLine) {
      this.helper.presentToast(this.translate.instant("internetError"));
      return
    }else{
    //this.storage.get("user_token").then(val => {
      this.serviceApi.getTermsAndCondition(this.helper.currentLang,(data)=>{
           if(data.success){
               this.termsAndConditions=data.data[0].description;

           }else{
            this.helper.presentToast(this.translate.instant("serverErr"));
           }
      },
      (err)=>{
        if(err.name == "TimeoutError"){
          this.helper.presentToast(this.translate.instant("TimeoutError"));
        }
        else{
          this.helper.presentToast(this.translate.instant("serverErr"));
        }
      })
    //});
  }
  }
// dismiss view
  goBack(){
    this.navCtrl.pop();
  }

}
