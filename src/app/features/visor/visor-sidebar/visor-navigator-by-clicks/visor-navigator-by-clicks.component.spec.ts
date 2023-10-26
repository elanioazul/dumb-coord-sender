import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisorNavigatorByClicksComponent } from './visor-navigator-by-clicks.component';

describe('VisorNavigatorByClicksComponent', () => {
  let component: VisorNavigatorByClicksComponent;
  let fixture: ComponentFixture<VisorNavigatorByClicksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisorNavigatorByClicksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisorNavigatorByClicksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
