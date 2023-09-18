import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisorpageComponent } from './visorpage.component';

describe('VisorpageComponent', () => {
  let component: VisorpageComponent;
  let fixture: ComponentFixture<VisorpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisorpageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisorpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
