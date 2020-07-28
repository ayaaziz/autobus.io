import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController, AlertController, Platform, Events } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

/*
  Generated class for the HelperProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()

// HelperProvider class contains shared variable and functions used in app
export class HelperProvider {
  DeviceId: any;
  user_id;
  user_trans_type;
  badge: any;
  fcm_registration: any;
  os_type = "0";
  numberOfItemsPerPage = 4
  skipLogin = false;
  public lang_direction = "ltr";
  public device_type;
  public currentLang = 'en';
  public transType = 3;
  //locAlert = 1
  public porduction_mode = false;
  userLocAccuracy;
  userLat;
  userLong;
  updateMapTimeOut = 10000;
  userNotifiedBueseOutOfWorkingPeriod = false;
  internetTimeout = 20000;//testing
  // public service_url = "http://mobilewebservices.ekartak.com/autobus/api/";
  // public service_url = "http://192.168.1.32:88/autobus/api/";

  // public service_url = "http://itrootsdemos.com/autobusdev/api/";
  public service_url = "https://itrootsdemos.com/autobusdev/api/";
  
  
  constructor(public http: HttpClient, public platform: Platform, public toastCtrl: ToastController,
    public alertCtrl: AlertController, public storage: Storage, public translate: TranslateService,
    public diagnostic: Diagnostic, public locationAccuracy: LocationAccuracy, private geolocation: Geolocation,
     public events: Events) {
    console.log('Hello HelperProvider Provider');
  }
  busMove(status: number){
    if(status == 4 || status == 5 || status == 6 || status == 7){
      return 0
    }
    else{
      return 1
    }
  }
  // function to show alert to user contains message sent as parameter
  presentAlert(message){
    let alert = this.alertCtrl.create({
      title: this.translate.instant("Notice"),
      message: message,
      buttons: [
        {
          text: this.translate.instant("ok"),
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    this.userNotifiedBueseOutOfWorkingPeriod = true
    alert.present();
  }

  // Function to change app language
  changelang() {

    if (this.currentLang == 'ar') {
      this.translate.setDefaultLang('en');
      this.translate.use('en');
      this.currentLang = 'en';
      this.lang_direction = 'ltr';
      this.platform.setDir('ltr', true);
      this.storage.set("LanguageApp", "en");
    }
    else {
      this.translate.use('ar');
      this.currentLang = 'ar';
      this.translate.setDefaultLang('ar');
      this.lang_direction = 'rtl';
      this.platform.setDir('rtl', true);
      this.storage.set("LanguageApp", "ar");
    }
  }
  // Function to logout from app
  public logout(){
    this.storage.clear().then(()=>{});
    this.events.publish("logout_app");
  }
  //present toast
  public presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  // Function to get device location by requesting authorization
  geoLoc(success) {

    let LocationAuthorizedsuccessCallback = (isAvailable) => {
      //console.log('Is available? ' + isAvailable);
      if (isAvailable) {
        // this.locAlert = 0
        if (this.platform.is('android')) {
          this.diagnostic.getLocationMode().then((status) => {
            if (!(status == "high_accuracy")) {
              this.requestOpenGPS(success)
            }
            else {
              this.GPSOpened(success);
            }
          })
        }
        else {
          this.requestOpenGPS(success);
        }

      }
      else {
        this.requestOpenGPS(success);
      }
    };
    let LocationAuthorizederrorCallback = (e) => {
      console.error(e)
      this.requestOpenGPS(success);
    }
      ;
    this.diagnostic.isLocationAvailable().then(LocationAuthorizedsuccessCallback).catch(LocationAuthorizederrorCallback);

  }
  GPSOpened(success) {
    let optionsLoc = {}
    optionsLoc = { timeout: 30000, enableHighAccuracy: true, maximumAge: 3600 };
    this.geolocation.getCurrentPosition(optionsLoc).then((resp) => {
      //this.events.publish("locationEnabled")
      this.userLat = resp.coords.latitude;
      this.userLong = resp.coords.longitude;
      this.userLocAccuracy = resp.coords.accuracy;
      let data = {
        inspectorLat: resp.coords.latitude,
        inspectorLong: resp.coords.longitude,
        inspectorLocAccuracy: resp.coords.accuracy
      }
      success(data);
    }
    ).catch((error) => {
      success("-1");
    });


  }
  requestOpenGPS(success) {
    if (this.platform.is('ios')) {
      this.diagnostic.isLocationEnabled().then(enabled => {
        if(enabled){
          this.diagnostic.getLocationAuthorizationStatus().then(status => {
            if (status == this.diagnostic.permissionStatus.NOT_REQUESTED) {
              this.diagnostic.requestLocationAuthorization().then(status => {
                if (status == this.diagnostic.permissionStatus.NOT_REQUESTED) {
                  this.locationAccuracy.canRequest().then(requested => {
                    if (requested) {
                      this.requestOpenGPS(success)
                    }
                    else {
                      success("-1")
                    }

                  }).catch(err => success("-1"))
                }
                else if (status == this.diagnostic.permissionStatus.GRANTED || status == this.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE) {
                  this.GPSOpened(success);
                }
                else{
                  success("-1")
                }
              })
            }
            else if (status == this.diagnostic.permissionStatus.DENIED) {
              success("-1")
            }
            else if (status == this.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE) {
              this.GPSOpened(success);
            }
          });
        }
        else{
          this.diagnostic.requestLocationAuthorization().then(val => {
            if (val == "GRANTED") {
              this.requestOpenGPS(success)
            }
            else {
              success("-1")
            }
          })
        }
      })
    }
    else {
      this.diagnostic.isLocationAuthorized().then(authorized => {
        if (authorized) {
          this.locationAccuracy.canRequest().then((canRequest: boolean) => {
            if (canRequest) {
              this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                () => {
                  console.log('Request successful')

                  this.GPSOpened(success);
                },
                error => {
                  console.log('Error requesting location permissions', error);

                  success("-1")
                }
              );
            }

            else {
              console.log('Error requesting location permissions');

              success("-1")

            }
          });
        }
        else {
          this.diagnostic.requestLocationAuthorization().then(val => {
            if (val == "GRANTED") {
              this.requestOpenGPS(success)
            }
            else {
              success("-1")
            }
          })
        }
      })
    }

  }
}

