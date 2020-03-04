import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TripPlanningPage } from '../trip-plannig-tab/trip-plannig-tab';
import { AccountPage } from '../account-tab/account-tab';
import { HomePage } from '../home/home';
import {PaymentPage} from '../payment/payment';
import { UniversityPage } from '../university/university';
import { HelperProvider } from '../../providers/helper/helper';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = TripPlanningPage;
  // tab3Root = UniversityPage;
  tab4Root = AccountPage;
  tab5root = PaymentPage;

  constructor(public translate: TranslateService, public helper: HelperProvider) {

  }
}
