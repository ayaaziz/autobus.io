import { Component, ViewChild,NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Scroll ,Platform} from 'ionic-angular';
import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';
import { ServicesProvider } from '../../providers/services/services';
import { Storage } from '@ionic/storage';
import { MyLocation, LocationService } from '@ionic-native/google-maps';
declare var $:any;
declare var google;
 var map = undefined;
    var marker = undefined;
    var position = [43, -89];
    var numDeltas = 100;
var delay = 10; //milliseconds
var i = 0;
var deltaLat: number;
var deltaLng: number;
var updateCurrentBusLocInterval: number;
/**
 * Generated class for the SearchPlacesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search-places',
  templateUrl: 'search-places.html',
})
export class SearchPlacesPage {
  @ViewChild('scrollWeb') scrollWeb: Scroll;
  mapLoaded=false;
  fromAddress;
  fromLoc;
  toAddress;
  toLoc;
  buses = [];
  secondTripBuses = [];

  type;
  currentLoc;
  locAddress;
  universitID;
  page = 1;
  hideMoreBtn = true;
  noData = false;
  routeItemToSearch;
  map_type = "ROADMAP";
  //bus_marker
  user_marker
bus_status
  //added from trio details
  @ViewChild('map') mapElement;

  constructor(private platform: Platform,public zone: NgZone,public helper: HelperProvider,public navCtrl: NavController, public navParams: NavParams,
    public serviceApi: ServicesProvider, public translate:TranslateService, public storage: Storage) {

      // determine search source and destination for trip planning, unversity or saved route
    // this.type = navParams.get("type"); commented by amr
    this.type = 1; //added by amr to always force trans1
    if(this.type == 1){
    this.fromLoc = navParams.get("formloc");
    this.fromAddress =  navParams.get("from");
    this.toAddress = navParams.get("to");
    this.toLoc = navParams.get("toloc");
    }
    else if(this.type == 2){
      this.fromAddress = navParams.get("locAddress");
      this.fromLoc = navParams.get("currentLoc");
      this.toAddress = navParams.get("university_name");
      this.currentLoc = navParams.get("currentLoc");
      this.locAddress = navParams.get("locAddress");
      this.toLoc = navParams.get("univID");
      this.universitID = navParams.get("univID");
    }
    else{
      this.routeItemToSearch = navParams.get("routeItem");
    this.fromAddress = this.routeItemToSearch.from_location_address;
    this.toAddress = this.routeItemToSearch.to_location_address;
    }
    this.platform.ready().then(() => {
    });

    this.getSearch();

    this.loadMap();
  }
  // getSearch(){
  //       // this.type == 1 means user determine source and destination else search unversity routes
  //       if(this.type == 1){
  //         this.storage.get("user_token").then(val => {
  //           let access = val ? val.access_token : null
  //           //alert(access)
  //           this.serviceApi.searchResults(1,this.page,access,this.helper.currentLang,this.fromAddress,this.fromLoc,
  //             this.toAddress,this.toLoc,this.helper.transType,(data)=>{
  //               if(!data.success){
  //                 if(data.status == -6){
  //                   this.noData = true;
  //                   this.hideMoreBtn = true;
  //                   this.helper.presentToast(this.translate.instant("outOfZone"));
  //                   return;
  //                 }
  //                 else if(data.status == -5){
  //                   this.noData = true;
  //                   this.hideMoreBtn = true;
  //                   this.helper.presentToast(this.translate.instant("sameSourceAnndDestination"));
  //                   return;
  //                 }
  //                 else if(data.status == -7){
  //                     if(data.errors.workTime)
  //                     this.helper.presentAlert(data.errors.workTime);
  //                     return;
  //                   }
  //               }
  //               console.log(JSON.stringify(data));
  //               if(!data.data.data){
  //                 this.noData = true;
  //                 this.hideMoreBtn = true;
  //                 return;
  //               }
  //               if(this.page == 1 && data.data.data.length == 0){
  //                 this.noData = true;
  //                 this.hideMoreBtn = true;
  //               }
  //               //this.buses = data.data.data;
  //               if(data.data.data.length > 0){
  //                 data.data.data.forEach(element => {
  //                 this.buses.push(element);
  //               });
  //               console.log(this.buses);
  //               this.page += 1;
  //               if(data.data.data.length < data.data.per_page){
  //                 this.hideMoreBtn = true;
  //               }
  //               else{
  //                 this.hideMoreBtn = false;
  //               }
  //               }
  //               else{
  //                 this.hideMoreBtn = true;
  //               }

  //             },(data)=>{
  //               if(data.name == "TimeoutError"){
  //                 this.helper.presentToast(this.translate.instant("TimeoutError"));
  //               }
  //               else{
  //                 this.helper.presentToast(this.translate.instant("serverErr"));
  //               }
  //             })
  //         })
  //       }
  //       else if(this.type == 2){
  //         this.storage.get("user_token").then(val => {
  //           let access = val ? val.access_token : null
  //           this.serviceApi.searchUniversityResults(2,this.toAddress,this.page,this.helper.transType,access,this.helper.currentLang,this.fromLoc,this.universitID,
  //             this.locAddress,(data)=>{
  //               if(!data.success){
  //                 if(data.status == -6){
  //                   this.noData = true;
  //                   this.hideMoreBtn = true;
  //                   this.helper.presentToast(this.translate.instant("outOfZone"));
  //                   return;
  //                 }
  //                 else if(data.status == -5){
  //                   this.noData = true;
  //                   this.hideMoreBtn = true;
  //                   this.helper.presentToast(this.translate.instant("sameSourceAnndDestination"));
  //                   return;
  //                 }
  //                 else if(data.status == -7){
  //                     if(data.errors.workTime)
  //                     this.helper.presentAlert(data.errors.workTime);
  //                     return;
  //                 }
  //               }
  //               console.log(JSON.stringify(data));
  //               if(!data.data.data){
  //                 this.noData = true;
  //                 this.hideMoreBtn = true;
  //                 return;
  //               }
  //               if(this.page == 1 && data.data.data.length == 0){
  //                 this.noData = true;
  //               }
  //               if(data.data.data.length > 0){

  //               data.data.data.forEach(element => {

  //                 this.buses.push(element);
  //               });

  //               this.page += 1;
  //               if(data.data.data.length < data.data.per_page){
  //                 this.hideMoreBtn = true;
  //               }
  //               else{
  //                 this.hideMoreBtn = false;
  //               }
  //             }
  //             },(data)=>{
  //               if(data.name == "TimeoutError"){
  //                 this.helper.presentToast(this.translate.instant("TimeoutError"));
  //               }
  //               else{
  //                 this.helper.presentToast(this.translate.instant("serverErr"));
  //               }
  //             })
  //         })
  //       }

  // }

//ayaaaa//
  getSearch(){
    // this.type == 1 means user determine source and destination else search unversity routes
    if(this.type == 1){
      this.storage.get("user_token").then(val => {
        let access = val ? val.access_token : null
        //alert(access)
        this.serviceApi.searchInnerResults(1,this.page,access,this.helper.currentLang,this.fromAddress,this.fromLoc,
          this.toAddress,this.toLoc,this.helper.transType,(data)=>{
            if(!data.success){
              if(data.status == -6){
                this.noData = true;
                this.hideMoreBtn = true;
                this.helper.presentToast(this.translate.instant("outOfZone"));
                return;
              }
              else if(data.status == -5){
                this.noData = true;
                this.hideMoreBtn = true;
                this.helper.presentToast(this.translate.instant("sameSourceAnndDestination"));
                return;
              }
              else if(data.status == -7){
                  if(data.errors.workTime)
                  this.helper.presentAlert(data.errors.workTime);
                  return;
                }
            }
            console.log(JSON.stringify(data));
            if(!data.data.data){
              this.noData = true;
              this.hideMoreBtn = true;
              return;
            }
            if(this.page == 1 && data.data.data.length == 0){
              this.noData = true;
              this.hideMoreBtn = true;
            }
            //this.buses = data.data.data;
            if(data.data.data.length > 0){
              data.data.data.forEach(element => {

              
                  //aya
                  // array of trips with type of each trip (direct/indirect)
                  if(!element.secondTrip) {
                    this.buses.push( {
                      el: element,
                      type:"directTrip"
                    });
                  } else {
                    this.buses.push( {
                      el: element,
                      type:"inDirectTrip"
                    });
                    // this.secondTripBuses.push(element);
                  }

            });
            console.log(this.buses);
            this.page += 1;
            if(data.data.data.length < data.data.per_page){
              this.hideMoreBtn = true;
            }
            else{
              this.hideMoreBtn = false;
            }

            this.loadMap();
            

            }
            else{
              this.hideMoreBtn = true;
            }

          },(data)=>{
            if(data.name == "TimeoutError"){
              this.helper.presentToast(this.translate.instant("TimeoutError"));
            }
            else{
              this.helper.presentToast(this.translate.instant("serverErr"));
            }
          })
      })
    }
    else if(this.type == 2){
      this.storage.get("user_token").then(val => {
        let access = val ? val.access_token : null
        this.serviceApi.searchUniversityResults(2,this.toAddress,this.page,this.helper.transType,access,this.helper.currentLang,this.fromLoc,this.universitID,
          this.locAddress,(data)=>{
            if(!data.success){
              if(data.status == -6){
                this.noData = true;
                this.hideMoreBtn = true;
                this.helper.presentToast(this.translate.instant("outOfZone"));
                return;
              }
              else if(data.status == -5){
                this.noData = true;
                this.hideMoreBtn = true;
                this.helper.presentToast(this.translate.instant("sameSourceAnndDestination"));
                return;
              }
              else if(data.status == -7){
                  if(data.errors.workTime)
                  this.helper.presentAlert(data.errors.workTime);
                  return;
              }
            }
            console.log(JSON.stringify(data));
            if(!data.data.data){
              this.noData = true;
              this.hideMoreBtn = true;
              return;
            }
            if(this.page == 1 && data.data.data.length == 0){
              this.noData = true;
            }
            if(data.data.data.length > 0){

            data.data.data.forEach(element => {

              this.buses.push({
                el: element,
                type:"directTrip"
              });
            });

            this.page += 1;
            if(data.data.data.length < data.data.per_page){
              this.hideMoreBtn = true;
            }
            else{
              this.hideMoreBtn = false;
            }
          }
          },(data)=>{
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
//ayaaa///

  // Function executed when view loaded
  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPlacesPage');
    if(!navigator.onLine){
      this.helper.presentToast(this.translate.instant("internetError"));
      return;
    }
    if(this.hideMoreBtn == false){
    this.getSearch();
  }
  }
  loadMap(){
    this.zone.run(() => {
      if (!this.mapLoaded) {
        this.zone.run(() => {
          setTimeout(() => {
            this.initMap();
            this.mapLoaded = true;
          }, 1000);
        })
      }
    });
  }
  // Function to open trip details view
  openTripDetails(item){
    this.navCtrl.push("TripDetailsPage",{details:item, type: this.type , fromAddress: this.fromAddress , fromLoc : this.fromLoc, toLoc: this.toLoc, toAddress: this.toAddress});

  }
  mapTypeChanged(type) {
    this.map_type = type;
    if (this.map_type == "ROADMAP") {
      map.setMapTypeId("roadmap");
    }
    else {
      map.setMapTypeId("satellite");
    }
  }
  initMap() {
    if(this.noData != true){
      console.log("buses** "+JSON.stringify(this.buses))
      console.log("buses[0]** "+this.buses[0])

    let latlng = new google.maps.LatLng(this.buses[0].el.lat, this.buses[0].el.lng);
    var myOptions = {
      zoom: 15,
      center: latlng,
      disableDefaultUI: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById("map_s"), myOptions);
    var kmlLayer = new google.maps.KmlLayer(this.buses[0].el.path_file, {
      suppressInfoWindows: true,
      preserveViewport: true,
      map: map
    });
    let url = "assets/imgs/bus587.png";

    marker = new google.maps.Marker({
      position: new google.maps.LatLng(this.buses[0].el.lat, this.buses[0].el.lng),
      map: map,
      draggable: false,
      //animation: google.maps.Animation.DROP,
      icon: {
        url: url,
        scaledSize: new google.maps.Size(40, 40)
      }
    });
   setTimeout(() => {
     $('img[src="assets/imgs/bus587.png"]').css({
      'transform': 'rotate(' + (360 - parseInt(this.buses[0].el.angle)) + 'deg)'
    });
   }, 1000);
    let stopLatlng = (this.buses[0].el.busRouteDistanceFeet.closetPoint).split(',');
    new google.maps.Marker({
      position: new google.maps.LatLng(stopLatlng[0], stopLatlng[1]),
      map: map,
      icon: {
        url: 'assets/imgs/busStop.png',
        draggable: false,
      }
    });
    LocationService.getMyLocation().then((myLocation: MyLocation) => {
      this.user_marker = new google.maps.Marker({
        position: new google.maps.LatLng(myLocation.latLng.lat, myLocation.latLng.lng),
        map: map,
        icon: {
          url: 'assets/icon/blue_dot.png',
          draggable: false,
        }
      });
    })
    this.updateCurrentBusLocation();
  }
  }
  ionViewWillLeave() {
    clearInterval(updateCurrentBusLocInterval);
    localStorage.setItem("DetailsViewActive","0");
  }
  // Update current bus location over map
  updateCurrentBusLocation() {

    updateCurrentBusLocInterval = setInterval(() => {
      let activeStaus =localStorage.getItem("DetailsViewActive");
      if(activeStaus == "0"){
        console.log("details view not active");
        return
      }
      if (!navigator.onLine) {
        this.helper.presentToast(this.translate.instant("internetError"));
        return;
      }
      this.serviceApi.getBusLocation(this.buses[0].el.bus_id, this.helper.currentLang, (data) => {
        //this.bus_marker.setMap(null)
        this.user_marker.setMap(null);
        // this.bus_status = this.helper.busMove(this.buses[0].bus_status) == 1 ? this.translate.instant('move') : this.translate.instant('stop');
        $('img[src="assets/imgs/bus587.png"]').css({
        'transform': 'rotate(' + (360 - parseInt(this.buses[0].el.angle)) + 'deg)'
      });
      map.setCenter({lat:parseFloat(data.data.bus.lat), lng:parseFloat(data.data.bus.lng)});
        this.transitionT([parseFloat(data.data.bus.lat),parseFloat(data.data.bus.lng)]);
        LocationService.getMyLocation().then((myLocation: MyLocation) => {
          this.user_marker = new google.maps.Marker({
            position: new google.maps.LatLng(myLocation.latLng.lat, myLocation.latLng.lng),
            map: map,
            icon: {
              url: 'assets/icon/blue_dot.png',
              draggable: false,
            }
          });
       })
      }, () => {

      })
    }, this.helper.updateMapTimeOut);
  }
// Move bus over map
transitionT(result){
  i = 0;
  deltaLat = (result[0] - position[0])/numDeltas;
  deltaLng = (result[1] - position[1])/numDeltas;
  this.moveMarkerT();
}

moveMarkerT(){
  position[0] += deltaLat;
  position[1] += deltaLng;
  var latlng = new google.maps.LatLng(position[0], position[1]);
  console.log("marker "+marker );
  marker.setPosition(latlng);
  if(i!=numDeltas){
      i++;
      setTimeout(()=>{this.moveMarkerT()}, delay);
  }
}

}
