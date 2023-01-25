import { Component, OnInit } from '@angular/core';
import { RegisterServiceService } from 'src/app/auth/auth-service/registerservice.service';
import { User } from 'src/app/auth/interfaces/user-interface';
import {CardModule} from 'primeng/card';
import { FilesService } from 'src/app/core/services/files.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user!: User ;
  fullName!: string
  files!: any
  userGroup:any = []

  constructor(public registerService: RegisterServiceService, public fileService: FilesService, public router: Router) {
    this.fileService.getUsersInDB()
  }

  ngOnInit() {
this.user = this.registerService.user
this.fullName = `${this.registerService.user.name} ${this.registerService.user.surname}`

this.fileService.getFileByUserCreator({userCreator: this.registerService.user.email})
this.fileService.profileEmitter.subscribe(v => {
this.files = v
})



this.fileService.usersEmitter.subscribe(f => {
f.forEach((v:any) => {
  v.users.includes(this.registerService.user.email) && this.userGroup.push(v)

} )

})
  }


  navigateToVerify(path: string){

    const linkToNavigate = 'https://dlab.typsa.net/plataforma-montenegro/?path=' + path

    const enlace = document.createElement("a")
                enlace.href = linkToNavigate
                enlace.click()
  }
  logout(){
    localStorage.removeItem('tokenMontenegro')
    this.registerService.loginObservable.emit({token: null})

  this.registerService.logOut(this.user.token)

  }


}
