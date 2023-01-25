import { transformPathToSendByHttp } from 'src/app/helpers/transformPathToSendByHttp';
import Swal from 'sweetalert2';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FilesService } from '../../services/files.service';
import { userCreatorDB } from 'userCreator';
import { NgForm } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import * as async from 'async'
import { concat, finalize, last, take } from 'rxjs/operators';
import { concatMap } from 'rxjs/operators';
import { from } from 'rxjs';



@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {
  formPost:FormData = new FormData();
 route: string = ""
 isFile: boolean = false;
 userCreator: string = userCreatorDB.userSession
 usersWithPermission: any = []
  fileToSend: any;
 isTime!: boolean;
 allFiles!: any
 folder:any;

  constructor(
    public dialogRef: MatDialogRef<UploadFileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fileService: FilesService
  ) {}

  ngOnInit(): void {

  }

  handleTime(){
    this.fileService.timeEmitter.emit(false)
  }

save(form: NgForm){


form.value.fileToUpload = this.fileToSend

if(this.data.activeFolders.some((v:any) =>typeof this.fileToSend.name === "string" ? v.file === this.fileToSend.name : v.file === this.fileToSend[0].webkitRelativePath.split("/")[0])){
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'The file already exists!'
  })
  this.fileService.timeEmitter.emit(true)

  return

}


//SUBIR ARCHIVO INDIVIDUAL
if(form.value.fileToUpload instanceof File){
this.formPost.append('path', this.route)
this.formPost.append('archivo', form.value.fileToUpload)
this.formPost.append('userCreator', this.userCreator)
this.usersWithPermission.forEach((v: any) => this.formPost.append('usersWithPermission', v))

this.fileService.uploadFile(this.formPost);
this.fileService.fileEmitter.subscribe(f => {

this.data.activeFolders = this.data.activeFolders.push(f)
if (f.path === ""){
this.data._activeFolders = this.data._activeFolders.push(f)
}

this.fileService.timeEmitter.emit(true)
})

}

//SUBIR VARIOS ARCHIVOS
else if (form.value.fileToUpload instanceof FileList){
  let carpetas: string[] = []
  const formToSend: any[] = []
    for(let i = 0; i < this.fileToSend.length; i++) {

    let file = this.fileToSend[i];

    const rutaMadre = transformPathToSendByHttp(this.data.pathToProcess)
    const rutaParaAñadirleALaContenedora = file.webkitRelativePath.split("/").filter((v:any) => v !== file.name ).join("/")
    const rutaParaEnviarALaBase = rutaMadre.split("/").concat(rutaParaAñadirleALaContenedora.split("/")).join("/")
    if(!carpetas.includes(rutaParaEnviarALaBase)){
      carpetas.push(rutaParaAñadirleALaContenedora)
    }

      const formPost:FormData = new FormData();
      formPost.append('path', rutaParaEnviarALaBase)
      formPost.append('userCreator', this.userCreator)
      formPost.append('archivo', file)
      formToSend.push(formPost)
  }

  //INDIVIDUALIZO LAS CARPETAS
  carpetas = carpetas.filter((v: string, i: number, array: string[]) => array.indexOf(v) === i ).sort()



  //Me aseguro de que si alguna carpeta hija tiene archivos, que reconozca al padre por mas que el padre no tenga
  const paths = carpetas
  const objects = paths.reduce((result:any, path) => {
  const pathArray = path.split("/");
  for (let i = pathArray.length - 1; i > 0; i--) {
    const parentPath = pathArray.slice(0, i).join("/");
    const childPath = pathArray.slice(i, pathArray.length).join("/");
    result.push({ parentPath, childPath });
  }
  return result;
  }, []);

  function getUniquePaths(objects:any) {
  const parentPaths:any = [];
  objects.forEach((object:any) => {
    if (!parentPaths.includes(object.parentPath)) {
      parentPaths.push(object.parentPath);
    }
    const childObjects = objects.filter((obj:any) => obj.parentPath === object.childPath);
    if (childObjects.length > 0) {
      parentPaths.push(...getUniquePaths(childObjects));
    }
  });
  return parentPaths;
  }
  carpetas.push(...getUniquePaths(objects))
  carpetas = carpetas.filter((v: string, i: number, array: string[]) => array.indexOf(v) === i ).sort()
  const principalFolder = carpetas[0]


  //Genero los objetos de carpetas que voy a enviar a la base
  const parentPath = this.pathProcess()
  const pathChilds = carpetas

  const userCreator = this.data.userData;
  const usersWithPermission = this.data.pathToProcess[0] !== ""  ? this.processUsersWithPermission(this.data._activeFolders, this.data.pathToProcess[0]) : this.data.userData;
  const isFile = false;

  function createObjects(parent:any, childs:any) {
  return childs.reduce((acc:any, current:any) => {
    let currentPath = parent;
    let currentFile = "";
    if (current.includes("/")) {
      const parts = current.split("/");
      currentFile = parts.pop();
      currentPath = parts.reduce((p:any, c:any) => `${p}/${c}`, parent);
    } else {
      currentFile = current;
    }

    acc.push({path: currentPath, file: currentFile, userCreator,usersWithPermission, isFile });
    return acc;
  }, []);
    }
    let objectsToSend = createObjects(parentPath, pathChilds).filter((obj:any, index:any, self:any) => self.findIndex((t:any) => JSON.stringify(t) === JSON.stringify(obj)) === index)
    objectsToSend = objectsToSend.sort((a:any, b:any) => a.path.length - b.path.length);

    let folderToOpen = {}

    const postFolders$ = from(objectsToSend)
    .pipe(
        concatMap(object => this.fileService.makeAnotherDirectory(object))
    )

const asyncUpload$ = from(formToSend)
    .pipe(
        concatMap(form => this.fileService.uploadAnotherFile(form))
    )

postFolders$
  .pipe(
    concat(asyncUpload$),
    finalize(()=> {
       this.fileService.timeEmitter.emit(true)

          this.fileService.getFileByPath({path: this.data.pathToProcess.join("/"), userSession: this.data.userData, admin: this.data.admin })
          this.fileService.pathEmitter.subscribe(v => this.data.activeFolders = v)

    })
  ).subscribe();

  }




}

pathProcess(){
  if (!this.data.topNavigationIsEmpty){
  return ""
  } else {
    return transformPathToSendByHttp(this.data.pathToProcess)
  }

  }

processUsersWithPermission(filesArray: any, path: string){
  let array:any = []
 filesArray = filesArray.find((v:any) => {
   if( v.file === path){
    array = v.usersWithPermission
   }

  } )
return array
}


saveFile(e:any){
this.fileToSend = e.target.files[0]
this.route =  transformPathToSendByHttp(this.data.pathToProcess)
this.isFile = true
this.userCreator = this.data.userCreator
this.data._activeFolders.forEach((v:any) => {

if(v.fullPath === this.route.split("/")[0]){
this.usersWithPermission = v.usersWithPermission
}
})
}


saveAllFiles(files:any){
  this.fileToSend = files.target.files
}

}


