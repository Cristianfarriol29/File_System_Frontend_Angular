import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { RegisterServiceService } from 'src/app/auth/auth-service/registerservice.service';
import * as FormData from 'form-data';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['../../auth.styles.scss']
})
export class RegisterPageComponent implements OnInit {

  confirmedEmail: string = ""
  verified: any;
  unverified: any;
  verifying: any;
  formData = new FormData()
  userExists!: boolean
  isAuth: boolean = false;
  verifyTokenSubscription!: Subscription
  imageToSend: any

  constructor(private registerService: RegisterServiceService, public router: Router ) { }

  ngOnInit(): void {
  }



  uploadImage(event: any){
this.imageToSend = event.target.files[0]

  }

  captureEmail (event: any) {

    this.verified = false;
    this.unverified = false;


    if (event.target.value.length > 5){
      this.verifying = true;

      var sendMailToCompare = new XMLHttpRequest();
      sendMailToCompare.open(
            "POST",
            "https://prod-220.westeurope.logic.azure.com:443/workflows/5903bc00eb884698b77d3fff79895ba1/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=X0oVVRcNuRqeiAz2X9Oa09lzXvPY1eb4O2ofFotHauA",
            true
          );

          sendMailToCompare.send(
            JSON.stringify({
              mailContacto: event.target.value
            })
          )

      setTimeout(() => {
        this.registerService.verifyEmail().subscribe(data => {
          data.find((elem: any) => {
                if (event.target.value === elem.mailContacto) {

                  this.verified = true
                  this.unverified = false;
                   this.confirmedEmail = elem.mailContacto
                   this.verifying = false;

                   return this.confirmedEmail
                } else {
                  this.verified = false;
                  this.unverified = true;
                  this.verifying = false;
                  return
                }

          })

        })

      }, 4000);
    } else {

    }

      }

  sendRegisterForm(formulario: NgForm) {

const regexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,12}$/;


if ([formulario.value.name, formulario.value.surname].includes("")){
  return Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'You have to put the name and surname!',
  });
}

if (formulario.value.password !== formulario.value.passwordRepeated) {
    return Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: "Passwords don't match!" ,
    });
}

if (formulario.value.password.length < 8 && formulario.value.passwordRepeated.length < 8) {
  return Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'Password is too short!',
  });
}

if(!regexp.test(formulario.value.password)){
  return Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'The password does not meet the minimum security requirements! Remember that it must have 8 to 12 characters and that it must include at least: One uppercase character, one lowercase character and one number',
  });

}



    const parametro = document.location.href.slice(0 , -8)

    // this.formData.append('name', formulario.value.name )
    // this.formData.append('surname', formulario.value.surname )
    // this.formData.append('email', this.confirmedEmail )
    // this.formData.append('password', formulario.value.password )
    // this.formData.append('parametro', parametro )

    const userObject = {
      name: formulario.value.name,
      surname: formulario.value.surname,
      email: this.confirmedEmail,
      password: formulario.value.password,
      parametro
    }


    if(!this.confirmedEmail){
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'The email you have entered does not have permission to register'
      })

    }

   this.registerService.registerPost(userObject).subscribe((data:any):any =>
    {
      if(data.msg){
        return Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `${data.msg}`,
        });
      }


      var sendMailToConfirm = new XMLHttpRequest();
      sendMailToConfirm.open(
            "POST",
            "https://prod-86.westeurope.logic.azure.com:443/workflows/76c6387669924aaaad9b3d1a29888bc8/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=im8k2g0WN7x2mXqAB-zEO5QNk188CtXm2vZWrd68oOM",
            true
          );

          sendMailToConfirm.send(
            JSON.stringify({
              name: data.name,
              surname: data.surname,
              email: data.email,
              token: data.token,
              parametro
            })
          )


            Swal.fire('Completado!'
            , 'Your registration form has been completed successfully. We will send you an email shortly to finish confirming your registration.'
            , 'success'
            ).then(result => {
              if (result.isConfirmed) {
                formulario.reset()
                this.router.navigate(['login'])
              }
            })


    })





   if (!this.confirmedEmail){

   }

   return true;

}

}
