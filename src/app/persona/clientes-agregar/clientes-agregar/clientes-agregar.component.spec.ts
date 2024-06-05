import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientesAgregarComponent } from './clientes-agregar.component';

describe('ClientesAgregarComponent', () => {
  let component: ClientesAgregarComponent;
  let fixture: ComponentFixture<ClientesAgregarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientesAgregarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientesAgregarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
