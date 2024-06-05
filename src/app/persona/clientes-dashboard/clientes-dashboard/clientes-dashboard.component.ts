import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ClienteService } from '../../../services/cliente.service';
import { Clientes } from '../../../interfaces/clientes';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatSidenavContainer,
  MatSidenavContent,
} from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-clientes-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    RouterModule,
    MatSidenavContainer,
    MatSidenavContent,
    MatToolbar,
    HttpClientModule,
  ],
  templateUrl: './clientes-dashboard.component.html',
  styleUrls: ['./clientes-dashboard.component.scss'],
})
export class ClientesDashboardComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'id',
    'name',
    'tel',
    'email',
    'direc',
    'acciones',
  ];
  dataSource: MatTableDataSource<Clientes>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private clienteEditadoSubscription: Subscription;

  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<Clientes>([]);
    this.clienteEditadoSubscription =
      this.clienteService.clienteEditado.subscribe(() => {
        this.getListClientes();
      });
  }

  ngOnInit(): void {
    this.getListClientes();
  }

  ngOnDestroy(): void {
    this.clienteEditadoSubscription.unsubscribe();
  }

  getListClientes(): void {
    this.clienteService.getListCliente().subscribe((clientes) => {
      this.dataSource.data = clientes;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editCliente(firebaseKey: string): void {
    this.router.navigate([`/dashboard/editCliente/${firebaseKey}`]);
  }

  eliminarCliente(firebaseKey: string): void {
    this.clienteService.eliminarCliente(firebaseKey).subscribe(() => {
      this.getListClientes();
      this.snackBar.open('Cliente eliminado correctamente', 'Cerrar', {
        duration: 3000,
      });
    });
  }
}
