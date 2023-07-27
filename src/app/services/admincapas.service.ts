import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

const apiUrlCheckAdminInfo = 'http://localhost:4000/api/intersectcapas'

@Injectable({
  providedIn: 'root'
})
export class AdmincapasService {

  constructor(private http: HttpClient) { }

  intersectCapas(payload: any): Observable<any> {
    return this.http.post((apiUrlCheckAdminInfo), payload)
    .pipe(
      catchError((error) => of(error)),
      map((res: any) => {
        if (!res) {
          throw new Error(
            'Error chequeando ABS intersectada'
          );
        } else {
          return res;
        }
      })
    );
  }
}
