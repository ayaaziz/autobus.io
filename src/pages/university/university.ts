import { Component , NgZone  } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { ServicesProvider } from '../../providers/services/services';
import { HelperProvider } from '../../providers/helper/helper';
import { ModalAutocompleteItems } from '../modal-autocomplete-items/modal-autocomplete-items';
import { GoogleMapOptions, GeocoderRequest, Geocoder } from '@ionic-native/google-maps';
declare var google:any;
/**
 * Generated class for the UniversityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-university',
  templateUrl: 'university.html',
})
export class UniversityPage {
  locationLatLng_Source;
  locationAddress_Source;
  universities = [];
  university;
  university_name;
  placesService:any;
  placedetails: any;
  locationAddress;
  locationLatLng;
  sourceType = 1
  address:any = {
    place: '',
    set: false,
};
  constructor(public helper: HelperProvider, public navCtrl: NavController, public navParams: NavParams,
    public serviceApi: ServicesProvider, private zone: NgZone, public platform: Platform,
    public translate:TranslateService,  public modalCtrl: ModalController) {translate.instant
  }
  // open contact view
  openContact(){
    this.navCtrl.push("ContactUsPage");
  }

  // user select unversity
  universityChanged(){
    let i =this.universities.findIndex(obj => obj.id == this.university);
    this.university_name = this.universities[i].university_name;
  }
  // Function executed when view loaded
  ionViewDidLoad() {
    console.log('ionViewDidLoad UniversityPage');

      if(!navigator.onLine){
        this.helper.presentToast(this.translate.instant("internetError"));
        return;
      }
      this.universities = [];
      // get universities list
      this.serviceApi.getUniversities(this.helper.currentLang, (data)=>{
        this.universities = data.data;
      },
      (data)=>{
        if(data.name == "TimeoutError"){
          this.helper.presentToast(this.translate.instant("TimeoutError"));
        }
        else{
          this.helper.presentToast(this.translate.instant("serverErr"));
        }
      })
  }
  // get current location
  myLocation(){
    this.helper.geoLoc(data => this.getCurrentLoc(data));
  }
  // function called when app get current user location
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
  // function to get address info using google geocoding api
  getAddress(lat,long){
    let options: GeocoderRequest = {
      position:  {"lat": lat, "lng":long}
    };
    Geocoder.geocode(options)
    .then((mvcArray) => {
      this.locationLatLng_Source = lat + "," + long;
      console.log(this.locationLatLng +" this.locationLatLng " + JSON.stringify(mvcArray));
      let geoData = JSON.parse(JSON.stringify(mvcArray));
      this.locationAddress_Source=geoData[0].extra.lines[0];
    })
  }
  // show model to allow user to select place
  showSearchPlaces(){
    let modal = this.modalCtrl.create(ModalAutocompleteItems);
        modal.onDidDismiss(data => {
            console.log('page > modal dismissed > data > ', data);
            if(data){
                 this.address.place = data.description;
                // // get details
                 this.getPlaceDetail(data.place_id);
            }
        })
        modal.present();
  }
  // get place details using google places service by sending place id
  private getPlaceDetail(place_id?:string,latlng?):void {
    var self = this;
    var request;
    if(place_id){
      request = {
        placeId: place_id,
    };
    }
    else{
      request = {
        latlng: place_id,
    };
    }
    this.placesService = new google.maps.places.PlacesService(document.createElement('div'));
    this.placesService.getDetails(request, (place,status)=>this.callback(place,status));

}
// swap source and destination
swapSD(){
  this.sourceType == 1 ? this.sourceType = 2 : this.sourceType = 1;
}

// user place info using google place servvvice calback
callback(place, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
      console.log('page > getPlaceDetail > place > ', place);
      // set full address
      this.zone.run(() => {
       // alert("zone")
        this.locationLatLng_Source = place.geometry.location.lat() + ',' + place.geometry.location.lng();
        this.locationAddress_Source = place.formatted_address;
    });


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
// Function to initPlacedetails
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
  callSupport(){
    console.log("call");
  }
  // function to open search reults view
  search(){
    if(!this.locationLatLng_Source){
      this.helper.presentToast(this.translate.instant('selectSource'));
      return;
    }
    if(!this.university){
      this.helper.presentToast(this.translate.instant('selectUniversity'));
      return;
    }
    this.navCtrl.push("SearchPlacesPage",{type:2,university_name:this.university_name,currentLoc:this.locationLatLng_Source,locAddress:this.locationAddress_Source,univID:this.university});
  }
}
