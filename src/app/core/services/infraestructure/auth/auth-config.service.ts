import { Injectable } from '@angular/core';

import { SessionStorageService } from '@core/services/session-storage/session-storage.service';


@Injectable({
  providedIn: 'root'
})
export class AuthConfigService {

  constructor(
    private sessionStorageService: SessionStorageService) { }


  // async initAuth(): Promise<any> {
  //   return new Promise<void>((resolveFn, rejectFn) => {
  //     // setup oauthService
  //     this.oauthService.configure(this.authConfig);
  //     //this.oauthService.setStorage(localStorage);
  //     this.oauthService.tokenValidationHandler = new NullValidationHandler();

  //     // subscribe to token events
  //     /*this.oauthService.events
  //       .pipe(filter((e: any) => {
  //         return e.type === 'token_received';
  //       }))
  //       .subscribe(());*/

  //     // continue initializing app or redirect to login-page
  //     this.oauthService.loadDiscoveryDocument().then(() => {
  //       resolveFn();
  //     });
  //   });
  // }

  // authenticate(): Observable<any> {
  //   return this.http.post<any>(tokenPath, hugoherradorBody, { headers: this.setHeadersForToken()} )
  //     .pipe(
  //       tap((response: any) => {
  //         this.sessionStorageService.saveData(`login-qas-data`, JSON.stringify(response));
  //       })
  //     );
  // }

  public saveToken(token: string): void {
    this.sessionStorageService.saveData('access_token', token);
  }

  // setHeadersForOthersRequests(token: string): HttpHeaders {
  //   let headers = new HttpHeaders();
  //   headers = headers.set('Authorization', 'Bearer ' + token);
  //   headers = headers.set('Accept', 'application/json');
  //   headers = headers.set('Content-Type', 'application/json');
  //   return headers;
  // }

  // setHeadersForToken(/*token: any*/): HttpHeaders {
  //   let headers = new HttpHeaders();
  //   //headers = headers.set('Authorization', `Bearer ${token}`)
  //   headers = headers.set('custom_preferred_username', hugoherradorHeaders.custom_preferred_username);
  //   headers = headers.set('custom_roles', hugoherradorHeaders.custom_roles);
  //   headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
  //   //headers = headers.set('Connection', 'keep-alive');
  //   //headers = headers.set('Accept-Encoding', 'gzip, deflate, br');
  //   //headers = headers.set('Access-Control-Allow-Headers', 'custom_preferred_username');
  //   return headers;
  // }

  // public getDecodedToken(): any {
  //   return this.jwtHelper.decodeToken(this.oauthService.getAccessToken());
  // }
}
