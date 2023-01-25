import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RegisterServiceService } from 'src/app/auth/auth-service/registerservice.service';
import Swal from 'sweetalert2';
import { FilesService } from '../../services/files.service';
import { PermissionDialogComponent } from '../permission-dialog/permission-dialog.component';

@Component({
  selector: 'app-move-file',
  templateUrl: './move-file.component.html',
  styleUrls: ['./move-file.component.css']
})
export class MoveFileComponent implements OnInit {
public foldersOnly: any = []
public filesInFolders: any = []
public newPath!: string
  constructor(   public dialogRef: MatDialogRef<PermissionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fileService: FilesService, private registerService: RegisterServiceService) { }

  ngOnInit() {
    this.fileService.getFiles({email: this.registerService.user.email, admin: this.registerService.user.admin})
  this.fileService.filesEmitter.subscribe(v => {
     this.foldersOnly = v.filter((v:any) => !v.isFile && v)
      this.filesInFolders =  v.filter((v:any) => v.isFile && v)
    })
  }


  save(myForm: any ){
 }

  moveFile(fullPath: string){
    this.newPath = fullPath
  }

  send(){

if(this.data.folder.path === "" ){
  this.fileService.moveFile({oldPath: this.data.folder.path, newPath: this.newPath, fileToMove: this.data.folder.file, isFile: false, isEmpty: true})
}else{
  if(!this.data.folder.isFile)
  this.foldersOnly.forEach((v:any) => v.fullPath === this.data.folder.fullPath && this.fileService.moveFile({oldPath: v.path, newPath: this.newPath, fileToMove: v.file, isFile: v.isFile, isEmpty: false}) )
  else
  this.filesInFolders.forEach((v:any) => v.fullPath === this.data.folder.fullPath && this.fileService.moveFile({oldPath: v.path, newPath: this.newPath, fileToMove: v.file, isFile: v.isFile, isEmpty: false}) )
}
  }

  principalFolder():any{
    let exists = false;

    this.foldersOnly.forEach((v:any) => {

      if(v.fullPath === this.data.folder.fullPath.split("/")[this.data.folder.fullPath.split("/").length - 1]){
        exists = true
      }
    })

    if(exists){
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "The folder already exists, please insert another filename"
      })
    }

    this.foldersOnly.forEach((v:any) => v.fullPath === this.data.folder.fullPath && this.fileService.moveFile({oldPath: v.path, newPath: "", fileToMove: v.file, isFile: v.isFile, isEmpty:false}) )
  }

}
