import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisorInfoComponent } from './visor-info.component';

describe('VisorInfoComponent', () => {
  let component: VisorInfoComponent;
  let fixture: ComponentFixture<VisorInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisorInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisorInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
