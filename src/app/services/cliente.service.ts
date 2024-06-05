import { Injectable } from '@angular/core';
import { Clientes } from '../interfaces/clientes';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as ClienteActions from '../reducers/cliente.actions';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private baseUrl = 'https://arquiservicios-260d0-default-rtdb.firebaseio.com/clientes';

  public clienteEditado: Subject<void> = new Subject<void>();

  constructor(private http: HttpClient, private store: Store) {}

  getListCliente(): Observable<Clientes[]> {
    return this.http.get<{ [key: string]: any }>(`${this.baseUrl}.json`).pipe(
      map(response => {
        const clientes: Clientes[] = [];
        for (const key in response) {
          if (response.hasOwnProperty(key)) {
            const data = this.mapBackData(response[key], key);
            clientes.push(data);

          }
        }
        return clientes;
      })
    );
  }

  getCliente(firebaseKey: string): Observable<Clientes> {
    return this.http.get<any>(`${this.baseUrl}/${firebaseKey}.json`).pipe(
      map(response => this.mapBackData(response, firebaseKey))
    );
  }

  agregarCliente(cliente: Clientes): Observable<any> {
    const mappedData = this.mapData(cliente);
    return this.http.post<any>(`${this.baseUrl}.json`, mappedData).pipe(
      tap((response) => {
        const firebaseKey = response.name;
        this.store.dispatch(ClienteActions.agregarClienteExito({ cliente: mappedData, firebaseKey }));
        console.log('Acción despachada: agregarClienteExito', mappedData, firebaseKey);
      })
    );
  }
  
  editCliente(cliente: Clientes, firebaseKey: string): Observable<any> {
    const mappedData = this.mapData(cliente);
    return this.http.put<any>(`${this.baseUrl}/${firebaseKey}.json`, mappedData).pipe(
      tap(() => {
        this.store.dispatch(ClienteActions.editarClienteExito({ cliente: mappedData, firebaseKey }));
        console.log('Acción despachada: editarClienteExito', mappedData, firebaseKey);
      })
    );
  }

  eliminarCliente(firebaseKey: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${firebaseKey}.json`);
  }

  private mapData(data: Clientes): any {
    const mappedData = {
      code: data.id,
      nombre: data.name,
      cel: data.tel,
      correo: data.email,
      address: data.direc,
      firebaseLlave: data.firebaseKey
    };
    console.log('Datos mapeados para envío:', mappedData);
    return mappedData;
  }
  
  
  private mapBackData(mappedData: any, firebaseKey: string): Clientes {
    console.log('Datos recibidos de Firebase para mapear:', mappedData);
    const originalData: Clientes = {
      id: mappedData.code,
      name: mappedData.nombre,
      tel: mappedData.cel,
      email: mappedData.correo,
      direc: mappedData.address,
      firebaseKey: firebaseKey
    };
    console.log('Datos mapeados de respuesta:', originalData);
    return originalData;
  }
  
}
