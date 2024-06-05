import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientesDashboardComponent } from './clientes-dashboard.component';

describe('ClientesDashboardComponent', () => {
  let component: ClientesDashboardComponent;
  let fixture: ComponentFixture<ClientesDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientesDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
