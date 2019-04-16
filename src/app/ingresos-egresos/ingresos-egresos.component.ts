import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IngresoEgreso } from './ingreso-egreso.model';
import { IngresoEgresoService } from './ingreso-egreso.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import * as fromIngresoEgreso from './ingreso-egreso.reducer'
import { Subscription } from 'rxjs';
import { ActivarLoadingAction } from '../shared/ui.actions';

@Component({
  selector: 'app-ingresos-egresos',
  templateUrl: './ingresos-egresos.component.html',
  styles: []
})
export class IngresosEgresosComponent implements OnInit, OnDestroy {

  forma: FormGroup
  tipo = 'ingreso'

  loadingSubs: Subscription = new Subscription()
  cargando: boolean

  constructor(
    public ingresoEgresoService: IngresoEgresoService,
    private store: Store<fromIngresoEgreso.AppState>
  ) { }

  ngOnInit() {
    this.loadingSubs = this.store.select('ui')
      .subscribe(ui => this.cargando = ui.isLoading)

    this.forma = new FormGroup({
      'descripcion': new FormControl('', Validators.required),
      'monto': new FormControl(0, Validators.min(0))
    })
  }

  ngOnDestroy() {
    this.loadingSubs.unsubscribe()
  }

  crearIngresoEgreso() {
    this.store.dispatch(new ActivarLoadingAction())
    console.log(this.forma.value)
    console.log(this.tipo)
    const ingresoEgreso = new IngresoEgreso({ ...this.forma.value, tipo: this.tipo })
    this.ingresoEgresoService.crearIngresoEgreso(ingresoEgreso)
      .then(() => {
        Swal('Creado', ingresoEgreso.descripcion, 'success')
        this.forma.reset({ monto: 0 })
      })
      .catch(error => {
        Swal('Error', error.message, 'error')
      })
  }

}
