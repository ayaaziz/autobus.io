import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
//import { environment } from './../../environments/environment';
import { HelperProvider } from './helper/helper';
//import { HelperProvider } from '../helper/helper';
import { Observable } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {

  constructor(  public helper: HelperProvider, private injector: Injector, public storage: Storage,  ) {
    
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //alert("here token")
    return next.handle(request).catch((errorResponse: HttpErrorResponse) => {
      const error = (typeof errorResponse.error !== 'object') ? JSON.parse(errorResponse.error) : errorResponse;
      //alert(JSON.stringify(errorResponse.url))
      if ( errorResponse.url == this.helper.service_url +"api/login") {
        return Observable.throw(errorResponse);
    }
     else if (errorResponse.status === 401 && errorResponse.url != this.helper.service_url +'refreshToken') {
        
        const http = this.injector.get(HttpClient);
        let headers = new HttpHeaders()
        headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');//client_credentials
                
        let params = new HttpParams().set('refresh_token', localStorage.getItem('reefdfdfvcvcauto'))
        return http.post<any>(this.helper.service_url +`refreshToken`, params, { headers: headers })
          .flatMap(data => {
           this.storage.set("user_token",data)
            localStorage.setItem('kdkvfkhggssoauto', data.access_token)
            localStorage.setItem('reefdfdfvcvcauto', data.refresh_token)
            const cloneRequest = request.clone({setHeaders: {'Authorization': `Bearer ${data.access_token}`}});
            return next.handle(cloneRequest);
           
          })
          .catch( err => {
            this.helper.logout()
            return Observable.throw(errorResponse);
          }
          )
       // })
      }
      else if (errorResponse.status === 401){
        this.helper.logout()
        return;
      }
      else{
        return Observable.throw(errorResponse);
      }
    });

  }
}