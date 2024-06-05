import { createReducer, on } from '@ngrx/store';
import * as ProyectoActions from '../reducers/proyecto.actions';
import {
  mapFirebaseToProyecto,
  mapProyectoToFirebase,
} from '../reducers/proyecto.utils';

export interface ProyectoState {
  entities: { [firebaseKey: string]: Proyecto };
}

export interface Proyecto {
  id: string;
  name: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  firebaseKey?: string;
}

export const initialState: ProyectoState = {
  entities: {},
};

export const proyectoReducer = createReducer(
  initialState,
  on(
    ProyectoActions.agregarProyectoExito,
    (state, { proyecto, firebaseKey }) => {
      console.log('Reducer: agregarProyectoExito', proyecto, firebaseKey);
      return {
        ...state,
        entities: {
          ...state.entities,
          [firebaseKey]: mapFirebaseToProyecto(proyecto, firebaseKey),
        },
      };
    }
  ),
  on(
    ProyectoActions.editarProyectoExito,
    (state, { proyecto, firebaseKey }) => {
      console.log('Reducer: editarProyectoExito', proyecto, firebaseKey);
      return {
        ...state,
        entities: {
          ...state.entities,
          [firebaseKey]: mapFirebaseToProyecto(proyecto, firebaseKey),
        },
      };
    }
  )
);
