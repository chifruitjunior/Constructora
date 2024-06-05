import { Injectable } from '@angular/core';
import { Proyectos } from '../interfaces/proyectos';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, forkJoin } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as ProyectoActions from '../reducers/proyecto.actions';

@Injectable({
  providedIn: 'root',
})
export class ProyectoService {
  private baseUrl =
    'https://arquiservicios-260d0-default-rtdb.firebaseio.com/proyectos';

  public proyectoEditado: Subject<void> = new Subject<void>();

  constructor(private http: HttpClient, private store: Store) {}

  getListProyecto(): Observable<Proyectos[]> {
    return this.http.get<{ [key: string]: any }>(`${this.baseUrl}.json`).pipe(
      map((response) => {
        const proyectos: Proyectos[] = [];
        for (const key in response) {
          if (response.hasOwnProperty(key)) {
            const data = this.mapBackData(response[key], key);
            proyectos.push(data);
          }
        }
        return proyectos;
      })
    );
  }

  agregarProyectos(proyectos: Proyectos[]): Observable<any> {
    const peticiones: Observable<any>[] = [];

    proyectos.forEach((proyecto) => {
      const mappedData = this.mapData(proyecto);
      const peticion = this.http
        .post<any>(`${this.baseUrl}.json`, mappedData)
        .pipe(
          tap((response) => {
            const firebaseKey = response.name;
            this.store.dispatch(
              ProyectoActions.agregarProyectoExito({
                proyecto: mappedData,
                firebaseKey,
              })
            );
            console.log(
              'Acción despachada: agregarProyectoExito',
              mappedData,
              firebaseKey
            );
          })
        );
      peticiones.push(peticion);
    });

    return forkJoin(peticiones);
  }

  getProyecto(firebaseKey: string): Observable<Proyectos> {
    return this.http
      .get<any>(`${this.baseUrl}/${firebaseKey}.json`)
      .pipe(map((response) => this.mapBackData(response, firebaseKey)));
  }

  agregarProyecto(proyecto: Proyectos): Observable<any> {
    const mappedData = this.mapData(proyecto);
    return this.http.post<any>(`${this.baseUrl}.json`, mappedData).pipe(
      tap((response) => {
        const firebaseKey = response.name;
        this.store.dispatch(
          ProyectoActions.agregarProyectoExito({
            proyecto: mappedData,
            firebaseKey,
          })
        );
        console.log(
          'Acción despachada: agregarProyectoExito',
          mappedData,
          firebaseKey
        );
      })
    );
  }

  editProyecto(proyecto: Proyectos, firebaseKey: string): Observable<any> {
    const mappedData = this.mapData(proyecto);
    return this.http
      .put<any>(`${this.baseUrl}/${firebaseKey}.json`, mappedData)
      .pipe(
        tap(() => {
          this.store.dispatch(
            ProyectoActions.editarProyectoExito({
              proyecto: mappedData,
              firebaseKey,
            })
          );
          console.log(
            'Acción despachada: editarProyectoExito',
            mappedData,
            firebaseKey
          );
        })
      );
  }

  eliminarProyecto(firebaseKey: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${firebaseKey}.json`);
  }

  private mapData(data: Proyectos): any {
    const mappedData = {
      id: data.id,
      name: data.name,
      description: data.descripcion,
      startDate: data.fechaInicio,
      endDate: data.fechaFin,
      firebaseLlave: data.firebaseKey,
    };
    console.log('Datos mapeados para envío:', mappedData);
    return mappedData;
  }

  private mapBackData(mappedData: any, firebaseKey: string): Proyectos {
    console.log('Datos recibidos de Firebase para mapear:', mappedData);
    const originalData: Proyectos = {
      id: mappedData.id,
      name: mappedData.name,
      descripcion: mappedData.description,
      fechaInicio: mappedData.startDate,
      fechaFin: mappedData.endDate,
      firebaseKey: firebaseKey,
    };
    console.log('Datos mapeados de respuesta:', originalData);
    return originalData;
  }
}
