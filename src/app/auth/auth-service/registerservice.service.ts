import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RegisterServiceService {

public user:any = {}
public localObservable = new EventEmitter();
public fileToVerifyEmitter = new EventEmitter();
public loginObservable = new EventEmitter();

  constructor(private http: HttpClient, private router: Router) {
this.loginObservable.subscribe(value => this.user = value )
this.localObservable.emit(localStorage.getItem('tokenMontenegro'))
  }


  registerPost(formValues: any): Observable<any> {
    return this.http.post("http://dlab.typsa.net/plataforma-montenegro/montenegro-authentication-back/api/users/register", formValues)

  }
  loginPost(loginValues: any): Observable<any> {
    return this.http.post("http://dlab.typsa.net/plataforma-montenegro/montenegro-authentication-back/api/users/login", loginValues)
  }

  logOut(token: string){

    return this.http.get(`http://dlab.typsa.net/plataforma-montenegro/montenegro-authentication-back/api/users/logout/` + token ).subscribe((v:any) => {
      localStorage.removeItem('tokenMontenegro')

      this.router.navigate(['/auth/login'])
    })
  }
  verifyEmail(): Observable<any> {
    return this.http.get(`https://dlab.typsa.net/users/api/mail`);
  }
  userConfirm(token: string){
    return this.http.get(`http://dlab.typsa.net/plataforma-montenegro/montenegro-authentication-back/api/users/confirmar-usuario/${token}`);
  }
  assignPermit(user: any){
    return this.http.post(`https://dlab.typsa.net/users/api/mail`, user);
  }
  sendEmailToRecoveryPass(email: any){
    return this.http.post("http://dlab.typsa.net/plataforma-montenegro/montenegro-authentication-back/api/users/olvide-password", email)
  }
  sendPassToUpdate(pass:any, token:string){
    return this.http.post(`http://dlab.typsa.net/plataforma-montenegro/montenegro-authentication-back/api/users/nuevo-password/${token}`, pass)
  }
  verifyToken(token: string){
    return this.http.get(`http://dlab.typsa.net/plataforma-montenegro/montenegro-authentication-back/api/users/olvide-password/${token}`)
  }
 verifyAdminByEmail(email: string){
    return this.http.get(`http://dlab.typsa.net/plataforma-montenegro/montenegro-authentication-back/api/users/verify-admin/${email}`)

 }


public fileToVerify(object: any) {
  return this.http.post('http://dlab.typsa.net/plataforma-montenegro/montenegro-authentication-back/api/users/file-to-verify', object).subscribe(v => {
    this.fileToVerifyEmitter.emit(v)
  }
  );
}


public changeFileStatus(object: any) {
  return this.http.post('http://dlab.typsa.net/plataforma-montenegro/montenegro-authentication-back/api/users/change-file-status', object).subscribe(v => {
this.user = v
    this.fileToVerifyEmitter.emit(v)
  }
  );
}


}
