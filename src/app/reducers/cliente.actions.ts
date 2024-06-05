import { createAction, props } from '@ngrx/store';
import { Cliente } from '../reducers/cliente.reducer';

export const agregarClienteExito = createAction(
  '[Cliente] Agregar Cliente Exito',
  props<{ cliente: any, firebaseKey: string }>()
);
console.log('Acción agregarClienteExito definida');


export const editarClienteExito = createAction(
  '[Cliente] Editar Cliente Exito',
  props<{ cliente: any, firebaseKey: string }>()
);
console.log('Acción editarClienteExito definida');



