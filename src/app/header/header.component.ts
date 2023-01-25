import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterServiceService } from '../auth/auth-service/registerservice.service';
import { User } from '../auth/interfaces/user-interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  user!: User
  constructor(private registerService: RegisterServiceService, private router: Router) {}

  ngOnInit() {
this.user = this.registerService.user

  }


  logout(){
    localStorage.removeItem('tokenMontenegro')
    localStorage.removeItem('emailMontenegro')
    this.registerService.loginObservable.emit({token: null})

  this.registerService.logOut(this.user.token)



  }
}
