import { NgForm } from '@angular/forms';

import { Component, OnInit, AfterViewInit } from '@angular/core';
import Swal from 'sweetalert2';
import { RegisterServiceService } from 'src/app/auth/auth-service/registerservice.service';
import { Router } from '@angular/router';
import { Section } from 'src/app/file-list/file-list.component';


@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['../../../auth.styles.scss']
})
export class AdminPageComponent implements OnInit, AfterViewInit {
user!: Section

  constructor(private petitionService: RegisterServiceService, private router:Router) {


   }

  ngOnInit(): void {


  }

  ngAfterViewInit(): void {

  }

  assignPermit(form: NgForm) {
    const user = {
      mailContacto: form.value.user
    }
      this.petitionService.assignPermit(user).subscribe((data: any) => {
        Swal.fire('Completado!'
   , `Permit has been assigned to ${data.mailContacto}!`
   , 'success'
   ).then(result => {
    if (result.isConfirmed){
      form.reset()
    }
   })
      })
  }


}
