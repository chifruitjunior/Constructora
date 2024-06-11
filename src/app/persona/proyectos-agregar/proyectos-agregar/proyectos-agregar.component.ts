import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProyectoService } from '../../../services/proyecto.service';
import { Proyectos } from '../../../interfaces/proyectos';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-proyectos-agregar',
  standalone: true,
  imports: [
    CommonModule,
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
    HttpClientModule,
    MatExpansionModule,
  ],
  templateUrl: './proyectos-agregar.component.html',
  styleUrls: ['./proyectos-agregar.component.scss'],
})
export class ProyectosAgregarComponent implements OnInit {
  firebaseKey: string | null = null;
  action: string = 'Agregar';
  proyectoForm: FormGroup;

  proyecto: Proyectos | null = null;

  proyectosTemporales: Proyectos[] = [];
  dataSource: MatTableDataSource<Proyectos>;
  proyectoEditado: Proyectos | null = null; // Proyecto temporal antes de editar
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'id',
    'name',
    'descripcion',
    'fechaInicio',
    'fechaFin',
    'acciones',
  ];

  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private aRoute: ActivatedRoute,
    private _proyectoService: ProyectoService,
    private snackBar: MatSnackBar
  ) {
    this.proyectoForm = this._formBuilder.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      descripcion: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
    });

    this.dataSource = new MatTableDataSource<Proyectos>([]);
  }

  ngOnInit(): void {
    this.proyecto = this.aRoute.snapshot.data['proyecto'];
    console.log('Proyecto resuelto resolver:', this.proyecto);
    if (this.proyecto) {
      this.firebaseKey = this.proyecto.firebaseKey;
      this.action = 'Editar';
      this.proyectoForm.patchValue(this.proyecto);
    } else {
      this.action = 'Agregar';
    }
  }

  agregarProyecto(): void {
    if (this.proyectoForm.valid) {
      const proyecto: Proyectos = {
        ...this.proyectoForm.value,
        firebaseKey: this.firebaseKey,
      };

      const index = this.proyectosTemporales.findIndex(
        (p) => p.id === proyecto.id
      );
      if (index !== -1) {
        this.proyectosTemporales[index] = proyecto;
      } else {
        this.proyectosTemporales.push(proyecto);
      }

      this.dataSource.data = this.proyectosTemporales;
      this.proyectoForm.reset();
    }
  }

  enviarProyectos(): void {
    if (this.proyectosTemporales.length > 0) {
      this._proyectoService
        .agregarProyectos(this.proyectosTemporales)
        .subscribe(
          () => {
            this.proyectosTemporales = [];
            this.dataSource.data = [];
            this.snackBar.open('Proyectos enviados correctamente', 'Cerrar', {
              duration: 3000,
            });
            this.router.navigate(['/dashboard/proyectos-dashboard']);
          },
          (error) => {
            console.error('Error al enviar los proyectos:', error);
          }
        );
    }
  }

  editarProyecto(): void {
    if (this.proyectoForm.valid && this.firebaseKey !== null) {
      const proyecto: Proyectos = {
        ...this.proyectoForm.value,
        firebaseKey: this.firebaseKey,
      };

      this._proyectoService.editProyecto(proyecto, this.firebaseKey).subscribe(
        () => {
          this.snackBar.open('Proyecto editado correctamente', 'Cerrar', {
            duration: 3000,
          });
          this.router.navigate(['/dashboard/proyectos-dashboard']);
        },
        (error) => {
          console.error('Error al editar el proyecto:', error);
        }
      );
    }
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

  getListProyectos(): void {
    this._proyectoService.getListProyecto().subscribe((proyectos) => {
      this.dataSource.data = proyectos;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  eliminarProyecto(firebaseKey: string): void {
    this._proyectoService.eliminarProyecto(firebaseKey).subscribe(() => {
      this.getListProyectos();
      this.snackBar.open('Proyecto eliminado correctamente', 'Cerrar', {
        duration: 3000,
      });
    });
  }

  editarProyectoTemporal(proyecto: Proyectos): void {
    const index = this.proyectosTemporales.findIndex(
      (p) => p.id === proyecto.id
    );
    if (index !== -1) {
      this.proyectoEditado = { ...proyecto }; // Guardar copia del proyecto
      this.proyectoForm.patchValue(proyecto);
      this.firebaseKey = proyecto.firebaseKey;
      this.proyectosTemporales.splice(index, 1);
      this.dataSource.data = this.proyectosTemporales;
    }
  }

  eliminarProyectoTemporal(proyecto: Proyectos): void {
    const index = this.proyectosTemporales.findIndex(
      (p) => p.id === proyecto.id
    );
    if (index !== -1) {
      this.proyectosTemporales.splice(index, 1);
      this.dataSource.data = this.proyectosTemporales;
    }
  }

  cancelar(): void {
    if (this.proyectoEditado) {
      this.proyectosTemporales.push(this.proyectoEditado);
      this.dataSource.data = this.proyectosTemporales;
      this.proyectoEditado = null;
      this.proyectoForm.reset();
    }
    this.router.navigate(['/dashboard/proyectos-agregar']);
  }
}
