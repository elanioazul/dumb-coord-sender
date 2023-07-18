import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

const apiUrlCheckAbs = 'http://localhost:4000/api/intersectabs'

@Injectable({
  providedIn: 'root'
})
export class AbsService {

  constructor(private http: HttpClient) { }

  intersectAbs(payload: any): Observable<any> {
    return this.http.post((apiUrlCheckAbs), payload)
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
