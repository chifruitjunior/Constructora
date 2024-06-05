import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { ProyectoService } from '../services/proyecto.service';
import { Proyectos } from '../interfaces/proyectos';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProyectoResolver implements Resolve<Proyectos> {
  constructor(private proyectoService: ProyectoService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Proyectos> {
    const firebaseKey = route.paramMap.get('id');
    if (firebaseKey) {
      return this.proyectoService.getProyecto(firebaseKey).pipe(
        catchError(() => {
          // Manejar el error en caso de que no se pueda obtener el proyecto
          console.error('No se pudo obtener el proyecto');
          return of(null as unknown as Proyectos);
        })
      );
    } else {
      // Manejar el caso en el que no se proporcione un firebaseKey válido
      console.error('No se proporcionó un firebaseKey válido');
      return of(null as unknown as Proyectos);
    }
  }
}
