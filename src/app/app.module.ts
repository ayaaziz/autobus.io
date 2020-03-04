import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { TripPlanningPage } from '../pages/trip-plannig-tab/trip-plannig-tab';
import { AccountPage } from '../pages/account-tab/account-tab';
import { HomePage } from '../pages/home/home';
import { UniversityPage } from '../pages/university/university';
import { ModalAutocompleteItems } from  '../pages/modal-autocomplete-items/modal-autocomplete-items';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { TransportationTypePage } from '../pages/transportation-type/transportation-type';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RefreshTokenInterceptor } from '../providers/refresh-token.interceptor';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import { HelperProvider } from '../providers/helper/helper';
import { ServicesProvider } from '../providers/services/services';
import { TranslateModule, TranslateLoader} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient} from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { PaymentPage } from '../pages/payment/payment';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import {BarcodeScanner} from '@ionic-native/barcode-scanner';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';
import { Stripe } from '@ionic-native/stripe';

import {
  GoogleMaps
} from '@ionic-native/google-maps';


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    TripPlanningPage,
    AccountPage,
    HomePage,
    UniversityPage,
    TabsPage,
    LoginPage,
    TransportationTypePage,
    ModalAutocompleteItems,
    PaymentPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp,{tabsHideOnSubPages:"true"}),
    NgxQRCodeModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TripPlanningPage,
    AccountPage,
    HomePage,
    UniversityPage,
    TabsPage,
    LoginPage,
    TransportationTypePage,
    ModalAutocompleteItems,
    PaymentPage
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: RefreshTokenInterceptor, multi: true },
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HelperProvider,
    Geolocation,
    Diagnostic,
    LocationAccuracy,
    GoogleMaps,
    ServicesProvider,
    InAppBrowser,
    BarcodeScanner,
    PayPal,
    Stripe

  ]
})
export class AppModule {}
