import Swal from 'sweetalert2';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { userCreatorDB } from 'userCreator';
import { FilesService } from '../../services/files.service';
import { isValidEmail } from 'src/app/helpers/isValidEmail';

@Component({
  selector: 'app-permission-dialog',
  templateUrl: './permission-dialog.component.html',
  styleUrls: ['./permission-dialog.component.css']
})
export class PermissionDialogComponent implements OnInit {

  confirmedEmail: string = ""
  verified: any;
  mailVerified!: boolean;
  mailUnverified!: boolean
  warning: boolean = false;
  msg:string = ""
  groups :any =[]
  selectedOption: boolean = false
  groupToSend: any = []
  groupName: string = ""
  constructor(
    public dialogRef: MatDialogRef<PermissionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fileService: FilesService
  ) {}

  ngOnInit() {
    this.fileService.getUsersInDB()
    this.fileService.usersEmitter.subscribe(v => this.groups = v)
  }

captureEmail(event: any){

}
  // captureEmail (event: any) {



  //   if (event.target.value.length > 5){

  //     var sendMailToCompare = new XMLHttpRequest();
  //     sendMailToCompare.open(
  //           "POST",
  //           "https://prod-220.westeurope.logic.azure.com:443/workflows/5903bc00eb884698b77d3fff79895ba1/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=X0oVVRcNuRqeiAz2X9Oa09lzXvPY1eb4O2ofFotHauA",
  //           true
  //         );

  //         sendMailToCompare.send(
  //           JSON.stringify({
  //             mailContacto: event.target.value
  //           })
  //         )

  //     setTimeout(() => {
  //       this.fileService.getMail().subscribe((data:any) => {
  //       if(data.includes(event.target.value))
  //     this.warning = false;
  //       this.msg = "Tiene permiso"
  //       })

  //     }, 4000);
  //   } else {
  //     this.warning = true
  //   }

  //     }


  valueChange(event: any){
if(event.value === "1"){
  this.selectedOption = false
}else if(event.value == "2"){
  this.selectedOption = true
}
  }

  insertGroupUsers(group: any){
    this.groupToSend = group.users
    this.groupName = group.groupName
  }


onSubmit(){

  if(!isValidEmail(this.data.name) && this.data.name !== undefined){
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: "Please insert a valid email"

    })
    return
  }



  const toSend = {
    userCreator: this.data.userCreator,
    userWithPermit: this.data.name !== undefined ? this.data.name : this.groupToSend,
    fullPath: this.data.folder.path !== "" ? `${this.data.folder.path}/${this.data.folder.file}` : this.data.folder.file,
    file: this.data.folder.file,
    path: this.data.folder.path,
    isFile: this.data.folder.isFile

  }


  this.fileService.assignPermit(toSend)
  this.fileService.verifyEmitter.subscribe(f => {

   this.data.activeFolders = this.data.activeFolders.filter((v:any) => {

    f.forEach((fileFromDB:any) => {
       if(v._id === fileFromDB._id){
    v.usersWithPermission = fileFromDB.usersWithPermission
    }
    })
   })

   this.data._activeFolders = this.data._activeFolders.filter((v:any) => {

    f.forEach((fileFromDB:any) => {
      if(v._id === fileFromDB._id){
   v.usersWithPermission = fileFromDB.usersWithPermission
   }
   })
   })

   this.fileService.fileEmitter.emit(this.data.activeFolders)

  })

}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
