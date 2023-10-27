import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisorZoomInComponent } from './visor-zoom-in.component';

describe('VisorZoomInComponent', () => {
  let component: VisorZoomInComponent;
  let fixture: ComponentFixture<VisorZoomInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisorZoomInComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisorZoomInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
