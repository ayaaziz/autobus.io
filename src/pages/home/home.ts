import { Component ,ChangeDetectorRef } from '@angular/core';
import { NavController, Platform, LoadingController ,AlertController } from 'ionic-angular';
import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';
import { ServicesProvider } from '../../providers/services/services';
import { StatusBar } from '@ionic-native/status-bar';
import { Storage } from '@ionic/storage';
import { Diagnostic } from '@ionic-native/diagnostic';
import {
  LocationService,
  GoogleMaps,
  GoogleMap,
  GoogleMapOptions,
  GoogleMapsEvent,
  HtmlInfoWindow,
  MyLocation,
  Marker,
  GoogleMapGestureOptions,
  MyLocationOptions,
  CameraPosition,
  ILatLng
} from '@ionic-native/google-maps';
import { timestamp } from 'rxjs/operators';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  NoBus : boolean;
  moved = false;
  camera_start_lat;
  camera_start_lng;
  camera_target_lat;
  camera_target_lng;
  _map: GoogleMap;
  myNewLocation:any;
  userLat;
  trackInterval;
  intervalStop = false;
  userLong;
  loadingMap: any;
  nearestBusID;
  nearestBusTime;
  nearestBusIndex;
  mapLoader;
  nearestBusLat;
  nearestBusLng;
  Buses = [];
  currentMarkers = [];
  map_type="MAP_TYPE_NORMAL";
  hideMe: boolean;
  constructor(private changeRef: ChangeDetectorRef,public navCtrl: NavController, public helper: HelperProvider, private platform: Platform,
    public serviceApi: ServicesProvider, public translate: TranslateService, public storage: Storage
    , public statusBar: StatusBar, public loadingCtrl: LoadingController, private diagnostic: Diagnostic,private alertCtrl: AlertController) {
      // Register app status to pause or enter to backgrounf
      document.addEventListener('pause', () => {
        console.log("pause");
        if(this.navCtrl.getActive().name == "HomePage"){
        console.log("pause" + this.navCtrl.getActive().name);
        localStorage.setItem("autoHomeActive","0");
        }
      })
      // Register app becomes active
      document.addEventListener('resume', () => {

        console.log("resume");
        if(this.navCtrl.getActive().name == "HomePage"){
        console.log("resume" + this.navCtrl.getActive().name);
        localStorage.setItem("autoHomeActive","1");
        }
      })
  }

  // Open contact view
  openContact(){
    this.navCtrl.push("ContactUsPage");
  }

  // Change map type to satellite or normal
  mapTypeChanged(type){
    this.map_type = type;
    this._map.setMapTypeId(type);
  }

  // Function executed when user enter to view
  ionViewDidEnter(){
    // set home as active to refresh map
    localStorage.setItem("autoHomeActive","1");
  }
  // Function executed when view loaded
  ionViewDidLoad() {
      this.platform.ready().then(() => {
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString("#006098");
    this.storage.get("user_data").then(val => {
      if(val){
        this.helper.user_id = val.id
      }
    })
    this.loadMap();
  });
  }
  // Function to load map
  loadMap() {
    let loader = this.loadingCtrl.create({
      content: "",
    });
    loader.present();
    //setTimeout(() => {
    //  loader.dismiss()
   // }, 1000);

    // Get user location from location service
    LocationService.getMyLocation().then((myLocation: MyLocation) => {
      console.log("myLocation "+ JSON.stringify(myLocation));

      // Set map options
      let gesuturesOptions : GoogleMapGestureOptions ={
        rotate : false
      }
      let options: GoogleMapOptions = {
        camera: {
          target: myLocation.latLng,
          zoom: 16
        },
        controls: {
          'myLocationButton': true,
          'myLocation': true,
          'zoom': true,
        },
        gestures : gesuturesOptions
      };
      let map = GoogleMaps.create('map_canvas', options);
      // Create map
      map.one(GoogleMapsEvent.MAP_READY).then(() => {
      loader.dismiss();
      this._map = map;
      this.loadDataToMap(map,myLocation);
      //added by amr start
  //function on camera move get new buses near the new location
  let moveNum=0;
  map.on(GoogleMapsEvent.CAMERA_MOVE_START).subscribe((params:any[])=>{
    var x = document.getElementById("bigmarker");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
    var y = document.getElementById("smallmarker");
    if (y.style.display === "none"){
      y.style.display = "block";
    }
    let cameraPosition: CameraPosition<ILatLng> = params[0];
    this.camera_start_lat = cameraPosition.target.lat;
    this.camera_start_lng = cameraPosition.target.lng;
    //this.nearestBusID = null;

  })
  map.on(GoogleMapsEvent.CAMERA_MOVE_END).subscribe((params:any[])=>{
    var x = document.getElementById("bigmarker");
    if (x.style.display === "none") {
      x.style.display = "block";
    }
    var y = document.getElementById("smallmarker");
    if (y.style.display === "block"){
      y.style.display = "none";
    }
    moveNum++;
    if ( moveNum >2){this.moved = true;}
    let cameraPosition: CameraPosition<ILatLng> = params[0];
    this.camera_target_lat = cameraPosition.target.lat;
    this.camera_target_lng = cameraPosition.target.lng;
    let lat1 = this.camera_start_lat;
    let lat2 = this.camera_target_lat;
    let lon1 = this.camera_start_lng;
    let lon2 = this.camera_target_lng;
    let unit="K";
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      var radlat1 = Math.PI * lat1/180;
      var radlat2 = Math.PI * lat2/180;
      var theta = lon1-lon2;
      var radtheta = Math.PI * theta/180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180/Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit=="K") { dist = dist * 1.609344 }
      if (unit=="N") { dist = dist * 0.8684 }
      console.log("distance "+ dist + " kilometers");
      if (dist > 0.8){
        // this.helper.presentToast(this.translate.instant("waitUntilLoadBuses"));
          var target = map.getCameraTarget();
          myLocation.latLng.lat= target.lat;
          myLocation.latLng.lng= target.lng;
          this.loadDataToMap(map,myLocation);
          this.trackInterval = setInterval(() => {
            this.storage.get("user_data").then(val => {
                // LocationService.getMyLocation().then((myLocationInterval: MyLocation) => {
                 this.loadDataToMap(map,myLocation);
                // })

            })
          }, this.helper.updateMapTimeOut)
          console.log("New Buses Loaded");

        }else{
          this.trackInterval = setInterval(() => {
            this.storage.get("user_data").then(val => {
                // LocationService.getMyLocation().then((myLocationInterval: MyLocation) => {
                 this.loadDataToMap(map,myLocation);
                // })

            })
          }, this.helper.updateMapTimeOut)

        }
              this.changeRef.detectChanges();

        console.log("Nearest Bus ID: "+this.nearestBusID);

  }

  })

    })
.catch(error => {
  console.log("map creation error ",error);
}
  )

  //End added by AMR
    })

  }
  ionViewDidLeave(){
    // when user leave home view, stop updating map
   localStorage.setItem("autoHomeActive","0");
  }
  // Function executed when user leave home view
  ionViewWillLeave(){
    // when user leave home view, stop updating map
   localStorage.setItem("autoHomeActive","0");
  }
  // Function to load buses and user location over map
  loadDataToMap(map,myLocation: MyLocation){
    let activeStatus = localStorage.getItem("autoHomeActive");
    if(activeStatus == "0"){
      console.log("home not active");
      return;
    }
    // check if user skip login and act as guest
    if(this.helper.skipLogin){
      // Call API to get nearest buses to user location
      this.serviceApi.getBusNearBy(null,null,null, this.helper.currentLang, myLocation.latLng.lat + "," + myLocation.latLng.lng,
      this.helper.transType,
        (data) => {
          if (data.success) {
            if(data.data){
              this.Buses = data.data;
              // Set buses over map
              this.setBusesMarkers(map,data.data);
            }
          }
          else{
            // show message from server describe busese out of working period
            if(data.status == -7){
              if(data.errors.workTime && !this.helper.userNotifiedBueseOutOfWorkingPeriod)
              this.helper.presentAlert(data.errors.workTime);
            }
          }
        },
        (data) => {
          // if there is error on calling server and API stop updating map to a void unwanted requests to server
          localStorage.setItem("autoHomeActive","0");
         })
    }
    else{
      // get nearest buses for registered user
      this.storage.get("user_token").then(val => {
                this.serviceApi.getBusNearBy(this.helper.fcm_registration,this.helper.os_type,val.access_token, this.helper.currentLang, myLocation.latLng.lat + "," + myLocation.latLng.lng,
                this.helper.transType,
                  (data) => {
                    if (data.success) {
                      if(data.data){
                        this.Buses = data.data;
                        // Set buses over map
                        this.setBusesMarkers(map,data.data);
                      }

                    }
                    else{
                      if(data.status == -7){
                         // show message from server describe busese out of working period
                        if(data.errors.workTime && !this.helper.userNotifiedBueseOutOfWorkingPeriod)
                        this.helper.presentAlert(data.errors.workTime);
                      }
                      if(data.length == 0){
                        let alertMessage= "No buses Available";
                        this.helper.presentAlert(alertMessage);
                      }
                    }

                  },
                  (data) => { })
          })
    }

  }

  // Function executed when user select bus from map to show bus details
  moveToBus(){
    this.openDetails(this.Buses[this.nearestBusIndex]);
  }

  // Function to draw buses over map
  setBusesMarkers(map,data) {
    //this.nearestBusID = null;

    // remove previous buses from map
    if(data.length == 0){
      this.NoBus = true;
      this.currentMarkers = [];
      map.clear();
      return;
    }else{
      this.NoBus = false;
    }
    for(let x=0;x<data.length;x++){
      let index = this.currentMarkers.map(item => item.bus_id).indexOf(data[x].bus_id)
      // add property to response object to determine if new response contains buses in previous response or newer buses
      if(index == -1){
        data[x].marker_index = -1;
      }
      else{
        data[x].marker_index = index;
      }
    }

    // determine nearest bus to user
    let nearesIndex = 0;
    // if( this.camera_target_lng !== this.camera_target_lng){
    //   data[0].busRouteDistanceFeet.feet.duration.text = "Duration from selected location to the bus"
    // }
    let time = data[0].busRouteDistanceFeet.feet.duration.value;
    let nearestBusId = data[0].bus_number;
    let nearestTime =  data[0].busRouteDistanceFeet.feet.duration.text;
    let nearestBusLat = data[0].lat;
    let nearestBusLng = data[0].lng;
    for (let x = 0; x < data.length; x++) {
      if(data[x].busRouteDistanceFeet.feet.duration.value < time){
        time = data[x].busRouteDistanceFeet.feet.duration.value;
        nearestBusId = data[x].bus_number;
        nearestTime = data[x].busRouteDistanceFeet.feet.duration.text;
        nearestBusLat = data[x].lat;
        nearestBusLng = data[x].lng;
        nearesIndex = x;
      }

      let url = "assets/imgs/bus587.png";
      if(this.platform.is('ios')){
        url = "www/assets/imgs/bus587.png";
      }
      //animation: 'DROP', add if nearest bus id
      if(data[x].marker_index == -1){
        if(nearestBusId == data[x].bus_number){
          url = "assets/imgs/icBusCopy@3x2.png";
          if(this.platform.is('ios')){
            url = "www/assets/imgs/bus587.png";
          }
        }
      let marker: Marker = map.addMarkerSync({
          icon: {
          'url':url,
          'size': {width: 40, height: 40}
        },

        position: {
          lat: parseFloat(data[x].lat),
          lng: parseFloat(data[x].lng)
        }
        ,rotation : 360 - parseInt(data[x].angle)
      });
      this.currentMarkers.push({bus_id: data[x].bus_id,marker: marker});

      // add info window over bus marker to show its details
      marker.addEventListener(GoogleMapsEvent.MARKER_CLICK).subscribe(e => {
        let htmlInfoWindow = new HtmlInfoWindow();
        let frame: HTMLElement = document.createElement('div');
        let status = this.helper.busMove(data[x].bus_status);
        let status_txt = status == 1 ? this.translate.instant('move') : this.translate.instant('stop');
        frame.innerHTML = [
          '<span style="color:#006098;font-weight:bold;">'+ this.translate.instant('bus') +':</span>&nbsp;&nbsp;&nbsp;'+ data[x].bus_number+'<span class="closeInfo"><img src="assets/imgs/close_marker.svg" style="width:15px;margin:6px;" ></img></span><br>',
          '<span style="color:#006098;font-weight:bold;">'+ this.translate.instant('distance')+':</span>&nbsp;&nbsp;&nbsp;'+data[x].busRouteDistanceFeet.feet.distance.text+'<br>',
          '<span style="color:#006098;font-weight:bold;">'+ this.translate.instant('duration')+':</span>&nbsp;&nbsp;&nbsp;'+data[x].busRouteDistanceFeet.feet.duration.text+" "+this.translate.instant('walk')+'<br>',
          '<span style="color:#006098;font-weight:bold;">'+ this.translate.instant('start_address')+':</span>&nbsp;&nbsp;&nbsp;'+data[x].route_start_address+'<br>',
          '<span style="color:#006098;font-weight:bold;">'+ this.translate.instant('end_addrees')+':</span>&nbsp;&nbsp;&nbsp;'+data[x].route_end_address+'<br>',
          '<span style="color:#006098;font-weight:bold;">'+ this.translate.instant('bus_status')+':</span>&nbsp;&nbsp;&nbsp;'+ status_txt +'<br>',
          '<span class="openDetails" style="color:#ff8300;font-weight:bold;text-decoration: underline;text-align:center">'+ this.translate.instant('showDetails')+'</span>',
        ].join("");
        frame.getElementsByClassName("openDetails")[0].addEventListener("click", () => {
          this.openDetails(data[x],map);
        });
        frame.getElementsByClassName("closeInfo")[0].addEventListener("click", () => {
          htmlInfoWindow.close();
        });
        htmlInfoWindow.setContent(frame,{width:"250px"});
        htmlInfoWindow.open(marker);
      });

    }
    else{
      // if buses already exist over map, move this bus into its updated location
    let markerToUpdate : Marker= this.currentMarkers[data[x].marker_index].marker;
    this.transition(data[x].angle,[data[x].lat,data[x].lng],markerToUpdate);
    console.log("move "+ JSON.stringify(markerToUpdate));
    }

    }
    // remove buses that drawn previously on map and not exist in newest response
    for(let y=0; y<this.currentMarkers.length;y++){
      let index = data.map(item => item.bus_id).indexOf(this.currentMarkers[y].bus_id)
      if(index == -1){
        let markerToRm : Marker = this.currentMarkers[y].marker;
        markerToRm.remove();
        this.currentMarkers.splice(y,1);
        console.log("splice "+y);
      }
    }
    this.nearestBusID = nearestBusId;
    this.nearestBusTime = nearestTime;
    this.nearestBusLat = nearestBusLat;
    this.nearestBusLng = nearestBusLng;
    this.nearestBusIndex = nearesIndex;
    this.changeRef.detectChanges();
  }
  hide(){
    this.hideMe = true;
  }
  // refresh app
  reloadApp(){
    location.reload();
  }

  // open bus details view
  openDetails(data,map?){
    if(!data.route_id){
      this.currentMarkers = [];
      map.clear();
      //this.nearestBusID = null;
      this.helper.presentToast(this.translate.instant("waitUntilLoadBuses"));
      return;
    }
    if(!navigator.onLine){
      this.helper.presentToast(this.translate.instant("internetError"));
      return;
    }
    let loader = this.loadingCtrl.create({
      content: "",
    });
    loader.present();
    // setTimeout(() => {
    //   loader.dismiss()
    // }, 1000);
    LocationService.getMyLocation().then((myLocation: MyLocation) => {
      loader.dismiss();
      // get bus details for user and open bus details view
    this.serviceApi.getBusDetails(myLocation.latLng.lat + ',' + myLocation.latLng.lng , data.route_id, data.bus_id, this.helper.currentLang , (res)=>{
      this.navCtrl.push("TripDetailsPage",{details:res.data[0]});
    },
    (err)=>{
      if(err.name == "TimeoutError"){
        this.helper.presentToast(this.translate.instant("TimeoutError"));
      }
      else{
        this.helper.presentToast(this.translate.instant("serverErr"));
      }
    })
    })

  }
