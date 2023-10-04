import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OlcontrolComponent } from './olcontrol.component';

describe('OlcontrolComponent', () => {
  let component: OlcontrolComponent;
  let fixture: ComponentFixture<OlcontrolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ OlcontrolComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OlcontrolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
