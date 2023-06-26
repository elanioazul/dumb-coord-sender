import { Component, OnInit } from '@angular/core';
import { CoordinatesService } from './services/coordinates.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { EMPTY, Observable, catchError } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'dumb-coord-sender';
  myNumber = 8;

  errorMessage = '';

  form!: FormGroup<any>;

  initialCoordsTable$ = this.coordService.getInitialCoordList$
  .pipe(
    catchError(err => {
      this.errorMessage = err;
      return EMPTY;
    })
  )
  transformedlCoordsTable$ = this.coordService.getTransformedCoordList$
  .pipe(
    catchError(err => {
      this.errorMessage = err;
      return EMPTY;
    })
  )

  constructor(private coordService: CoordinatesService, private builder: FormBuilder,){}

  ngOnInit(): void {
    this.form = this.builder.group<any>({
      ['coords']: this.builder.control(''),
    });
  }

  onSubmit(): void {
    const payload: any = {
      pairOfCoords: this.form.value.coords,
    };
    console.log(payload);
    
    this.coordService.sendButNoTransform(payload).subscribe((data) => {
      console.log(data);
      
    })
  }
}
