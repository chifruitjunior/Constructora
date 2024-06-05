import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth/auth.component';
import { PagesComponent } from './pages/pages/pages.component';
import { ClientesDashboardComponent } from './persona/clientes-dashboard/clientes-dashboard/clientes-dashboard.component';
import { ClientesAgregarComponent } from './persona/clientes-agregar/clientes-agregar/clientes-agregar.component';
import { ClienteResolver } from './resolver/cliente.resolver';
import { TestComponent } from './test/test.component';
import { ProyectosDashboardComponent } from './persona/proyectos-dashboard/proyectos-dashboard/proyectos-dashboard.component';
import { ProyectosAgregarComponent } from './persona/proyectos-agregar/proyectos-agregar/proyectos-agregar.component';
import { ProyectoResolver } from './resolver/proyecto.resolver';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: AuthComponent },
  {
    path: 'dashboard',
    component: PagesComponent,
    children: [
      { path: '', component: ClientesDashboardComponent },
      { path: 'clientes-dashboard', component: ClientesDashboardComponent },
      { path: 'clientes-agregar', component: ClientesAgregarComponent },
      {
        path: 'editCliente/:id',
        component: ClientesAgregarComponent,
        resolve: { cliente: ClienteResolver },
      },
      { path: 'test', component: TestComponent },
      { path: 'proyectos-dashboard', component: ProyectosDashboardComponent },
      { path: 'proyectos-agregar', component: ProyectosAgregarComponent },
      {
        path: 'editProyecto/:id',
        component: ProyectosAgregarComponent,
        resolve: { proyecto: ProyectoResolver },
      },
    ],
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];
