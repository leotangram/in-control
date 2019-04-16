import { Routes } from '@angular/router';
import { EstadisticaComponent } from '../ingresos-egresos/estadistica/estadistica.component';
import { IngresosEgresosComponent } from '../ingresos-egresos/ingresos-egresos.component';
import { DetalleComponent } from '../ingresos-egresos/detalle/detalle.component';


export const dashboardRoutes: Routes = [
  { path: '', component: EstadisticaComponent },
  { path: 'ingreso-egreso', component: IngresosEgresosComponent },
  { path: 'detalle', component: DetalleComponent }
]