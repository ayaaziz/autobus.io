import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { HelperProvider } from '../../providers/helper/helper';
import { MyLocation, LocationService } from '@ionic-native/google-maps';
import { ServicesProvider } from '../../providers/services/services';
import { Storage } from '@ionic/storage';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
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
 * Generated class for the TripDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-trip-details',
  templateUrl: 'trip-details.html',
  providers: [LaunchNavigator]
})
export class TripDetailsPage {
  @ViewChild('map') mapElement;
  userSource = "Source";
  busEstArrivall;
  startTime;
  userStopTime;
  busEstDeptTime;
  busAveStopTime;
  userFeetSource;
  userFeetDest;
  endTime;
  userDestAddress: string;
  //map: any;
  tripDetails;
  busNumber: String;
  section = 'one';
  mapLoaded = false;
  driver_name: String;
  fromLoc: string;
  fromAddress: string;
  toLoc: string;
  toAddress: string;
  type: any;
  map_type = "ROADMAP"
  //bus_marker
  user_marker
  bus_status


  //aya//////
  userStopTime2;
  busEstDeptTime2;
  busAveStopTime2;
  busEstArrivall2;

  secondTripBuses = [];
  currentLoc;
  locAddress;
  universitID;
  page = 1;
  hideMoreBtn = true;
  noData = false;
  //aya/////


  tripDetailsSegment: string = "Detials";
  constructor(private launchNavigator: LaunchNavigator, public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public zone: NgZone,
    public translate: TranslateService, public helper: HelperProvider, private platform: Platform, public serviceApi: ServicesProvider) {
   // get trip details source, destination...
    this.tripDetails = navParams.get("details");
    this.fromLoc = navParams.get('fromLoc');
    this.fromAddress = navParams.get('fromAddress');
    this.toLoc = navParams.get('toLoc');
    this.toAddress = navParams.get('toAddress');
    this.type = navParams.get('type');
    this.bus_status = this.helper.busMove(this.tripDetails.bus_status) == 1 ? this.translate.instant('move') : this.translate.instant('stop');
    position = [parseFloat(this.tripDetails.lat),parseFloat(this.tripDetails.lng)];
    console.log("ttt " + this.fromLoc + " " + this.fromAddress + " " + this.toLoc + " " + this.toAddress);
    this.platform.ready().then(() => {
    });
    // calculate trip time
    this.calculateTime();

    console.log("tripDetails=> "+JSON.stringify(this.tripDetails))

    //aya

    if(this.tripDetails.secondTrip) {
      if(this.tripDetails.secondTrip.length > 0) {
        this.secondTripBuses = this.tripDetails.secondTrip;
        console.log("secondTripBuses** "+JSON.stringify(this.secondTripBuses));
      }
    }
  }

  // Function to calculate trip details
  calculateTime() {
    let currentDate = new Date();
    this.startTime = (currentDate.getHours() < 10 ? '0' + currentDate.getHours() : currentDate.getHours()) + ":" + (currentDate.getMinutes()  < 10 ? '0' +  currentDate.getMinutes() : currentDate.getMinutes());
    this.userSource = this.fromAddress;
    this.userFeetSource = this.tripDetails.closetPointData.feet.duration.text;
    let stopTime = this.addMinutes(currentDate, this.tripDetails.closetPointData.feet.duration.value);
    this.userStopTime = (stopTime.getHours() < 10 ? '0' + stopTime.getHours() : stopTime.getHours()) + ":" + (stopTime.getMinutes() < 10 ? '0' + stopTime.getMinutes() : stopTime.getMinutes());
    let busEstArrival = this.addMinutes(currentDate, this.tripDetails.busRouteDistanceFeet.feet.duration.value);
    this.busEstArrivall = (busEstArrival.getHours() < 10 ? '0' + busEstArrival.getHours() : busEstArrival.getHours() )+ ":" +( busEstArrival.getMinutes() < 10 ? '0' + busEstArrival.getMinutes() : busEstArrival.getMinutes());
    //let busEstDpt = this.addMinutes(currentDate,10)
    this.busEstDeptTime = this.busEstArrivall;
    let busStop = this.addMinutes(busEstArrival, this.tripDetails.routes.duration.value);
    this.busAveStopTime = (busStop.getHours() < 10 ? '0' + busStop.getHours() : busStop.getHours())+ ":" + (busStop.getMinutes() < 10 ? '0' + busStop.getMinutes() : busStop.getMinutes());
    if (this.tripDetails.routeEndDistanceFeet.feet) {
      this.userFeetDest = this.tripDetails.routeEndDistanceFeet.feet.duration.text;
      let endTime = this.addMinutes(busStop, this.tripDetails.routeEndDistanceFeet.feet.duration.value);
      this.endTime = (endTime.getHours() == 0 ? '0' + endTime.getHours() : endTime.getHours()) + ":" + (endTime.getMinutes() == 0 ? '0' + endTime.getMinutes() : endTime.getMinutes());
    }
    else {
      this.endTime = this.busAveStopTime;
    }

    this.userDestAddress = this.toAddress;



    //aya//////////////

    // //1.
    // let stopTime2 = this.addMinutes(currentDate, this.tripDetails.closetPointData2.feet.duration.value); 
    // this.userStopTime2 = (stopTime2.getHours() < 10 ? '0' + stopTime2.getHours() : stopTime2.getHours()) + ":" + (stopTime2.getMinutes() < 10 ? '0' + stopTime2.getMinutes() : stopTime2.getMinutes());

    // //2.
    // let busEstArrival2 = this.addMinutes(currentDate, this.tripDetails.busRouteDistanceFeet2.feet.duration.value);
    // this.busEstArrivall2 = (busEstArrival2.getHours() < 10 ? '0' + busEstArrival2.getHours() : busEstArrival2.getHours() )+ ":" +( busEstArrival2.getMinutes() < 10 ? '0' + busEstArrival2.getMinutes() : busEstArrival2.getMinutes());

    // //3.
    // this.busEstDeptTime2 = this.busEstArrivall2;

    // //4.
    // let busStop2 = this.addMinutes(busEstArrival2, this.tripDetails.routes2.duration.value);
    // this.busAveStopTime2 = (busStop2.getHours() < 10 ? '0' + busStop2.getHours() : busStop2.getHours())+ ":" + (busStop2.getMinutes() < 10 ? '0' + busStop2.getMinutes() : busStop2.getMinutes());
    
    //aya//////////////
    
  }

