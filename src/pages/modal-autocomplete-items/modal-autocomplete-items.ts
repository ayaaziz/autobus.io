import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { ViewController, Searchbar } from 'ionic-angular';
import { HelperProvider } from '../../providers/helper/helper';
import { TranslateService } from '@ngx-translate/core';

declare var google: any;

@Component({
    selector: 'page-modal-autocomplete-items',
    templateUrl: 'modal-autocomplete-items.html'
})
export class ModalAutocompleteItems implements OnInit{

    @ViewChild('searchbar') searchbar:Searchbar;
    autocompleteItems: any;
    autocomplete: any;
    acService:any;
    placesService: any;

    constructor(public viewCtrl: ViewController,public helper: HelperProvider,  public translate:TranslateService,
        private zone: NgZone) {
        console.log("ModalAutocompleteItems");
    }

    // initiate google autocomplete service
    ngOnInit() {
        this.acService = new google.maps.places.AutocompleteService();
        this.autocompleteItems = [];
        this.autocomplete = {
            query: ''
        };
    }
    // Function executed when user enter to view
    ionViewDidEnter(){
        setTimeout(() => {
            this.searchbar.setFocus();
        }, 500);

    }
    // dismiss autocomplete view
    dismiss() {
        this.viewCtrl.dismiss();
    }

    // user select item from autocomlete items
    chooseItem(item: any) {
        console.log('modal > chooseItem > item > ', item);
        this.viewCtrl.dismiss(item);
    }

    // call google service to get prediction according to user input and determine jordon only to get predictions
    updateSearch() {
        console.log('modal > updateSearch');
        if (this.autocomplete.query == '') {
            this.autocompleteItems = [];
            return;
        }
        let self = this;
        let config = {
            // types:  ['address'], // other types available in the API: 'establishment', 'regions', and 'cities'
            input: this.autocomplete.query,
            componentRestrictions: { country: 'JO' }
        }
        this.acService.getPlacePredictions(config, (predictions, status)=> {
            console.log('modal > getPlacePredictions > status > ', status);
            self.autocompleteItems = [];
            if(predictions)  {
                this.zone.run(() => {
                predictions.forEach((prediction)=> {
                self.autocompleteItems.push(prediction);
            });
        })
            }

        });
    }

}
