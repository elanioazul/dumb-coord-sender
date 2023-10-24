import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisorSidebarNoTemplateTabComponent } from './visor-sidebar-no-template-tab.component';

describe('VisorSidebarNoTemplateTabComponent', () => {
  let component: VisorSidebarNoTemplateTabComponent;
  let fixture: ComponentFixture<VisorSidebarNoTemplateTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisorSidebarNoTemplateTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisorSidebarNoTemplateTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
