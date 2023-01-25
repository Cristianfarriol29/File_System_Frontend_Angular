import { Observable, Subscription, distinctUntilChanged } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { RegisterServiceService } from './auth/auth-service/registerservice.service';
import { User } from './auth/interfaces/user-interface';
import { iconRegistry } from './iconRegistry.Utils';

const getValue = () => {
  return new Promise((resolve, reject) => {
    try {
      const value = localStorage.removeItem('tokenMontenegro');
      resolve(value);
    } catch (error) {
      reject(error);
    }
  });
};


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'plataforma-montenegro';
  public token?:string;
  public user!: User
  public subscription!: Subscription;
  constructor(
    private IconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private auth: RegisterServiceService
  ) {
    iconRegistry(IconRegistry, sanitizer);

  }


  ngOnInit(): void {

  this.subscription = this.auth.verifyToken(localStorage.getItem("tokenMontenegro")!).subscribe((v: any) =>{
    this.user = v
    this.auth.loginObservable.emit(v)
  }, error => console.log(error))

this.auth.loginObservable.subscribe(v => this.user = v)

  }


}
