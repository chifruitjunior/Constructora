import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ClienteService } from '../services/cliente.service';
import { Clientes } from '../interfaces/clientes';

@Injectable({
  providedIn: 'root'
})
export class ClienteResolver implements Resolve<Clientes> {

  constructor(private clienteService: ClienteService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Clientes> {
    const clienteId = route.paramMap.get('id');
    if (clienteId) {
      return this.clienteService.getCliente(clienteId);
    }
    return new Observable<Clientes>();
  }
}