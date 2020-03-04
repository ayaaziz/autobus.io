import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the ReviewSentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-review-sent',
  templateUrl: 'review-sent.html',
})
export class ReviewSentPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public translate:TranslateService) {
  }

  // Function executed when view loaded
  ionViewDidLoad() {
    console.log('ionViewDidLoad ReviewSentPage');
  }

  // dismiss view
  backToTrips(){
    console.log("back");
    this.navCtrl.pop();
    this.navCtrl.pop();
  }

}
