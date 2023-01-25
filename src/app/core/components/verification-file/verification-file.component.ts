import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RegisterServiceService } from 'src/app/auth/auth-service/registerservice.service';
import { FileListComponent } from 'src/app/file-list/file-list.component';
import { sendEmailToUserCreator } from 'src/app/file-list/helpers';
import { isValidEmail } from 'src/app/helpers/isValidEmail';
import Swal from 'sweetalert2';
import { FilesService } from '../../services/files.service';

@Component({
  selector: 'app-verification-file',
  templateUrl: './verification-file.component.html',
  styleUrls: ['./verification-file.component.scss']
})
export class VerificationFileComponent implements OnInit {
  public userVerifierIsAssigned: string = ""

  constructor(
    public dialogRef: MatDialogRef<VerificationFileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fileService: FilesService,
    public userDataService: RegisterServiceService
  ) {}

  ngOnInit(): void {

  }

  onSubmit() {

    if(!isValidEmail(this.data.emailVerifier)){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "Please insert a valid email"

      })
      return
    }

    if(this.data.emailVerifier === this.data.emailOfPetitioner){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "User creator cant verify his own file"

      })
      return
    }



    if(this.data.file.usersWithPermission === undefined || !this.data.file.usersWithPermission.includes(this.data.emailVerifier)){
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: "This user does not have permission, you must first grant them permission"
          })
          return
    }

    const linkToSend = "https://dlab.typsa.net/plataforma-montenegro/?path=" + this.data.file.path

    const objectToSend = {
      userVerifier: this.data.emailVerifier,
      linkToVerify: linkToSend
    }


    var xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      "https://prod-149.westeurope.logic.azure.com:443/workflows/8af58b744c67411191fd639afa2d3679/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=aRlO2HExU7pwZt3PEgxJUN5fnA8lt9eddkNcJs_gJoY",
      true
    );

    xhr.setRequestHeader("Content-Type", "application/json")

    xhr.send(JSON.stringify(objectToSend))



    Swal.fire({
      icon: 'success',
      title: '¡Success!',
      text: `An email has been sent to ${this.data.emailVerifier} to request verification of the file`
    }).then(v => {
      if(v.isConfirmed){
        this.userDataService.fileToVerify({email: this.data.emailVerifier, fullPath: this.data.file.path})
        this.fileService.assignUserToVerify({userToVerify: this.data.emailVerifier, fullPath: this.data.file.fullPath})

      }
      location.reload()
    } )
  }



}
