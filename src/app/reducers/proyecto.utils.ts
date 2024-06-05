import { Proyecto } from './proyecto.reducer';

export const mapProyectoToFirebase = (proyecto: Proyecto): any => ({
  code: proyecto.id,
  nombre: proyecto.name,
  description: proyecto.descripcion,
  startDate: proyecto.fechaInicio,
  endDate: proyecto.fechaFin,
});

export const mapFirebaseToProyecto = (
  firebaseData: any,
  firebaseKey: string
): Proyecto => ({
  id: firebaseData.code,
  name: firebaseData.nombre,
  descripcion: firebaseData.description,
  fechaInicio: firebaseData.startDate,
  fechaFin: firebaseData.endDate,
  firebaseKey: firebaseKey,
});
