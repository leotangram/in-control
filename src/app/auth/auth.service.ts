import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

import * as firebase from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';

// RXJS
import { map } from 'rxjs/operators'
import { Store } from '@ngrx/store';
import { ActivarLoadingAction, DesactivarLoadingAction } from '../shared/ui.actions';

// Swal
import Swal from 'sweetalert2';

import { User } from './user.model';
import { AppState } from '../app.reducer';
import { SetUserAction, UnsetUserAction } from './auth.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubscription: Subscription = new Subscription()
  private usuario: User

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private afDB: AngularFirestore,
    private store: Store<AppState>
  ) { }

  initAuthListener() {
    this.afAuth.authState
      .subscribe((fbUser: firebase.User) => {
        if (fbUser) {
          this.userSubscription = this.afDB.doc(`${fbUser.uid}/usuario`).valueChanges()
            .subscribe((usuarioObj: any) => {
              const newUser = new User(usuarioObj)
              this.store.dispatch(new SetUserAction(newUser))
              this.usuario = newUser
            })
        } else {
          this.usuario = null
          this.userSubscription.unsubscribe()
        }
      })
  }

  crearUsuario(nombre: string, email: string, password: string) {
    this.store.dispatch(new ActivarLoadingAction())
    this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(resp => {
        // console.log(resp)
        const user: User = {
          uid: resp.user.uid,
          email: resp.user.email,
          nombre: nombre
        }
        this.afDB.doc(`${user.uid}/usuario`)
          .set(user)
          .then(() => {
            this.router.navigate(['/'])
            this.store.dispatch(new DesactivarLoadingAction())
          })
      })
      .catch(error => {
        console.error(error)
        this.store.dispatch(new DesactivarLoadingAction())
        Swal('Error en el login', error.message, 'error')
      })
  }

  login(email: string, password: string) {
    this.store.dispatch(new ActivarLoadingAction())
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(resp => {
        // console.log(resp)
        this.router.navigate(['/'])
        this.store.dispatch(new DesactivarLoadingAction())
      })
      .catch(error => {
        console.error(error)
        this.store.dispatch(new DesactivarLoadingAction())
        Swal('Error en el login', error.message, 'error')
      })
  }

  logout() {
    this.router.navigate(['/login'])
    this.afAuth.auth.signOut()
    this.store.dispatch(new UnsetUserAction())
  }

  isAuth() {
    return this.afAuth.authState
      .pipe(
        map(fbUser => {
          if (fbUser === null) {
            this.router.navigate(['/login'])
          }
          return fbUser != null
        })
      )
  }

  getUsuario() {
    // console.log({...this.usuario})
    return { ...this.usuario }
  }

}
