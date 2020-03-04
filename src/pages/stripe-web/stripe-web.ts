import { Component,HostListener} from "@angular/core";
import { IonicPage, NavController, NavParams,AlertController} from "ionic-angular";
declare var Stripe;
import { HttpClient,HttpHeaders} from "@angular/common/http";
import { HelperProvider } from '../../providers/helper/helper';
declare var StripeCheckout;


/**
 * Generated class for the StripeWebPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-stripe-web",
  templateUrl: "stripe-web.html"
})
export class StripeWebPage {
  stripe = Stripe("pk_test_j4NfzX79yojSHKEKkG2TMuUO00CQWvXmKD");
  card: any;
  handler:any;
  paymentAmount: string;
  currencyIcon: any;
  constructor(private alertCtrl:AlertController,private http: HttpClient,public navCtrl: NavController,public navParams: NavParams,public helper: HelperProvider) {}
  ngOnInit() {
    this.setupStripe();
  }
  setupStripe() {
    let elements = this.stripe.elements();
    var style = {
      base: {
        color: "#32325d",
        lineHeight: "24px",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4"
        }
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    };

    this.card = elements.create("card", { style: style });
    console.log(this.card);
    this.card.mount("#card-element");

    this.card.addEventListener("change", event => {
      var displayError = document.getElementById("card-errors");
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = "";
      }
    });

    var form = document.getElementById("payment-form");
    form.addEventListener("submit", event => {
      event.preventDefault();
      console.log(event);

      this.stripe.createSource(this.card).then(result => {
        if (result.error) {
          var errorElement = document.getElementById("card-errors");
          errorElement.textContent = result.error.message;
        } else {
          console.log(result);
          this.makePayment(result);
        }
      });
    });
  }
  makePayment(token) {
    let headers = new HttpHeaders();
    console.log(token.source.id);
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', 'Bearer '+ localStorage.getItem("kdkvfkhggssoauto"));
    var payment = {
      token: token.source.id,
      price: 10,
  }
  // {amount: "2",currency: "usd",token: token.id}
  let serviceUrl = this.helper.service_url +"stripePayment";
    // let url="https://us-central1-autobus-43798.cloudfunctions.net/payWithStripe";
    this.http
      .post(serviceUrl,payment,{ headers: headers })
      .subscribe(res => {
        console.log("res= " +res);
      }
      );
  }
payButtonClickHandler(){
    this.handlerOpen();  // To open your stripe pop-up
}
handlerOpen(){
  this.handler.open({
    name: 'autobus', // Pass your application name
    amount: 200, // Pass your billing amount
  });
}
@HostListener('window:popstate')
  onPopstate() {
    this.handler.close(); // To close the pop-up
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad StripeWebPage");
      setTimeout(() => {
    this.handler =  StripeCheckout.configure({
      key: 'pk_test_j4NfzX79yojSHKEKkG2TMuUO00CQWvXmKD',
      image: '../assets/imgs/marketplace.png', // Picture you want to show in pop up
      locale: 'auto',
      token: token => {
        console.log(JSON.stringify(token));
        // Handle Stripe response
        // let alert=this.alertCtrl.create({
        //   title: 'Response from Stripe',
        //   message: JSON.stringify(token),
        //   buttons:['ok']
        // });
        //   alert.present();
      }
    })
  }, 1000)

  }
}
