import { Component, SystemJsNgModuleLoader } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { HelperProvider } from '../../providers/helper/helper';
import { ServicesProvider } from '../../providers/services/services';
import { Storage } from '@ionic/storage'
/**
 * Generated class for the ReviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-review',
  templateUrl: 'review.html',
})
export class ReviewPage {
  tripDetails;
  driverName;
  message:String="";
  bus_id=0;
  bus_number;
  review_type=1;
  ratingStatus=5;
  ratingArray:Number[]=[1,2,3,4,5];
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public events: Events,
    public storage: Storage, public translate: TranslateService, public helper: HelperProvider, public serviceApi: ServicesProvider) {
      this.tripDetails = navParams.get("tripDetails")
      this.bus_id=this.tripDetails.bus_id;
      this.bus_number = this.tripDetails.bus_number;
      this.driverName= this.tripDetails.driver_name;

    }
    // Function executed when view loaded
  ionViewDidLoad() {
    console.log('ionViewDidLoad ReviewPage');
    this.ratingStatus=5;
  }

  // dismiss view
  goBack(){
    this.navCtrl.pop();
  }

  // Function to allow user to submit review
  submitReview(){
    if(this.message!=""){
      if(!navigator.onLine){
        this.helper.presentToast(this.translate.instant("internetError"));
        return
      }
    this.storage.get("user_token").then(val => {
   this.serviceApi.submitReview(val.access_token,this.bus_id,this.ratingStatus,this.message,this.review_type,
   data=>{
    if (data.success) {
      this.navCtrl.push("ReviewSentPage");
      console.log('review send');
    }else{
      this.helper.presentToast(this.translate.instant("serverErr"));
    }
   },err=>{
    if(err.name == "TimeoutError"){
      this.helper.presentToast(this.translate.instant("TimeoutError"));
    }
    else{
      this.helper.presentToast(this.translate.instant("serverErr"));
    }
   }
   );
  })
  console.log(this.message);
  }else{
    this.helper.presentToast(this.translate.instant("WriteReview"));
  }

  }

  //Change rate value for bus
  rateBus(rating){
    this.ratingStatus=rating;
    console.log(this.ratingStatus);
  }

}
