import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, of, Subject, tap, throwError } from 'rxjs';

const apiUrlSend = 'http://localhost:4000/sendinitials'
const apiUrlInitials = 'http://localhost:4000/initials'

@Injectable({
  providedIn: 'root'
})
export class CoordinatesService {

  constructor(private http: HttpClient) { }


  getInitialCoordList$ = this.http.get<any[]>(apiUrlInitials)
  .pipe(
    tap(data => console.log('initials coord are :', JSON.stringify(data))),
    catchError(this.handleError)
  );

  sendCoordToTransform(payload: any): Observable<any> {
    return this.http.post((apiUrlSend), payload)
    .pipe(
      catchError((error) => of(error)),
      map((res: any) => {
        if (!res) {
          throw new Error(
            'Error enviando coordenadas que grabar'
          );
        } else {
          return res;
        }
      })
    );
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.message}`;
    }
    console.error(err);
    return throwError(() => errorMessage);
  }
}
