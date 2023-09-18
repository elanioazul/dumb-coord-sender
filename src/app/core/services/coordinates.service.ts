import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  catchError,
  map,
  Observable,
  of,
  Subject,
  tap,
  throwError,
} from 'rxjs';

import { ICoordinateSystem } from '../interfaces/coord-system.interfaz';
import { CoordinateSystem } from '../classes/coord-system';

import { ICoordinateInitial } from '../interfaces/coord-initial.interfaz';
import { CoordinateInitial } from '../classes/coord-initial';

import { ICoordinateTransformed } from '../interfaces/coord-transformed.interfaz';
import { CoordinateTransformed } from '../classes/coord-transformed';

const apiUrlSend = 'http://localhost:4000/api/sendinitials';
const apiUrlInitials = 'http://localhost:4000/api/initials';
const apiUrlCoordSystems = 'http://localhost:4000/api/coordsystems';
const apiUrlTransformed = 'http://localhost:4000/api/transformed';
const apiUrlTransform = 'http://localhost:4000/api/transform';

@Injectable({
  providedIn: 'root',
})
export class CoordinatesService {
  constructor(private http: HttpClient) {}

  getCoordSystems$ = this.http
    .get<ICoordinateSystem[]>(apiUrlCoordSystems)
    .pipe(
      //tap(data => console.log('coord systems are :', JSON.stringify(data))),
      catchError(this.handleError)
    )
    .pipe(
      map((data: ICoordinateSystem[]) =>
        data.map((item: any) => {
          return new CoordinateSystem(
            item[0],
            item[1],
            item[2],
            item[3],
            item[4]
          );
        })
      )
    );

  getInitialCoordList$ = this.http
    .get<ICoordinateInitial[]>(apiUrlInitials)
    .pipe(
      //tap(data => console.log('initials coord are :', JSON.stringify(data))),
      catchError(this.handleError)
    )
    .pipe(
      map((data: ICoordinateInitial[]) =>
        data.map((item: any) => {
          return new CoordinateInitial(item[0], item[1], item[2], item[3]);
        })
      )
    );

  getTransformedCoordList$ = this.http
    .get<any[]>(apiUrlTransformed)
    .pipe(
      //tap(data => console.log('transformed coord are :', JSON.stringify(data))),
      catchError(this.handleError)
    )
    .pipe(
      map((data: ICoordinateTransformed[]) =>
        data.map((item: any) => {
          return new CoordinateTransformed(
            item[0],
            item[1],
            item[2],
            item[3],
            item[4],
            item[5]
          );
        })
      )
    );

  sendButNoTransform(payload: any): Observable<any> {
    return this.http.post(apiUrlSend, payload).pipe(
      catchError((error) => of(error)),
      map((res: any) => {
        if (!res) {
          throw new Error('Error enviando coordenadas que grabar');
        } else {
          return res;
        }
      })
    );
  }
  sendCoordToTransform(payload: any): Observable<any> {
    return this.http.post(apiUrlTransform, payload).pipe(
      catchError((error) => of(error)),
      map((res: any) => {
        if (!res) {
          throw new Error('Error enviando coordenadas que grabar');
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
