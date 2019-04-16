import { Component, OnInit, OnDestroy } from '@angular/core'
import { AuthService } from '../auth.service'
import { Store } from '@ngrx/store'
import { AppState } from '../../app.reducer'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  cargando: boolean
  suscription: Subscription

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
    this.authService.login(data.email, data.password)
  }
}
