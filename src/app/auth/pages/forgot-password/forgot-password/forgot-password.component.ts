
import  Swal  from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { RegisterServiceService } from 'src/app/auth/auth-service/registerservice.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../../../auth.styles.scss']
})
export class ForgotPasswordComponent implements OnInit {

  userExists!: boolean;

  constructor(private recoveryService: RegisterServiceService) { }

  ngOnInit(): void {
  }

  sendEmailToRecoverPass(formValues: NgForm){
    const parametro = document.location.href.slice(0 , -15)

    const userEmail = {
      email: formValues.value.user,
      parametro
    }

    this.recoveryService.sendEmailToRecoveryPass(userEmail).subscribe((data:any) => {

      Swal.fire('Completado!'
      , `We have sent you an email to generate a new password!`
      , 'success'
      ).then((result: any) => {
       if (result.isConfirmed){
         formValues.reset()
       }
      })

      var sendMailToConfirm = new XMLHttpRequest();
      sendMailToConfirm.open(
            "POST",
            "https://prod-253.westeurope.logic.azure.com:443/workflows/ed7bdab0e0d74e2ab69a9594819290aa/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=zmwZO_G3bVk8QK-s-NxjFdJxI0Ik89VqNUrr0YWenzE",
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


    }, error =>  {

      return Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error.error.msg,
    })

  }


    )


  }

}
