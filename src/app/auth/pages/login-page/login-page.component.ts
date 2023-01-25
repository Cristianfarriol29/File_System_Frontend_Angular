
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { RegisterServiceService } from 'src/app/auth/auth-service/registerservice.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['../../auth.styles.scss']
})
export class LoginPageComponent implements OnInit {

  email: any = ""

  constructor(private loginService: RegisterServiceService, private router: Router) {
  }

  ngOnInit(): void {
    if(this.loginService.user){
      this.router.navigate([''])
    }
  }

  handleLoginForm(loginForm: NgForm) {


    if(loginForm.value.user === "" || loginForm.value.pass === ""){
       Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `¡¡You can't leave empty fields!!`,
      });
      return
    }

    const userData = {
      email: loginForm.value.user,
      password: loginForm.value.pass
    }
    if (Object.values(userData).length) {
      this.loginService.loginPost(userData).subscribe((data):any => {
        if (data.msg){
          return Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `${data.msg}`,
          });

        }

        this.loginService.loginObservable.emit(data)
        localStorage.setItem('tokenMontenegro', data.token);
        localStorage.setItem("emailMontenegro", data.email);

        if(data.confirmed){

          if(localStorage.getItem("linkMontenegro")?.length){
                const enlace = document.createElement("a")
                enlace.href = localStorage.getItem("linkMontenegro")!.toString()
                enlace.click()
          return
          }
          this.router.navigate([''])
          return
        }

        // if (data.email){
        //   this.email = data.email;
        //   localStorage.setItem("emailMontenegro", this.email);
        //   localStorage.setItem("tokenMontenegro", data.token)
        //   if(localStorage.getItem("linkMontenegro")?.length){
        //     const enlace = document.createElement("a")
        //     enlace.href = localStorage.getItem("linkMontenegro")!.toString()
        //     enlace.click()
        //     return;
        //   } else {
        //     const enlace = document.createElement("a")
        //     enlace.href = "https://dlab.typsa.net/"
        //     enlace.click()
        //     return
        //   }

        // }



      });




    }




  }

}
