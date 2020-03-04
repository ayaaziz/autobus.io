import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { HelperProvider } from '../../providers/helper/helper';
import { Storage } from '@ionic/storage'
import { ServicesProvider } from '../../providers/services/services';

/**
 * Generated class for the SavedLocationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-saved-location',
  templateUrl: 'saved-location.html',
})
export class SavedLocationPage {
  savedLocations = [];
  hideMoreBtn = true;
  page = 0;
  noSavedData = false;
  constructor(public storage:Storage,public serviceApi:ServicesProvider, public navCtrl: NavController, public navParams: NavParams,
    public alertCtrl: AlertController,public translate:TranslateService,public helper: HelperProvider) {
  }

  // Function executed when view loaded
  ionViewDidLoad() {
    console.log('ionViewDidLoad SavedLocationPage');
    this.savedLocations = [];
    this.page = 0;
    this.getSavedLocations();
  }
  // Function to delete route saved by user
  deleteRoute(id){
    let alert = this.alertCtrl.create({
      title: this.translate.instant("deleteRoute"),
      message: this.translate.instant("AreYouSureDeleteRoute"),
      buttons: [
        {
          text: this.translate.instant("Cancel"),
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: this.translate.instant("Yes"),
          handler: () => {
            console.log("Delete Route");
            if(!navigator.onLine){
              this.helper.presentToast(this.translate.instant("internetError"));
              return
            }
            this.storage.get("user_token").then(val => {
              let access = val ? val.access_token : null
            this.serviceApi.deleteSavedRoute(access,id,this.helper.currentLang,
            (data)=>{
              if(data.success){
                this.helper.presentToast(this.translate.instant("routeDeletedSuccess"));
                this.ionViewDidLoad();
              }
              else{
                this.helper.presentToast(this.translate.instant("routeDeletedFailed"));
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
      ]
    });
    alert.present();
  }

  // Function to open search view with source and destination saved by user
  openSerchFromSaved(item){
    console.log(JSON.stringify(item))
    if(item.trip_type == 1){
      this.navCtrl.push('SearchPlacesPage',
    {type:1,from:item.from_location_address,formloc: item.from_location,
    to:item.to_location_address,toloc:item.to_location});
    }
    else{
      this.navCtrl.push("SearchPlacesPage",
      {type:2,university_name:item.to_location_address,currentLoc:item.from_location,
        locAddress:item.from_location_address,univID:item.to_location});
    }
    //this.navCtrl.push('SearchPlacesPage',{type:3,routeItem:item})
  }

  //Function to list saved search by user
  getSavedLocations(){
    this.page +=1;
    this.storage.get("user_token").then(val => {
      this.serviceApi.getSavedSearch(this.page,val.access_token,(data)=>{
           if(data.success){
             if(this.page == 1 && data.data.data.length == 0){
               this.noSavedData = true;
             }
            if(data.data.data.length > 0){
              data.data.data.forEach(element => {
              this.savedLocations.push(element);
            });
            this.page += 1;
            if(data.data.data.length < data.data.per_page){
              this.hideMoreBtn = true;
            }
            else{
              this.hideMoreBtn = false;
            }
            }
            else{
              this.hideMoreBtn = true;
            }

           }
           else{
            this.hideMoreBtn = true;
           }
      },
      (err)=>{
        if(err.name == "TimeoutError"){
          this.helper.presentToast(this.translate.instant("TimeoutError"));
        }
        else{
          this.helper.presentToast(this.translate.instant("serverErr"));
        }
      }
      );
    })
  }
}