// Function to move buses
  transition(angle,result,marker:Marker){
    let i = 0;
    let position = marker.getPosition();
    let deltaLat = (result[0] - position.lat)/10;
    let deltaLng = (result[1] - position.lng)/10;
     console.log("ppppp "+position.lat + "type" + typeof(position.lat));
    this.moveMarker(angle,marker,position,deltaLat,deltaLng,i);
}

// Function to update buses location over map
moveMarker(angle,marker,position,deltaLat,deltaLng,i){
  position.lat += deltaLat;
  position.lng += deltaLng;
  var latlng ={lat: position.lat, lng: position.lng};
  marker.setPosition(latlng);
  marker.setRotation(360 - parseInt(angle))
  //changed by amr from 10 to 20
  if(i!=10){
      i++;
      setTimeout(() => {
        this.moveMarker(angle,marker,position,deltaLat,deltaLng,i);
        console.log("iiiiiii "+i);
      }, 10);
  }
}
// onButton_click() {

//   LocationService.getMyLocation().then((myLocation: MyLocation) => {
//   // Show the current camera target position.
//   var target = this._map.getCameraTarget();
//   myLocation.latLng.lat = target.lat;
//   myLocation.latLng.lng = target.lng;
//   console.log(myLocation);
//   this.loadDataToMap(this._map,myLocation);
//   // let alert = this.alertCtrl.create({
//   //   title: 'Current camera target',
//   //   subTitle: [
//   //     "lat: " + target.lat,
//   //     "lng: " + target.lng
//   //   ].join("<br />"),
//   //   buttons: ['Dismiss']
//   // });
//   // alert.present();
// });
// }
}
