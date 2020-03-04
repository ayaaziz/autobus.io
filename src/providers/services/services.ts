import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperProvider } from '../helper/helper';
import { LoadingController } from 'ionic-angular';
import 'rxjs/add/operator/timeout';

/*
  Generated class for the ServicesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()

//ServicesProvider class contains all functions that calls app APIs
export class ServicesProvider {

  constructor(public helper: HelperProvider, public http: HttpClient, public loadingCtrl: LoadingController) {
    console.log('Hello ServicesProvider Provider');
  }

  // user login function
  userLogin(email, password,lang, SuccessCallback, FailureCallback) {
    let loader = this.loadingCtrl.create({
      content: "",
    });
    loader.present();
    let headers = new HttpHeaders();
    //let lang = this.helper.currentLang == "en" ? 1 : 2
    let parameter = new HttpParams().set('email', email).set('password', password).set('lang', lang)
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded'); //.set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggsso'));
    let serviceUrl = this.helper.service_url + 'login';
    this.http.post(serviceUrl, parameter, { headers: headers })
      .timeout(this.helper.internetTimeout)
      .subscribe(
        data => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          console.log(JSON.stringify(data))
          SuccessCallback(data)
        },
        err => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          FailureCallback(err)
        }
      )

  }

  // register user function
  userRegister(fullname, email, password, password_confirmation, phone, lang,country,gender, SuccessCallback, FailureCallback) {
    let loader = this.loadingCtrl.create({
      content: "",
    });
    loader.present();
    let headers = new HttpHeaders();
    let parameter = new HttpParams().set('fullname', fullname).set('gender', gender).set('email', email).set('password', password).set('lang', lang).set("password_confirmation",password_confirmation).set("phone",phone).set("country",country)
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded'); //.set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggsso'));
    let serviceUrl = this.helper.service_url + 'register';
    this.http.post(serviceUrl, parameter, { headers: headers })
      .timeout(this.helper.internetTimeout)
      .subscribe(
        data => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          console.log(JSON.stringify(data))
          SuccessCallback(data)
        },
        err => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          FailureCallback(err)
        }
      )

  }

  // get user data by sending user access token
  userData(accessToken, SuccessCallback, FailureCallback) {
    let loader = this.loadingCtrl.create({
      content: "",
    });
    loader.present();
    let headers = new HttpHeaders().set('Authorization', 'Bearer '+ localStorage.getItem("kdkvfkhggssoauto"));;
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    let serviceUrl = this.helper.service_url + 'getUser';
    this.http.get(serviceUrl,  { headers: headers })
      .timeout(this.helper.internetTimeout)
      .subscribe(
        data => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          console.log("user info "+JSON.stringify(data))
          SuccessCallback(data)
        },
        err => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          FailureCallback(err)
        }
      )

  }

  // get countries list funtion
  getCountries(lang, SuccessCallback, FailureCallback) {
    let loader = this.loadingCtrl.create({
      content: "",
    });
    loader.present();
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    let parameter = new HttpParams().set('lang', lang);
    let serviceUrl = this.helper.service_url + 'countries';
    this.http.post(serviceUrl,parameter,{ headers: headers })
      .timeout(this.helper.internetTimeout)
      .subscribe(
        data => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          console.log("user info "+JSON.stringify(data))
          SuccessCallback(data)
        },
        err => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          FailureCallback(err)
        }
      )

  }

  // get universities list function
  getUniversities(lang, SuccessCallback, FailureCallback) {
    let loader = this.loadingCtrl.create({
      content: "",
    });
    loader.present();
    let headers = new HttpHeaders();
    let parameter = new HttpParams().set('lang', lang)
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    let serviceUrl = this.helper.service_url + 'universities ';
    this.http.post(serviceUrl, parameter, { headers: headers })
      .timeout(this.helper.internetTimeout)
      .subscribe(
        data => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          console.log("user info "+JSON.stringify(data))
          SuccessCallback(data)
        },
        err => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          FailureCallback(err)
        }
      )

  }

  // verify user email function
  verifyUser(email,code,lang, SuccessCallback, FailureCallback) {
    let loader = this.loadingCtrl.create({
      content: "",
    });
    loader.present();
    let headers = new HttpHeaders();
    let parameter = new HttpParams().set('email', email).set('code', code).set('lang', lang)
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    let serviceUrl = this.helper.service_url + 'verifyEmail';
    this.http.post(serviceUrl,parameter,  { headers: headers })
      .timeout(this.helper.internetTimeout)
      .subscribe(
        data => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          console.log("user info "+JSON.stringify(data))
          SuccessCallback(data)
        },
        err => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          FailureCallback(err)
        }
      )

  }

  // change user password function
  changePassword(current_password,password,password_confirmation,lang,access_token, SuccessCallback, FailureCallback) {
    let loader = this.loadingCtrl.create({
      content: "",
    });
    loader.present();
    let headers = new HttpHeaders();
    let parameter = new HttpParams().set('current_password', current_password).set('password', password).set('password_confirmation', password_confirmation).set('lang',lang)
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem("kdkvfkhggssoauto"));
    let serviceUrl = this.helper.service_url + 'changePassword';
    this.http.post(serviceUrl,parameter,  { headers: headers })
      .timeout(this.helper.internetTimeout)
      .subscribe(
        data => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          console.log("user info "+JSON.stringify(data))
          SuccessCallback(data)
        },
        err => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          FailureCallback(err)
        }
      )

  }

  //change language by sending selected language b user
  changeLanguage(lang,access_token, SuccessCallback, FailureCallback) {

    let headers = new HttpHeaders();
    let parameter = new HttpParams().set('lang', lang)
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem("kdkvfkhggssoauto"));
    let serviceUrl = this.helper.service_url + 'changeLanguage';
    this.http.post(serviceUrl,parameter,  { headers: headers })
      .timeout(this.helper.internetTimeout)
      .subscribe(
        data => {
          console.log("user info "+JSON.stringify(data))
          SuccessCallback(data)
        },
        err => {
          FailureCallback(err)
        }
      )

  }

  // reset password function
  resetPassword(email, SuccessCallback, FailureCallback) {
    let loader = this.loadingCtrl.create({
      content: "",
    });
    loader.present();
    let headers = new HttpHeaders();
    let parameter = new HttpParams().set('email', email)
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded')
    let serviceUrl = this.helper.service_url + 'resetPassword';
    this.http.post(serviceUrl,parameter,  { headers: headers })
      .timeout(this.helper.internetTimeout)
      .subscribe(
        data => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          console.log("user info "+JSON.stringify(data))
          SuccessCallback(data)
        },
        err => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          FailureCallback(err)
        }
      )
  }

  // update forget password function
  updateForgetPassword(code,password, SuccessCallback, FailureCallback) {
    let loader = this.loadingCtrl.create({
      content: "",
    });
    loader.present();
    let headers = new HttpHeaders();
    let parameter = new HttpParams().set('code', code).set('password', password)
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded')
    let serviceUrl = this.helper.service_url + 'updateForgetPassword';
    this.http.post(serviceUrl,parameter,  { headers: headers })
      .timeout(this.helper.internetTimeout)
      .subscribe(
        data => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          console.log("user info "+JSON.stringify(data))
          SuccessCallback(data)
        },
        err => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          FailureCallback(err)
        }
      )
  }
// rate buses function
  rateReviews(bus_id,rate,review,type, SuccessCallback, FailureCallback) {
    let loader = this.loadingCtrl.create({
      content: "",
    });
    loader.present();
    let headers = new HttpHeaders();
    let parameter = new HttpParams().set('bus_id', bus_id).set('rate', rate).set('review', review).set('type', type)
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded')
    let serviceUrl = this.helper.service_url + 'rateReviews';
    this.http.post(serviceUrl,parameter,  { headers: headers })
      .timeout(this.helper.internetTimeout)
      .subscribe(
        data => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          console.log("user info "+JSON.stringify(data))
          SuccessCallback(data)
        },
        err => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          FailureCallback(err)
        }
      )
  }

  // Delete saves routes function
  deleteSavedRoute(access_token,id,lang, SuccessCallback, FailureCallback) {
    let loader = this.loadingCtrl.create({
      content: "",
    });
    loader.present();
    let headers = new HttpHeaders();
    if(access_token){
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem("kdkvfkhggssoauto"))
    }
    else{
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded')
    }
    let parameter = new HttpParams().set('id', id).set('lang', lang)

    let serviceUrl = this.helper.service_url + 'deleteSavedRoute';
    this.http.post(serviceUrl,parameter,  { headers: headers })
      .timeout(this.helper.internetTimeout)
      .subscribe(
        data => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          console.log("user info "+JSON.stringify(data))
          SuccessCallback(data)
        },
        err => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          FailureCallback(err)
        }
      )
  }

  // contact us function
  contactUs(access_token,email,subject,message,mobile,lang, SuccessCallback, FailureCallback) {
    let loader = this.loadingCtrl.create({
      content: "",
    });
    loader.present();
    let headers = new HttpHeaders();
    if(access_token){
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem("kdkvfkhggssoauto"))
    }
    else{
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded')
    }
    let parameter = new HttpParams().set('email', email).set('subject', subject).set('message', message).set('lang', lang).set("mobile",mobile)
    let serviceUrl = this.helper.service_url + 'contactUs';
    this.http.post(serviceUrl,parameter,  { headers: headers })
      .timeout(this.helper.internetTimeout)
      .subscribe(
        data => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          console.log("user info "+JSON.stringify(data))
          SuccessCallback(data)
        },
        err => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          FailureCallback(err)
        }
      )
  }

  // allow user to update his/ her transportation type
  updateTrans(lang,user_id,trans_type, SuccessCallback, FailureCallback) {
    let loader = this.loadingCtrl.create({
      content: "",
    });
    //added by amr to make all users public
    trans_type=3;
    loader.present();
    let headers = new HttpHeaders();
    let parameter = new HttpParams().set('trans_type', trans_type).set("lang",lang)
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem("kdkvfkhggssoauto"));
    let serviceUrl = this.helper.service_url + 'editTransportationType';
    this.http.post(serviceUrl,parameter,  { headers: headers })
      .timeout(this.helper.internetTimeout)
      .subscribe(
        data => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          console.log("user info "+JSON.stringify(data))
          SuccessCallback(data)
        },
        err => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          FailureCallback(err)
        }
      )

  }

  //update user location
  updateUserTracking(accessToken, user_id,location,lang,SuccessCallback, FailureCallback) {
    let headers = new HttpHeaders();
    let parameter = new HttpParams().set('user_id', user_id).set('location', location).set('lang',lang)
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem("kdkvfkhggssoauto"));
    let serviceUrl = this.helper.service_url + 'updateUserTracking';
    this.http.post(serviceUrl,parameter,  { headers: headers })
      .timeout(this.helper.internetTimeout)
      .subscribe(
        data => {
          console.log("user info "+JSON.stringify(data))
          SuccessCallback(data)
        },
        err => {
          FailureCallback(err)
        }
      )
  }
  //get contact info
  contactInfo(access_token, SuccessCallback, FailureCallback) {

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    if(access_token){
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem("kdkvfkhggssoauto"))
    }
    let serviceUrl = this.helper.service_url + 'getContactInformation';
    this.http.get(serviceUrl,  { headers: headers })
      .timeout(this.helper.internetTimeout)
      .subscribe(
        data => {
          console.log("user info "+JSON.stringify(data))
          SuccessCallback(data)
        },
        err => {
          FailureCallback(err)
        }
      )

  }
  //get nearest buses k
  getBusNearBy(fcm_registration,os_type,access_token,lang,current_loc,transType,SuccessCallback, FailureCallback) {
    let headers = new HttpHeaders();
    //"31.9868,35.6899"
    let parameter = new HttpParams().set('lang',lang).set("current_location",current_loc)
    .set("trans_type",transType).set("fcm_registration",fcm_registration).set("os_type",os_type)
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    if(access_token){
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem("kdkvfkhggssoauto"))
    }
    let serviceUrl = this.helper.service_url + 'getBusNearBy';
    this.http.post(serviceUrl,parameter,  { headers: headers })
    .timeout(this.helper.updateMapTimeOut)
      .subscribe(
        data => {
          console.log("user info "+JSON.stringify(data) + "trans type = " + transType);
          //display server api response
          SuccessCallback(data)
        },
        err => {
          FailureCallback(err)
        }
      )
  }
  //-------------update user Info--------
  updateUserInfo(access_token,lang,userName,userMail,UserPhone,SuccessCallback,FailureCallback){
    let loader = this.loadingCtrl.create({
      content: "",
    });
    loader.present();
    let headers = new HttpHeaders().set('Authorization', 'Bearer '+ localStorage.getItem("kdkvfkhggssoauto"));
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    let parameter = new HttpParams().set('lang',lang).set('fullname',userName).set('email',userMail).set('phone',UserPhone);
    let serviceUrl = this.helper.service_url + 'editUser';
    this.http.post(serviceUrl,parameter,  { headers: headers })
      .timeout(this.helper.internetTimeout)
      .subscribe(
        data => {
          console.log("updateSuccess "+JSON.stringify(data))
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          SuccessCallback(data)
        },
        err => {
          console.log("updateFail"+JSON.stringify(err))
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          FailureCallback(err)
        }
      )
  }
  //--------------------------- Search Results -------------------------------
  searchResults(trip_type,page,access_token,lang,from_address,from_location,to_address,to_location,trans_type,SuccessCallback,FailureCallback){
    let loader = this.loadingCtrl.create({
      content: "",
    });
    loader.present();
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    if(access_token){
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem("kdkvfkhggssoauto"))
    }
    let parameter = new HttpParams().set('lang',lang).set('page',page).set('trans_type',trans_type).set('from_location',from_location).set('to_location',to_location).set("to_address",to_address).set("from_address",from_address).set("type",trip_type);
    let serviceUrl = this.helper.service_url + 'searchBusNearBy';
    this.http.post(serviceUrl,parameter,  { headers: headers })

      .subscribe(
        data => {
          console.log("updateSuccess "+JSON.stringify(data))
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          SuccessCallback(data)
        },
        err => {
          console.log("updateFail"+JSON.stringify(err))
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          FailureCallback(err)
        }
      )
  }

  //--------------------------- Search University Results -------------------------------
  searchUniversityResults(trip_type,to_address,page,transType,access_token,lang,current_location,university_id,
    current_Address,SuccessCallback,FailureCallback){
    let loader = this.loadingCtrl.create({
      content: "",
    });
    loader.present();
    let headers = new HttpHeaders();
    if(access_token){
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem("kdkvfkhggssoauto"))
    }
    else{
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    }
    let parameter = new HttpParams().set('lang',lang).set('page',page).set("trans_type",transType)
    .set("current_location",current_location).set("university_id",university_id).set("from_address",current_Address)
    .set("to_address",to_address).set("current_Address",current_Address).set("type",trip_type)
    let serviceUrl = this.helper.service_url + 'getUniversityRoutes';
    this.http.post(serviceUrl,parameter,  { headers: headers })
     // .timeout(this.helper.internetTimeout)
      .subscribe(
        data => {
          console.log("updateSuccess "+JSON.stringify(data))
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          SuccessCallback(data)
        },
        err => {
          console.log("updateFail"+JSON.stringify(err))
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          FailureCallback(err)
        }
      )
  }
  //----------------------------getRecentSearch--------------
  getSavedSearch(page,access_token,SuccessCallback,FailureCallback){
    // let loader = this.loadingCtrl.create({
    //   content: "",
    // });
    // loader.present();
    let headers = new HttpHeaders().set('Authorization', 'Bearer '+ localStorage.getItem("kdkvfkhggssoauto"));
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    let parameter = new HttpParams().set('page',page)
    let serviceUrl = this.helper.service_url + 'getSavedSearch';
    this.http.post(serviceUrl,parameter,{ headers: headers })
      .timeout(this.helper.internetTimeout)
      .subscribe(
        data => {
          console.log("updateSuccessRecentlySearch "+JSON.stringify(data))
          //loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          SuccessCallback(data)
        },
        err => {
          console.log("updateFail"+JSON.stringify(err))
          //loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          FailureCallback(err)
        }
      )
  }

  //----------------------------getgetBusLocation--------------
  getBusLocation(bus_id, lang,SuccessCallback,FailureCallback){
    let headers = new HttpHeaders()
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    let parameter = new HttpParams().set('bus_id',bus_id).set("lang",lang)
    let serviceUrl = this.helper.service_url + 'getSavedBus';
    this.http.post(serviceUrl,parameter,{ headers: headers })
      .timeout(this.helper.updateMapTimeOut)
      .subscribe(
        data => {
          console.log("updateSuccessRecentlySearch "+JSON.stringify(data))
          //loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          SuccessCallback(data)
        },
        err => {
          console.log("updateFail"+JSON.stringify(err))
          //loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          FailureCallback(err)
        }
      )
  }

  //----------------------------getgetBusLocation--------------
  getSavedBusesSearch(lang,access_token,SuccessCallback,FailureCallback){
    let headers = new HttpHeaders().set('Authorization', 'Bearer '+ localStorage.getItem("kdkvfkhggssoauto"));
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    let parameter = new HttpParams().set("lang",lang)
    let serviceUrl = this.helper.service_url + 'getSavedBusesSearch';
    this.http.post(serviceUrl,parameter,{ headers: headers })
      // .timeout(this.helper.updateMapTimeOut) removed timer amr
      .subscribe(
        data => {
          console.log("updateSuccessRecentlySearch "+JSON.stringify(data))
          //loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          SuccessCallback(data)
        },
        err => {
          console.log("updateFail"+JSON.stringify(err))
          //loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          FailureCallback(err)
        }
      )
  }

  //----------------------------getgetBusLocation--------------
  getBusDetails(current_location,route_id,bus_id,lang,SuccessCallback,FailureCallback){
    let loader = this.loadingCtrl.create({
      content: "",
    });
    loader.present();
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    let parameter = new HttpParams().set("lang",lang).set("current_location",current_location)
    .set("route_id",route_id).set("bus_id",bus_id);
    let serviceUrl = this.helper.service_url + 'getRoutesDetails';
    this.http.post(serviceUrl,parameter,{ headers: headers })
      .timeout(this.helper.internetTimeout)
      .subscribe(
        data => {
          console.log("updateSuccessRecentlySearch "+JSON.stringify(data))
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          SuccessCallback(data)
        },
        err => {
          console.log("updateFail"+JSON.stringify(err))
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          FailureCallback(err)
        }
      )
  }

  //saved location
  getRecentSearch(access_token,SuccessCallback,FailureCallback){
    // let loader = this.loadingCtrl.create({
    //   content: "",
    // });
    // loader.present();
    let headers = new HttpHeaders().set('Authorization', 'Bearer '+ localStorage.getItem("kdkvfkhggssoauto"));
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    let serviceUrl = this.helper.service_url + 'getRecentSearch';
    this.http.post(serviceUrl,null,{ headers: headers })
      .timeout(this.helper.internetTimeout)
      .subscribe(
        data => {
          console.log("updateSuccessRecentlySearch "+JSON.stringify(data))
          //loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          SuccessCallback(data)
        },
        err => {
          console.log("updateFail"+JSON.stringify(err))
          //loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          FailureCallback(err)
        }
      )
  }
    //----------------------submit route----------------
    saveRoute(type,access_token,lang,route_id,bus_id,from_location,to_location,from_location_address,to_location_address, SuccessCallback,FailureCallback){
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders().set('Authorization', 'Bearer '+ localStorage.getItem("kdkvfkhggssoauto"));
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
      let parameter = new HttpParams().set('lang',lang).set('route_id',route_id)
      .set('to_location_address',to_location_address).set('from_location_address',from_location_address)
      .set('bus_id',bus_id).set('from_location',from_location).set('to_location',to_location).set("trip_type",type);
      let serviceUrl = this.helper.service_url + 'savedUserRoutes';
      this.http.post(serviceUrl,parameter,  { headers: headers })
        .timeout(this.helper.internetTimeout)
        .subscribe(
          data => {
            console.log("updateSuccess "+JSON.stringify(data))
            loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
            SuccessCallback(data)
          },
          err => {
            console.log("updateFail"+JSON.stringify(err))
            loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
            FailureCallback(err)
          }
        )

    }
  //----------------------submit review----------------
  submitReview(access_token,bus_id,rate,review,type, SuccessCallback,FailureCallback){
    let loader = this.loadingCtrl.create({
      content: "",
    });
    loader.present();
    let headers = new HttpHeaders().set('Authorization', 'Bearer '+ localStorage.getItem("kdkvfkhggssoauto"));
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    let parameter = new HttpParams().set('bus_id',bus_id).set('rate',rate)
    .set('review',review).set('type',type);
    let serviceUrl = this.helper.service_url + 'rateReviews';
    this.http.post(serviceUrl,parameter,  { headers: headers })
      .timeout(this.helper.internetTimeout)
      .subscribe(
        data => {
          console.log("updateSuccess "+JSON.stringify(data))
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          SuccessCallback(data)
        },
        err => {
          console.log("updateFail"+JSON.stringify(err))
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          FailureCallback(err)
        }
      )

  }
  // check current password entered by user to allow him/her to update his password
  checkCurrentPassword(access_token,password, SuccessCallback,FailureCallback){
    let loader = this.loadingCtrl.create({
      content: "",
    });
    loader.present();
    let headers = new HttpHeaders().set('Authorization', 'Bearer '+ localStorage.getItem("kdkvfkhggssoauto"));
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    let parameter = new HttpParams().set('current_password',password)
    let serviceUrl = this.helper.service_url + 'checkPassword';
    this.http.post(serviceUrl,parameter,  { headers: headers })
      .timeout(this.helper.internetTimeout)
      .subscribe(
        data => {
          console.log("updateSuccess "+JSON.stringify(data))
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          SuccessCallback(data)
        },
        err => {
          console.log("updateFail"+JSON.stringify(err))
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          FailureCallback(err)
        }
      )

  }

  //-----------get terms and conditions
  getTermsAndCondition(lang,SuccessCallback, FailureCallback){
    let loader = this.loadingCtrl.create({
      content: "",
    });
    loader.present();
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    let parameter = new HttpParams().set('lang',lang)
    let serviceUrl = this.helper.service_url + 'getTermsData';
    this.http.post(serviceUrl,parameter,  { headers: headers })
      .timeout(this.helper.internetTimeout)
      .subscribe(
        data => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          SuccessCallback(data)
        },
        err => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          FailureCallback(err)
        }
      )

  }
//----------------------getSearchFromSaved----------------
getSearchFromSaved(page,access_token,route_id,lang, SuccessCallback,FailureCallback){
  let loader = this.loadingCtrl.create({
    content: "",
  });
  loader.present();
  let headers = new HttpHeaders().set('Authorization', 'Bearer '+ localStorage.getItem("kdkvfkhggssoauto"));
  headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
  let parameter = new HttpParams().set('id',route_id).set('lang',lang).set("page",page)
  let serviceUrl = this.helper.service_url + 'getBusUserRouteSaved';
  this.http.post(serviceUrl,parameter,  { headers: headers })
    .subscribe(
      data => {
        console.log("updateSuccess "+JSON.stringify(data))
        loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
        SuccessCallback(data)
      },
      err => {
        console.log("updateFail"+JSON.stringify(err))
        loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
        FailureCallback(err)
      }
    )

}
}
