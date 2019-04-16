import { Component, OnInit, OnDestroy } from '@angular/core'
import { AuthService } from '../auth.service'
import { Store } from '@ngrx/store'
import { AppState } from '../../app.reducer'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  cargando: boolean
  suscription: Subscription = new Subscription()

  constructor(public authService: AuthService, public store: Store<AppState>) {}

  ngOnInit() {
    this.suscription = this.store
      .select('ui')
      .subscribe(ui => (this.cargando = ui.isLoading))
  }

  ngOnDestroy() {
    this.suscription.unsubscribe()
  }

  onSubmit(data: any) {
    this.authService.crearUsuario(data.nombre, data.email, data.password)
  }
}
