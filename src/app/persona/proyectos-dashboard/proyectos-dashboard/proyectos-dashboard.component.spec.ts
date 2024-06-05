import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectosDashboardComponent } from './proyectos-dashboard.component';

describe('ProyectosDashboardComponent', () => {
  let component: ProyectosDashboardComponent;
  let fixture: ComponentFixture<ProyectosDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProyectosDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProyectosDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
