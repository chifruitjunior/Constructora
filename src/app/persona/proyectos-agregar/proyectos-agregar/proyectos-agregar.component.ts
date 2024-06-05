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
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-proyectos-agregar',
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
    HttpClientModule,
  ],
  templateUrl: './proyectos-agregar.component.html',
  styleUrls: ['./proyectos-agregar.component.scss'],
})
export class ProyectosAgregarComponent implements OnInit {
  firebaseKey: string | null = null;
  action: string = 'Agregar';

  idFormGroup: FormGroup;
  nameFormGroup: FormGroup;
  descripcionFormGroup: FormGroup;
  fechaInicioFormGroup: FormGroup;
  fechaFinFormGroup: FormGroup;

  proyecto: Proyectos | null = null;

  proyectosTemporales: Proyectos[] = [];
  dataSource: MatTableDataSource<Proyectos>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('stepper') stepper!: MatStepper;

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
    private snackBar: MatSnackBar,
    private proyectoService: ProyectoService
  ) {
    this.idFormGroup = this._formBuilder.group({
      id: ['', Validators.required],
    });
    this.nameFormGroup = this._formBuilder.group({
      name: ['', Validators.required],
    });
    this.descripcionFormGroup = this._formBuilder.group({
      descripcion: ['', Validators.required],
    });
    this.fechaInicioFormGroup = this._formBuilder.group({
      fechaInicio: ['', Validators.required],
    });
    this.fechaFinFormGroup = this._formBuilder.group({
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
      this.idFormGroup.setValue({ id: this.proyecto.id });
      this.nameFormGroup.setValue({ name: this.proyecto.name });
      this.descripcionFormGroup.setValue({
        descripcion: this.proyecto.descripcion,
      });
      this.fechaInicioFormGroup.setValue({
        fechaInicio: this.proyecto.fechaInicio,
      });
      this.fechaFinFormGroup.setValue({ fechaFin: this.proyecto.fechaFin });
    } else {
      this.action = 'Agregar';
    }
  }

  agregarProyecto(): void {
    if (
      this.idFormGroup.valid &&
      this.nameFormGroup.valid &&
      this.descripcionFormGroup.valid &&
      this.fechaInicioFormGroup.valid &&
      this.fechaFinFormGroup.valid
    ) {
      const proyecto: Proyectos = {
        id: this.idFormGroup.value.id,
        name: this.nameFormGroup.value.name,
        descripcion: this.descripcionFormGroup.value.descripcion,
        fechaInicio: this.fechaInicioFormGroup.value.fechaInicio,
        fechaFin: this.fechaFinFormGroup.value.fechaFin,
        firebaseKey: this.firebaseKey,
      };

      const index = this.proyectosTemporales.findIndex(
        (p) => p.id === proyecto.id
      );
      if (index !== -1) {
        // Editar proyecto temporal existente
        this.proyectosTemporales[index] = proyecto;
      } else {
        // Agregar nuevo proyecto temporal
        this.proyectosTemporales.push(proyecto);
      }

      this.dataSource.data = this.proyectosTemporales;
      this.resetForm();
      this.stepper.reset();
    }
  }

  resetForm(): void {
    this.idFormGroup.reset();
    this.nameFormGroup.reset();
    this.descripcionFormGroup.reset();
    this.fechaInicioFormGroup.reset();
    this.fechaFinFormGroup.reset();
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
    if (
      this.idFormGroup.valid &&
      this.nameFormGroup.valid &&
      this.descripcionFormGroup.valid &&
      this.fechaInicioFormGroup.valid &&
      this.fechaFinFormGroup.valid &&
      this.firebaseKey !== null
    ) {
      const proyecto: Proyectos = {
        id: this.idFormGroup.value.id,
        name: this.nameFormGroup.value.name,
        descripcion: this.descripcionFormGroup.value.descripcion,
        fechaInicio: this.fechaInicioFormGroup.value.fechaInicio,
        fechaFin: this.fechaFinFormGroup.value.fechaFin,
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
    this.proyectoService.getListProyecto().subscribe((proyectos) => {
      this.dataSource.data = proyectos;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  eliminarProyecto(firebaseKey: string): void {
    this.proyectoService.eliminarProyecto(firebaseKey).subscribe(() => {
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
      this.idFormGroup.setValue({ id: proyecto.id });
      this.nameFormGroup.setValue({ name: proyecto.name });
      this.descripcionFormGroup.setValue({ descripcion: proyecto.descripcion });
      this.fechaInicioFormGroup.setValue({ fechaInicio: proyecto.fechaInicio });
      this.fechaFinFormGroup.setValue({ fechaFin: proyecto.fechaFin });
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
    this.router.navigate(['/dashboard/proyectos-dashboard']);
  }
}
