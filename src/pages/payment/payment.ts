import { Component } from '@angular/core';
import { NavController, NavParams,AlertController  } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { PayPal, PayPalPayment, PayPalConfiguration } from "@ionic-native/paypal";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LoadingController } from 'ionic-angular';
import { HelperProvider } from '../../providers/helper/helper';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { Stripe } from '@ionic-native/stripe';
import 'rxjs/add/operator/timeout';
/**
 * Generated class for the PaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {
  stripe_key="pk_test_j4NfzX79yojSHKEKkG2TMuUO00CQWvXmKD";
  cardType:string;
  cardDetails:any ={};
  agreed=false;
  balance=null;
  qrcode = null;
  scannedcode=null;
  approved = null;
  paid = false;
  user_id:number;
  userName:string;
  pleaseScan= true;
  chargeAmount:string;
  tokenID:any;
  constructor(private stripe: Stripe,public alertController:AlertController , public translate: TranslateService,public storage: Storage,public helper: HelperProvider,public http: HttpClient, public loadingCtrl: LoadingController,private payPal: PayPal,private barcodescanner: BarcodeScanner,public navCtrl: NavController, public navParams: NavParams) {
  // Optionally request the permission early
  console.log("id did click id: "+this.helper.user_id);
  }

  ionViewDidLoad() {
    if(!this.helper.skipLogin){
      this.user_id=this.helper.user_id;
    }
    this.getUserBalance(this.user_id);
    console.log('ionViewDidLoad PaymentPage');
  }
  ionViewDidEnter(){
    this.scannedcode=null;
    this.paid = false;
    this.pleaseScan = true;
    if(!this.helper.skipLogin){
      this.user_id=this.helper.user_id;
    }
    this.getUserBalance(this.user_id);

  }
  scancode(){
    this.barcodescanner.scan().then(barcodeData =>{
    this.scannedcode = barcodeData.text.split('/');
    this.pleaseScan = false;
    //check user balance to process fare deducation
    if (this.balance !=0 && this.scannedcode[1]){
      let alert = this.alertController.create({
        title: this.translate.instant('PayConfirm'),
        message: this.translate.instant('busfare') + this.scannedcode[1],
        buttons: [
          {
            text: this.translate.instant('canceltxt'),
            role: 'cancel',
            handler: () => {
              this.helper.presentToast(this.translate.instant('canceltxt'));
              this.agreed=false;
            }
          },
          {
            text: this.translate.instant('paytab'),
            handler: () => {
             this.helper.presentToast(this.translate.instant('paid'));
             let headers = new HttpHeaders();
    let serviceUrl = this.helper.service_url + 'wallet/withdraw/'+this.scannedcode[1] +"/"+ this.user_id;
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem("kdkvfkhggssoauto"));
    this.http.get(serviceUrl,  { headers: headers })
      .timeout(this.helper.internetTimeout)
      .subscribe(
        data => {
          // loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          console.log("Balance withdraw success "+JSON.stringify(data))
          this.getUserBalance(this.user_id);
          this.paid=true;
        },
        err => {
          // loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
        }
      )
            }
          }
        ]
      });
      alert.present();
    }
      else{
        this.paid=false;
      }
    })

  }
  Recharge(){
    let alert = this.alertController.create({
      title:this.translate.instant('enterAmount'),
      inputs: [
        {
          name: 'rechareamount',
          placeholder: this.translate.instant('rechargeAmount'),
          type: 'number'
        },
      ],
      buttons:[
        {
          text: this.translate.instant('canceltxt'),
          role: 'cancel',
          handler: data => {
          }
        },
        {
          text:this.translate.instant('paytab'),
          handler: data => {
            this.chargeAmount=data.rechareamount;
            this.recharge2(this.chargeAmount);
        }
      }
    ]
    });
    alert.present();
  }
  recharge2(amount){
      //paypal
    this.payPal.init({
      PayPalEnvironmentProduction: '',
      PayPalEnvironmentSandbox: 'AfcLRrpgtth3gcHtJUwKAIaLVNqr8LS1YaqwPTzqmIT2Ie1TdoPDCdJnyD9G4fZnmNrwQfkEC5-8xRM1'
    }).then(() => {
      // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
      this.payPal.prepareToRender('PayPalEnvironmentNoNetwork', new PayPalConfiguration({
        // Only needed if you get an "Internal Service Error" after PayPal login!
        payPalShippingAddressOption: 0 // PayPalShippingAddressOptionPayPal
      })).then(() => {
        let payment = new PayPalPayment(amount, 'USD', 'Description', 'sale');
        this.payPal.renderSinglePaymentUI(payment).then((result) => {
        if (result.response.state == "approved"){
          this.approved = result.response.state;
          this.paid = true;
          let headers = new HttpHeaders();
    let serviceUrl = this.helper.service_url + 'wallet/deposit/'+amount +"/"+ this.user_id;
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem("kdkvfkhggssoauto"));
    this.http.get(serviceUrl,  { headers: headers })
      .timeout(this.helper.internetTimeout)
      .subscribe(
        data => {
          // loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          console.log("Balance "+JSON.stringify(data))
          this.balance=data;
          this.paid = true;
        },
        err => {
          // loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
        }
      )
        }
        }, () => {
          // Error or render dialog closed without being successful
          console.log( "Error or render dialog closed without being successful");
        });
      }, () => {
        // Error in configuration
        console.log( "Error in configuration");
      });
    }, () => {
      // Error in initialization, maybe PayPal isn't supported or something else
      console.log("Error", " Error in initialization, maybe PayPal isn't supported or something else");
    });
  }
  pay(){
    console.log("fare "+ this.scannedcode[1]);
    let amount = this.scannedcode[1];
    this.payPal.init({
      PayPalEnvironmentProduction: '',
      PayPalEnvironmentSandbox: 'AfcLRrpgtth3gcHtJUwKAIaLVNqr8LS1YaqwPTzqmIT2Ie1TdoPDCdJnyD9G4fZnmNrwQfkEC5-8xRM1'
    }).then(() => {
      // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
      this.payPal.prepareToRender('PayPalEnvironmentNoNetwork', new PayPalConfiguration({
        // Only needed if you get an "Internal Service Error" after PayPal login!
        //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
      })).then(() => {
        let payment = new PayPalPayment(amount, 'USD', 'Description', 'sale');
        this.payPal.renderSinglePaymentUI(payment).then((result) => {
        if (result.response.state == "approved"){
          this.approved = result.response.state;
          this.paid = true;
        }
        }, () => {
          // Error or render dialog closed without being successful
          console.log( "Error or render dialog closed without being successful");
        });
      }, () => {
        // Error in configuration
        console.log( "Error in configuration");

      });
    }, () => {
      // Error in initialization, maybe PayPal isn't supported or something else
      console.log("Error", " Error in initialization, maybe PayPal isn't supported or something else");

    });
  }
  payWithStripe(){
    this.navCtrl.push("StripeWebPage");
    console.log("makepayment");
  }

  getUserBalance(user_id){
    let loader = this.loadingCtrl.create({
      content: "",
    });
    let headers = new HttpHeaders();
    let serviceUrl = this.helper.service_url + 'wallet/balance/'+ user_id;
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem("kdkvfkhggssoauto"));
    this.http.get(serviceUrl,  { headers: headers })
      .timeout(this.helper.internetTimeout)
      .subscribe(
        data => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
          console.log("Balance "+JSON.stringify(data))
          this.balance=data;

        },
        err => {
          loader.dismiss().catch(() => console.log('ERROR CATCH: LoadingController dismiss'));
        }
      )
  }
  presentConfirm() {

  }

}
