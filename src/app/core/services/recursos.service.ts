import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Resource } from '@core/classes/resource';
import { IResourcesByRadioRes } from '@core/interfaces/reecurso-interfaz';
import { BehaviorSubject, Observable, catchError, map, of, throwError } from 'rxjs';

const apiUrlRecursos = 'https://qas-chronos-router.apps.aroas.westeurope.aroapp.io/resources?';

@Injectable({
  providedIn: 'root'
})
export class RecursosService {

  public requestedDistance = new BehaviorSubject<number>(2);
  requestedDistance$ = this.requestedDistance.asObservable();

  public requestedUnit = new BehaviorSubject<string>('KILOMETER');
  requestedUnit$ = this.requestedUnit.asObservable();

  public selectedSrid = new BehaviorSubject<number>(4326);
  selectedSrid$ = this.selectedSrid.asObservable();

  public latitude = new BehaviorSubject<number>(41.585404);
  latitude$ = this.latitude.asObservable();

  public longitude = new BehaviorSubject<number>(2.551060);
  longitude$ = this.longitude.asObservable();

  constructor(private http: HttpClient) { }

  setRequestedDistance(distance: number): void {
    this.requestedDistance.next(distance);
  }
  getRequestedDistance(): number {
    return this.requestedDistance.getValue();
  }

  setRequestedUnit(unit: string): void {
    this.requestedUnit.next(unit);
  }
  getRequestedUnit(): string {
    return this.requestedUnit.getValue();
  }

  setSelectedSrid(srid: number): void {
    this.selectedSrid.next(srid);
  }
  getSelectedSrid(): number {
    return this.selectedSrid.getValue();
  }

  setLatitude(lat: number): void {
    this.latitude.next(lat);
  }
  getLatitude(): number{
    return this.latitude.getValue();
  }

  setLongitude(lon: number): void {
    this.longitude.next(lon);
  }
  getLongitude(): number {
    return this.longitude.getValue();
  }

  getResourcesByRadio(page: number, size: number): Observable<IResourcesByRadioRes> {

    let params = new HttpParams()
    .set('latitudeId', this.getLatitude())
    .set('longitudeId', this.getLongitude())
    .set('distance', this.getRequestedDistance())
    .set('unit', this.getRequestedUnit())
    .set('selectedSrid', this.getSelectedSrid())
    .set('resourceSrid', 25831)
    .set('targetSrid', 4326)
    .set('page', page)
    .set('size', size);

    return this.http.get<IResourcesByRadioRes>(apiUrlRecursos, { params })
    .pipe(
      catchError(this.handleError),
      map((res: IResourcesByRadioRes) => ({
        ...res, content: res.content.map((item: any) => new Resource(item))
      }))
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
