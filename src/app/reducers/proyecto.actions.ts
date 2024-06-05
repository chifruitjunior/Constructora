import { createAction, props } from '@ngrx/store';
import { Proyecto } from '../reducers/proyecto.reducer';

export const agregarProyectoExito = createAction(
  '[Proyecto] Agregar Proyecto Exito',
  props<{ proyecto: any; firebaseKey: string }>()
);
console.log('Acción agregarProyectoExito definida');

export const editarProyectoExito = createAction(
  '[Proyecto] Editar Proyecto Exito',
  props<{ proyecto: any; firebaseKey: string }>()
);
console.log('Acción editarProyectoExito definida');
