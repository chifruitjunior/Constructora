import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ProyectoService } from '../../../services/proyecto.service';
import { Proyectos } from '../../../interfaces/proyectos';
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
  selector: 'app-proyectos-dashboard',
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
  templateUrl: './proyectos-dashboard.component.html',
  styleUrls: ['./proyectos-dashboard.component.scss'],
})
export class ProyectosDashboardComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'id',
    'name',
    'descripcion',
    'fechaInicio',
    'fechaFin',
    'acciones',
  ];
  dataSource: MatTableDataSource<Proyectos>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private proyectoEditadoSubscription: Subscription;

  constructor(
    private proyectoService: ProyectoService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<Proyectos>([]);
    this.proyectoEditadoSubscription =
      this.proyectoService.proyectoEditado.subscribe(() => {
        this.refreshProyectos();
      });
  }

  ngOnInit(): void {
    this.getListProyectos();
  }

  ngOnDestroy(): void {
    this.proyectoEditadoSubscription.unsubscribe();
  }

  getListProyectos(): void {
    this.proyectoService.getListProyecto().subscribe((proyectos) => {
      this.dataSource.data = proyectos;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  refreshProyectos(): void {
    this.getListProyectos();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editProyecto(firebaseKey: string): void {
    this.router.navigate([`/dashboard/editProyecto/${firebaseKey}`]);
  }

  eliminarProyecto(firebaseKey: string): void {
    this.proyectoService.eliminarProyecto(firebaseKey).subscribe(() => {
      this.refreshProyectos();
      this.snackBar.open('Proyecto eliminado correctamente', 'Cerrar', {
        duration: 3000,
      });
    });
  }
}
