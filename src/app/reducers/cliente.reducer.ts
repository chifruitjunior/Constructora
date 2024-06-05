import { createReducer, on } from '@ngrx/store';
import * as ClienteActions from '../reducers/cliente.actions'; 
import { mapFirebaseToCliente, mapClienteToFirebase } from '../reducers/cliente.utils'; 

export interface ClienteState {
  entities: { [firebaseKey: string]: Cliente };
}

export interface Cliente {
    id: string;
    name: string;
    tel: string;
    email: string;
    direc: string;
    firebaseKey?: string;
}

export const initialState: ClienteState = {
  entities: {},
};

export const clienteReducer = createReducer(
  initialState,
  on(ClienteActions.agregarClienteExito, (state, { cliente, firebaseKey }) => {
    console.log('Reducer: agregarClienteExito', cliente, firebaseKey);
    return {
      ...state,
      entities: {
        ...state.entities,
        [firebaseKey]: mapFirebaseToCliente(cliente, firebaseKey),
      },
    };
  }),
  on(ClienteActions.editarClienteExito, (state, { cliente, firebaseKey }) => {
    console.log('Reducer: editarClienteExito', cliente, firebaseKey);
    return {
      ...state,
      entities: {
        ...state.entities,
        [firebaseKey]: mapFirebaseToCliente(cliente, firebaseKey),
      },
    };
  }),
);