import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisorSearchByCoordComponent } from './visor-search-by-coord.component';

describe('VisorSearchByCoordComponent', () => {
  let component: VisorSearchByCoordComponent;
  let fixture: ComponentFixture<VisorSearchByCoordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisorSearchByCoordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisorSearchByCoordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
