import { Component, ViewChild } from '@angular/core';
import { Platform, Events, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../pages/login/login';
import { TranslateService } from '@ngx-translate/core';
import { HelperProvider } from '../providers/helper/helper';
import { TransportationTypePage } from '../pages/transportation-type/transportation-type';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

@Component({
  templateUrl: 'app.html',
  providers: [Push]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any;

  constructor(public storage: Storage,public platform: Platform, statusBar: StatusBar,public helper: HelperProvider,
    public translate: TranslateService, splashScreen: SplashScreen, public events: Events, public push: Push) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.overlaysWebView(false);
      statusBar.backgroundColorByHexString("#006098");
      splashScreen.hide();
      this.initializeApp();
      events.subscribe("logout_app", () => {
        this.nav.setRoot(LoginPage)
      });
    });
  }

  //initialize app
  initializeApp(){
    this.storage.get("LanguageApp").then((val) => {
      if (!val) {
        // if offline lang value not saved get mobile language.
        var userLang = navigator.language.split('-')[0];
        // check if mobile lang is arabic.
        if (userLang == 'ar') {
          this.translate.use('ar');
          this.helper.currentLang = 'ar';
          this.translate.setDefaultLang('ar');
          this.helper.lang_direction = 'rtl';
          this.platform.setDir('rtl', true)
          //  this.menuDirection = "right";
          this.storage.set("LanguageApp", "ar");
        }
        else {
          // if mobile language isn't arabic then make application language is English.

          this.translate.setDefaultLang('en');
          this.translate.use('en');
          this.helper.currentLang = 'en';
          this.helper.lang_direction = 'ltr';
          this.platform.setDir('ltr', true)
          //   this.menuDirection = "left";
          this.storage.set("LanguageApp", "en");
        }
      }
      //If application language is saved offline and it is arabic.
      else if (val == 'ar') {
        this.translate.use('ar');
        this.helper.currentLang = 'ar';
        this.translate.setDefaultLang('ar');
        this.helper.lang_direction = 'rtl';
        this.platform.setDir('rtl', true)
      }
      else if (val == 'en') {
        this.translate.setDefaultLang('en');
        this.translate.use('en');
        this.helper.currentLang = 'en';
        this.helper.lang_direction = 'ltr';
        this.platform.setDir('ltr', true)
      }
      // determine if user loged before, if find user token open view to update his/her transportation type else open login view.
      this.storage.get('user_token')
      .then((val) => {
        this.pushnotification();
        if(val){
          this.rootPage = TransportationTypePage
        }
        else{
          this.rootPage = LoginPage
        }
      })
    });

  }

  //initialize app to recieve notifications
  pushnotification() {
    let options: PushOptions
    options = {
      android: {
        forceShow:true
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'true'
      }
    }
    this.push.createChannel({
      id: "channel1",
      description: "autobus channel",
      importance: 5,
     }).then(() => console.log('Channel created'));
    const pushObject: PushObject = this.push.init(options);
    pushObject.on('notification').subscribe((notification: any) => {
      console.log("notification " + JSON.stringify(notification))
      if (this.platform.is('ios')) {
        if (notification.additionalData.foreground == true) {}
        alert(notification["title"] + '\n' +notification["message"])
      }
    });
    pushObject.on('registration').subscribe((registration: any) => {
      console.log("registrationId " + registration.registrationId)
      this.helper.fcm_registration = registration.registrationId;
      if (this.platform.is('ios')) {
        this.helper.os_type = "1"
      }
      else {
        this.helper.os_type = "2"
      }
    });

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));

  }
}
