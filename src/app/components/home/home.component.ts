import { Component, OnDestroy, OnInit } from '@angular/core';
import { CoordinatesService } from '../../services/coordinates.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { EMPTY, Observable, Subject, Subscription, catchError, takeUntil } from 'rxjs';
import { CoordinateSystem } from '../../classes/coord-system';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, OnDestroy {
  title = 'dumb-coord-sender';

  destroy$ = new Subject<void>();
  subscriptions: Subscription[] = [];

  coordSystemsOptions!: CoordinateSystem[];

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

  constructor(private coordService: CoordinatesService, private builder: FormBuilder, private messageService: MessageService){}

  ngOnInit(): void {
    this.coordService.getCoordSystems$.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.coordSystemsOptions = data
    });
    this.form = this.builder.group<any>({
      ['epsg']: this.builder.control(0, Validators.required),
      ['coords']: this.builder.control('', Validators.required),
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    const payload: any = {
      epsgSelected: this.form.value.epsg,
      pairOfCoords: this.form.value.coords,
    };
    console.log(payload);

    // this.coordService.sendButNoTransform(payload).subscribe((data) => {
    //   console.log(data);
      
    // })
    
    this.coordService.sendCoordToTransform(payload).subscribe((data) => {
      console.log(data);
      const res = JSON.parse(data.body); 
      if (res.initial_point && res.transformed_point) {
        this.messageService.add({
          summary: 'Éxito',
          detail: `Coordendadas transformadas con exito. Recarge la página.`,
          severity: 'success',
        });
      } else {
        this.messageService.add({
          summary: 'Error',
          detail: `Ha habido un error transformando las coordendas`,
          severity: 'error',
        });
      }

    })
  }
}

