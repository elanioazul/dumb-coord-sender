import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisorFooterComponent } from './visor-footer.component';

describe('VisorFooterComponent', () => {
  let component: VisorFooterComponent;
  let fixture: ComponentFixture<VisorFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisorFooterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisorFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
