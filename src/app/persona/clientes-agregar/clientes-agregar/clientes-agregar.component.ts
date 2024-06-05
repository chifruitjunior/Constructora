import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClienteService } from '../../../services/cliente.service';
import { Clientes } from '../../../interfaces/clientes';
import { MatStepperModule } from '@angular/material/stepper';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-clientes-agregar',
  standalone: true,
  imports: [
    CommonModule, 
    MatStepperModule,
    MatSidenavModule,
    MatDividerModule,
    RouterModule,
    MatTableModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './clientes-agregar.component.html',
  styleUrls: ['./clientes-agregar.component.scss']
})
export class ClientesAgregarComponent implements OnInit {
  firebaseKey: string | null = null;
  action: string = 'Agregar';

  idFormGroup: FormGroup;
  nameFormGroup: FormGroup;
  telFormGroup: FormGroup;
  emailFormGroup: FormGroup;
  direcFormGroup: FormGroup;

  cliente: Clientes | null = null;

  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private aRoute: ActivatedRoute,
    private _clienteService: ClienteService
  ) {
    this.idFormGroup = this._formBuilder.group({
      id: ['', Validators.required]
    });
    this.nameFormGroup = this._formBuilder.group({
      name: ['', Validators.required]
    });
    this.telFormGroup = this._formBuilder.group({
      tel: ['', Validators.required]
    });
    this.emailFormGroup = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
    this.direcFormGroup = this._formBuilder.group({
      direc: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cliente = this.aRoute.snapshot.data['cliente'];
    console.log('Cliente resuelto resolver:', this.cliente);
    if (this.cliente) {
      this.firebaseKey = this.cliente.firebaseKey;
      this.action = 'Editar';
      this.idFormGroup.patchValue({ id: this.cliente.id });
      this.nameFormGroup.patchValue({ name: this.cliente.name });
      this.telFormGroup.patchValue({ tel: this.cliente.tel });
      this.emailFormGroup.patchValue({ email: this.cliente.email });
      this.direcFormGroup.patchValue({ direc: this.cliente.direc });
    } else {
      this.action = 'Agregar';
    }
  }

  agregarCliente(): void {
    if (this.idFormGroup.valid && this.nameFormGroup.valid && this.telFormGroup.valid && this.emailFormGroup.valid && this.direcFormGroup.valid) {
      const cliente: Clientes = {
        id: this.idFormGroup.value.id,
        name: this.nameFormGroup.value.name,
        tel: this.telFormGroup.value.tel,
        email: this.emailFormGroup.value.email,
        direc: this.direcFormGroup.value.direc,
        firebaseKey: this.firebaseKey 
      };

      if (this.firebaseKey) {
        this._clienteService.editCliente(cliente, this.firebaseKey).subscribe(
          () => {
            this._clienteService.clienteEditado.next(); 
            this.router.navigate(['/dashboard/clientes-dashboard']);
          },
          (error) => {
            console.error('Error al editar el cliente:', error);
          }
        );
      } else {
        this._clienteService.agregarCliente(cliente).subscribe(
          () => {
            this.router.navigate(['/dashboard/clientes-dashboard']);
          },
          (error) => {
            console.error('Error al agregar el cliente:', error);
          }
        );
      }
    }
  }

  cancelar(): void {
    this.router.navigate(['/dashboard/clientes-dashboard']);
  }
}