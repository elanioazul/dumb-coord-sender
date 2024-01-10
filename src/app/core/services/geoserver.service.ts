import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
//import { FeatureCollection } from 'geojson';
import { FeatureCollection } from '@core/interfaces/recurso-geoserver';

//const localGeoServerInstance = 'http://localhost:8080/geoserver/ows?';
const recursosGeoJsonUri = 'http://localhost:8080/geoserver/chronos-recursos/wms?service=WMS&version=1.1.0&request=GetMap&layers=chronos-recursos%3ARESOURCES&bbox=-18.3201264155889%2C27.637723150776%2C4.34014226940938%2C43.9215181349627&width=768&height=551&srs=EPSG%3A4258&styles=&FORMAT=geojson'
const recursosGeoJsonShpUri = 'http://10.225.20.55:9090/SEM/wms?service=WMS&version=1.1.0&request=GetMap&layers=SEM:ResourcesQAS&bbox=-18.3201264155889%2C27.637723150776%2C4.34014226940938%2C43.9215181349627&width=768&height=551&srs=EPSG%3A4258&styles=&FORMAT=geojson';

@Injectable({
  providedIn: 'root'
})
export class GeoserverService {
  http = inject(HttpClient);


  constructor() { }

  getRecursosGeoJson$ = this.http
  .get<FeatureCollection>(recursosGeoJsonUri)
  .pipe(
    catchError(this.handleError)
  )
  // .pipe(
  //   map((data: any) =>
  //     console.log(data)
  //   )
  // );

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
