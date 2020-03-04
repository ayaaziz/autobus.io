import { Component, OnInit, NgZone } from '@angular/core';
import { NavController , ModalController, AlertController, Platform, Events, LoadingController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { ModalAutocompleteItems } from '../modal-autocomplete-items/modal-autocomplete-items';
import { GoogleMapOptions, GeocoderRequest, Geocoder } from '@ionic-native/google-maps';
import { HelperProvider } from '../../providers/helper/helper';
import { Storage } from '@ionic/storage'
import { LoginPage } from '../../pages/login/login';
import {   LocationService,
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  HtmlInfoWindow,
  MyLocation,
  Marker,
  MyLocationOptions,
  GoogleMapGestureOptions
} from '@ionic-native/google-maps';
import { ServicesProvider } from '../../providers/services/services';
declare var google:any;
@Component({
  selector: 'page-trip-plannig-tab',
  templateUrl: 'trip-plannig-tab.html'
})
export class TripPlanningPage implements OnInit{
  locationLatLng_Source;
  locationAddress_Source;
  locationLatLng_Dest;
  locationAddress_Dest;
  map_type="MAP_TYPE_NORMAL";
  tripSegment:string="MAP";
  placesService:any;
  placedetails: any;
  recentSearchArray: any;
  hideMoreBtn = true;
  updateBasesInterval;
  page = 0;
  savedLocations = [];
  address:any = {
    place: '',
    set: false,
};
map: GoogleMap;
noSavedData = false;
noRecentData = false;
currentMarkers = []
  constructor(public navCtrl: NavController, public translate:TranslateService, public helper: HelperProvider,
    public modalCtrl: ModalController,public storage:Storage,public serviceApi:ServicesProvider,public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,private zone: NgZone, public platform: Platform, public events: Events) {
  }
  loginToApp(){
    this.storage.clear().then(()=>{});
    this.events.publish("logout_app");
  }
  search(){
    console.log('serach');
    if(!this.locationLatLng_Source){
      this.helper.presentToast(this.translate.instant('selectSource'));
      return;
    }
    if(!this.locationLatLng_Dest){
      this.helper.presentToast(this.translate.instant('selectDest'));
      return;
    }
    this.navCtrl.push('SearchPlacesPage',{type:1,from:this.locationAddress_Source,formloc: this.locationLatLng_Source,
    to:this.locationAddress_Dest,toloc:this.locationLatLng_Dest});
  }
  openSerchFromRecent(item){
    //type = 1 => trip planning tab search save
    //type = 2 => university tab search save
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
  }

  openSerchFromSaved(item){
    console.log(JSON.stringify(item));
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
ionViewDidEnter(){
  this.page = 0;
  this.hideMoreBtn = true;
  this.noRecentData = false;
  this.noRecentData = false;
  this.savedLocations = [];
  this.recentSearchArray = [];
  localStorage.setItem("RecentViewActive","1");
  if(!this.helper.skipLogin){
    this.getRecentSearch();
  }
  //this.getSavedLocations()
}
mapTypeChanged(type){
  this.map_type = type;
  this.map.setMapTypeId(type);
}
ionViewDidLoad(){

  // setTimeout(() => {
  //   loader.dismiss()
  // }, 4000);
  //this.helper.geoLoc(data => this.getCurrentLoc(data));
  if(!this.helper.skipLogin)
  this.loadMap();
}
setActive(item){
  //this.helper.presentLoginToast()
  this.tripSegment = item;
}
  showSearchPlaces(type){
    let modal = this.modalCtrl.create(ModalAutocompleteItems);
        modal.onDidDismiss(data => {
            console.log('page > modal dismissed > data > ', data);
            if(data){
                 this.address.place = data.description;
                // // get details
                 this.getPlaceDetail(type,data.place_id);
            }
        })
        modal.present();
  }
  myLocation(){
    this.helper.geoLoc(data => this.getCurrentLoc(data));
  }
  getCurrentLoc(loc) {

    //console.log("witting loc " + JSON.stringify(loc))
    if (loc == "-1") {
      this.helper.presentToast(this.translate.instant("locFailed"));

    }
    else {
      console.log("location " + JSON.stringify(loc));
      this.getAddress(loc.inspectorLat,loc.inspectorLong);
      if (!navigator.onLine) {
        this.helper.presentToast(this.translate.instant("internetError"));
        return;
      }

    }
  }
  openContact(){
    this.navCtrl.push("ContactUsPage");
  }

  loadMap() {
    let loader = this.loadingCtrl.create({
      content: "",
    });
    loader.present();
    // setTimeout(() => {
    //   loader.dismiss()
    // }, 1000);
     LocationService.getMyLocation().then((myLocation: MyLocation) => {
       console.log("myLocation "+ JSON.stringify(myLocation));
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
           'mapToolbar':true
         },
         gestures : gesuturesOptions
       };
       this.map = GoogleMaps.create('map_canvas', options);
       this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
         loader.dismiss();
         this.getSavedBuses();
       })
       //let paddingTop = window.innerHeight - 290
       //this.map.setPadding(paddingTop, 0, 0, 0)

     })

   }
  getAddress(lat,long){
    let options: GeocoderRequest = {
      position:  {"lat": lat, "lng":long}
    };
    Geocoder.geocode(options)
    .then((mvcArray) => {
      this.zone.run(()=>{
        this.locationLatLng_Source = lat + "," + long
      console.log(this.locationLatLng_Source +" this.locationLatLng " + JSON.stringify(mvcArray));
      let geoData = JSON.parse(JSON.stringify(mvcArray))
      this.locationAddress_Source=geoData[0].extra.lines[0];
      })

    })
  }
  swapSD(){
      let address = this.locationAddress_Dest;
      let latlng = this.locationLatLng_Dest;
      let sourceAddress = this.locationAddress_Source;
      let sourceLoc = this.locationLatLng_Source;
      this.locationAddress_Dest = sourceAddress;
      this.locationLatLng_Dest = sourceLoc;
      this.locationAddress_Source = address;
      this.locationLatLng_Source = latlng;
  }
  setBusesMarkers(data) {
    if(data.length == 0){
      return;
    }
    this.map.clear();
    //let time = data[0].routes.duration.value;

    for (let x = 0; x < data.length; x++) {

      let url = "assets/imgs/bus_marker.png"
      if(this.platform.is('ios')){
        url = "www/assets/imgs/bus_marker.png"
      }
      let marker: Marker = this.map.addMarkerSync({
          icon: {
          'url':url,
          'size': {width: 40, height: 40}
        },
        position: {
          lat: parseFloat(data[x].lat),
          lng: parseFloat(data[x].lng)
        },
        rotation: 360 - parseInt(data[x].angle)
      });
      marker.addEventListener(GoogleMapsEvent.MARKER_CLICK).subscribe(e => {
        let htmlInfoWindow = new HtmlInfoWindow();
        let status = this.helper.busMove(data[x].bus_status)
        let status_txt = status == 1 ? this.translate.instant('move') : this.translate.instant('stop')
        let frame: HTMLElement = document.createElement('div');
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
          this.openDetails(data[x]);
        });
        frame.getElementsByClassName("closeInfo")[0].addEventListener("click", () => {
          htmlInfoWindow.close();
        });
        htmlInfoWindow.setContent(frame,{width:"250px"});
        htmlInfoWindow.open(marker);
      });

    }
  }
  private getPlaceDetail(type,place_id:string):void {
    var self = this;
    var request = {
        placeId: place_id,
    };
    this.placesService = new google.maps.places.PlacesService(document.createElement('div'));
    this.placesService.getDetails(request, (place,status)=>this.callback(place,status,type));

}
 callback(place, status, type) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        console.log('page > getPlaceDetail > place > ', place);
        this.zone.run(() => {
        // set full address
        if(type == 1){
            this.locationLatLng_Source = place.geometry.location.lat() + ',' + place.geometry.location.lng();
            this.locationAddress_Source = place.formatted_address;
        }
        else{
            this.locationLatLng_Dest = place.geometry.location.lat() + ',' + place.geometry.location.lng();
            this.locationAddress_Dest = place.formatted_address;
        }
      })
        this.placedetails.address = place.formatted_address;
        this.placedetails.lat = place.geometry.location.lat();
        this.placedetails.lng = place.geometry.location.lng();
        for (var i = 0; i < place.address_components.length; i++) {
            let addressType = place.address_components[i].types[0];
            let values = {
                short_name: place.address_components[i]['short_name'],
                long_name: place.address_components[i]['long_name']
            }
            if(this.placedetails.components[addressType]) {
                this.placedetails.components[addressType].set = true;
                this.placedetails.components[addressType].short = place.address_components[i]['short_name'];
                this.placedetails.components[addressType].long = place.address_components[i]['long_name'];
            }
        }
        // set place in map
        //self.map.setCenter(place.geometry.location);

        // populate
        //self.address.set = true;
        console.log('page > getPlaceDetail > details > ', this.placedetails);
    }else{
        console.log('page > getPlaceDetail > status > ', status);
    }
}
ngOnInit() {
  this.initPlacedetails();
}
private reset() {
  this.initPlacedetails();
  this.address.place = '';
  this.address.set = false;
}
private initPlacedetails() {
  this.placedetails = {
      address: '',
      lat: '',
      lng: '',
      components: {
          route: { set: false, short:'', long:'' },                           // calle
          street_number: { set: false, short:'', long:'' },                   // numero
          sublocality_level_1: { set: false, short:'', long:'' },             // barrio
          locality: { set: false, short:'', long:'' },                        // localidad, ciudad
          administrative_area_level_2: { set: false, short:'', long:'' },     // zona/comuna/partido
          administrative_area_level_1: { set: false, short:'', long:'' },     // estado/provincia
          country: { set: false, short:'', long:'' },                         // pais
          postal_code: { set: false, short:'', long:'' },                     // codigo postal
          postal_code_suffix: { set: false, short:'', long:'' },              // codigo postal - sufijo
      }
  };
}
  segmentChanged(){
    // if(this.tripSegment=="RECENT"){
    //   this.getRecentSearch();
    // }

  }
  addNewLocation(){
    console.log("add new Location");
  }
  getSavedLocations(){
    this.page += 1;
    this.storage.get("user_token").then(val => {
      this.serviceApi.getSavedSearch(this.page,val.access_token,(data)=>{
           if(data.success){
             if(this.page == 1 && data.data.data.length == 0){
               this.noSavedData = true;
             }
            if(data.data.data.length > 0){
              data.data.data.forEach(element => {
              this.savedLocations.push(element)
            });
            this.page += 1;
            if(data.data.data.length < data.data.per_page){
              this.hideMoreBtn = true
            }
            else{
              this.hideMoreBtn = false
            }
            }
            else{
              this.hideMoreBtn = true
            }

           }
           else{
            this.hideMoreBtn = true
           }
      },
      (err)=>{
        if(err.name == "TimeoutError"){
          this.helper.presentToast(this.translate.instant("TimeoutError"))
        }
        else{
          this.helper.presentToast(this.translate.instant("serverErr"))
        }
      }
      );
    })
  }
  openDetails(data){
    if(!navigator.onLine){
      this.helper.presentToast(this.translate.instant("internetError"));
      return;
    }
    LocationService.getMyLocation().then((myLocation: MyLocation) => {
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
              return;
            }
            this.storage.get("user_token").then(val => {
              let access = val ? val.access_token : null
            this.serviceApi.deleteSavedRoute(access,id,this.helper.currentLang,
            (data)=>{
              if(data.success){
                this.helper.presentToast(this.translate.instant("routeDeletedSuccess"));
                this.ionViewDidEnter();
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
  getSavedBuses(){
    this.storage.get("user_token").then(val => {
      this.serviceApi.getSavedBusesSearch(this.helper.currentLang,val.access_token,(data)=>{
        setTimeout(() => {
          if(data.data.buses.length > 0){
            this.setBusesMarkers(data.data.buses);
          }
          this.getSavedBasesInterval();
        }, 2000);
      },
      ()=>{
        localStorage.setItem("RecentViewActive","0");
        //this.helper.presentToast(this.translate.instant("serverErr"))
      })
    })
  }
  ionViewWillLeave(){
    localStorage.setItem("RecentViewActive","0");
   }
  getSavedBasesInterval(){
    this.updateBasesInterval = setInterval(()=>{
      let ActiveStatus = localStorage.getItem("RecentViewActive")
      if(ActiveStatus == "0"){
        console.log("Recent tab not active");
        return;
      }
      this.storage.get("user_token").then(val => {
        this.serviceApi.getSavedBusesSearch(this.helper.currentLang,val.access_token,(data)=>{
          if(data.data.buses.length > 0){
            this.setBusesMarkers(data.data.buses);
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
    },this.helper.updateMapTimeOut)
  }
  getRecentSearch(){
    this.storage.get("user_token").then(val => {
      this.serviceApi.getRecentSearch(val.access_token,(data)=>{
           if(data.success){
            if(data.data.recentSearch.length == 0){
              this.noRecentData = true;
            }
            this.recentSearchArray=data.data.recentSearch;

           }
           this.getSavedLocations();
      },
      (err)=>{
        this.getSavedLocations();
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
