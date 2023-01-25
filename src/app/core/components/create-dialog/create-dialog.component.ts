import Swal from 'sweetalert2';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FilesService } from '../../services/files.service';
import { userCreatorDB } from 'userCreator';
import { transformPathToSendByHttp } from 'src/app/helpers/transformPathToSendByHttp';

@Component({
  selector: 'app-create-dialog',
  templateUrl: './create-dialog.component.html',
  styleUrls: ['./create-dialog.component.scss']
})
export class CreateDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fileService: FilesService
  ) {}

  ngOnInit(): void {}

onSubmit(){

  let pathAlreadyExists = false;
  let usersWithPermission: string | any[] = []

  this.data.activeFolders.forEach((f:any) => {

    if(!this.data.principal)
    if(f.fullPath === `${this.pathProcess()}/${this.data.file}`){
      pathAlreadyExists = true;
    }
  })

  this.data._activeFolders.forEach((f:any) => {
    if(this.data.principal)
    if(f.fullPath === this.data.file){
      pathAlreadyExists = true;
    }
  })




  if (this.data.file === undefined) {
   return Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: "You can't assign an empty name"
    })
  }

if(pathAlreadyExists){
  return Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: "The file already exists, please insert another filename"
  })
}





  const objectToSend = {
    path: this.pathProcess(),
    file: this.data.file.split(" ").filter((v:any) => v !== "").toString().replace(",", ""),
    userCreator: this.data.userData,
    usersWithPermission: this.data.pathToProcess[0] !== ""  ? processUsersWithPermission(this.data._activeFolders, this.data.pathToProcess[0]) : this.data.userData,
    "isFile": false
  }

  function processUsersWithPermission(filesArray: any, path: string){
    let array:any = []
   filesArray = filesArray.find((v:any) => {
     if( v.file === path){
      array = v.usersWithPermission
     }

    } )
return array
  }


  this.fileService.makeDirectory(objectToSend)
this.fileService.createPathEmitter.subscribe((f:any) => {

this.data.activeFolders = this.data.activeFolders.push(f)
if (f.path === ""){
  this.data._activeFolders = this.data._activeFolders.push(f)
}
})


return
}

pathProcess(){
if (!this.data.topNavigationIsEmpty){
return ""
} else {
  return transformPathToSendByHttp(this.data.pathToProcess)
}

}


}
