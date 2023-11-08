import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { SessionStorageService } from '@core/services/session-storage/session-storage.service';

@Injectable()
export class InterceptorInterceptor implements HttpInterceptor {

  constructor(private sessionStorageService: SessionStorageService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.sessionStorageService.getData('access_token');

    //no meto token si es endpoint localhost o ORS fuera de paraguas de chronos auth
    if (token && !request.url.includes('localhost') && !request.url.includes('ors.apps.aroas.westeurope.aroapp.io/ors/v2/directions/driving-car?')) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token.replace('"','').replace('"','')}`
        }
      });
    }

    return next.handle(request)
      .pipe(
        map(res => {
          return res
        }),
        catchError((error: HttpErrorResponse) => {
          let errorMsg = '';
          if (error.error instanceof ErrorEvent) {
            console.log('This is client side error');
            errorMsg = `Error: ${error.error.message}`;
          } else if (error.status === 401) {
            console.log('error.status === 401: Anauthorized');
          }

          else {
            console.log('This is server side error');
            errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
          }
          console.log(errorMsg);
          return throwError(() => {
            const error: any = new Error(`This an error registered at interceptor level`);
            error.timestamp = Date.now();
            return error;
          });
        })
      );
  }
}