  // Function to add minutes from duration value to current time
  addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
  }

  //Function to change active tab between details and map
  setActive(item) {
    this.section = item;
    if (item == 'two') {
      if (!this.mapLoaded) {
        this.zone.run(() => {
          setTimeout(() => {
            this.initMap();
            this.mapLoaded = true;
          }, 500);
        })
      }

    }
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
// Function executed when view loaded
  ionViewDidLoad() {
    console.log('ionViewDidLoad TripDetailsPage');
    localStorage.setItem("DetailsViewActive","1");
    this.busNumber = this.tripDetails.bus_number;
    this.driver_name = this.tripDetails.driver_name;

    
    
  }

  //aya
  openInnerTripDetails(item) {
    this.navCtrl.push("TripDetailsPage",{details:item, type: this.type , fromAddress: this.fromAddress , fromLoc : this.fromLoc, toLoc: this.toLoc, toAddress: this.toAddress});    
  }

  //aya



  //open map native apps installed on mobile
  openOnMap() {
    let latlng = (this.tripDetails.busRouteDistanceFeet.bus_location).split(',');
    console.log("latlng " + latlng);
    this.launchNavigator.navigate([latlng[0], latlng[1]]);
  }
  // Change map type to ROADMAP or satellite
  mapTypeChanged(type) {
    this.map_type = type;
    if (this.map_type == "ROADMAP") {
      map.setMapTypeId("roadmap");
    }
    else {
      map.setMapTypeId("satellite");
    }
  }

  // initialize map to show bus and route
  initMap() {
    console.log("init map");
    let latlng = new google.maps.LatLng(this.tripDetails.lat, this.tripDetails.lng);
    var myOptions = {
      zoom: 15,
      center: latlng,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById("map_t"), myOptions);
    var kmlLayer = new google.maps.KmlLayer(this.tripDetails.path_file, {
      suppressInfoWindows: true,
      preserveViewport: true,
      map: map
    });
    let url = "assets/imgs/bus587.png";

    marker = new google.maps.Marker({
      position: new google.maps.LatLng(this.tripDetails.lat, this.tripDetails.lng),
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
      'transform': 'rotate(' + (360 - parseInt(this.tripDetails.angle)) + 'deg)'
    });
   }, 1000);
    let stopLatlng = (this.tripDetails.busRouteDistanceFeet.closetPoint).split(',');
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
    this.updateCurrentBusLocation()
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
      this.serviceApi.getBusLocation(this.tripDetails.bus_id, this.helper.currentLang, (data) => {
        //this.bus_marker.setMap(null)
        this.user_marker.setMap(null);
        this.bus_status = this.helper.busMove(data.data.bus.status) == 1 ? this.translate.instant('move') : this.translate.instant('stop');
        $('img[src="assets/imgs/bus587.png"]').css({
        'transform': 'rotate(' + (360 - parseInt(data.data.bus.angle)) + 'deg)'
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


  // Save Route
  saveRoute() {
    if (this.helper.skipLogin) {
      this.helper.presentToast(this.translate.instant('loginFirst'));
      return;
    }
    if (!navigator.onLine) {
      this.helper.presentToast(this.translate.instant("internetError"));
      return;
    }
    this.storage.get("user_token").then(val => {
      this.serviceApi.saveRoute(this.type, val.access_token, this.helper.currentLang, this.tripDetails.route_id, this.tripDetails.bus_id, this.fromLoc, this.toLoc, this.fromAddress, this.toAddress,
        (data) => {
          if (data.success && data.status == 1) {
            this.helper.presentToast(this.translate.instant("routeSavedSuccess"));
          }
          else {
            if (data.status == 0) {
              this.helper.presentToast(this.translate.instant("routeAlreadySaved"));
            }
            else {
              this.helper.presentToast(this.translate.instant("serverErr"));
            }
          }
        },
        (data) => { })
    })
  }
  //dismiss view
  goBack() {
    this.navCtrl.pop();
  }
  // open review view
  goToReview() {
    if (this.helper.skipLogin) {
      this.helper.presentToast(this.translate.instant('loginFirst'));
      return;
    }
    this.navCtrl.push("ReviewPage", {
      tripDetails: this.tripDetails
    });
  }



}
