import { Cliente } from './cliente.reducer';

export const mapClienteToFirebase = (cliente: Cliente): any => ({
  code: cliente.id,
  nombre: cliente.name,
  cel: cliente.tel,
  correo: cliente.email,
  address: cliente.direc,
});

export const mapFirebaseToCliente = (firebaseData: any, firebaseKey: string): Cliente => ({
  id: firebaseData.code,
  name: firebaseData.nombre,
  tel: firebaseData.cel,
  email: firebaseData.correo,
  direc: firebaseData.address,
  firebaseKey: firebaseKey,
});