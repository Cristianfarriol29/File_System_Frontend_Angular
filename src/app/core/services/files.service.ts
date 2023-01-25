import { Observable } from 'rxjs';

import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { userCreatorDB } from 'userCreator';
import Swal from "sweetalert2"
import { Router } from '@angular/router';
import { Section } from 'src/app/file-list/file-list.component';
import { User } from 'src/app/auth/interfaces/user-interface';
@Injectable({
  providedIn: 'root'
})
export class FilesService {

 public filesEmitter = new EventEmitter();
 public pathEmitter = new EventEmitter();
 public createPathEmitter = new EventEmitter();
 public pathEmitterToDelete = new EventEmitter();
 public fileEmitter = new EventEmitter();
 public deleteFileEmitter = new EventEmitter();
 public verifyEmitter = new EventEmitter()
public fileToGetBySearch = new EventEmitter();
public usersEmitter = new EventEmitter();
public userGroupEmitter = new EventEmitter();
public usersInGroup = new EventEmitter();
public profileEmitter = new EventEmitter();
public timeEmitter = new EventEmitter()
public moveFileEmitter = new EventEmitter();
public tokenService = new EventEmitter()
public fileWithVerifier = new EventEmitter();

 files: any
 users: any


constructor(private http: HttpClient) {

}


public getFiles(user: any): any {

  return this.http.post('http://dlab.typsa.net/plataforma-montenegro/montenegro/file', {userSession: user.email, admin: user.admin}).subscribe((v:any) => {
    this.filesEmitter.emit(v)
    this.files = v;

   })
}

public getByFileName(userAndFilename: any) {
  return this.http.post('http://dlab.typsa.net/plataforma-montenegro/montenegro/file/filename', userAndFilename).subscribe((v:any) => {
    this.fileToGetBySearch.emit(v)
   })
}


getMail(): any {
  return this.http.get(`https://backend-dlab-mail-dkp5kqchu-cfarrioltypsa.vercel.app/api/mail`);
}

public getFileByPath(objeto:any) {

  return this.http.post('http://dlab.typsa.net/plataforma-montenegro/montenegro/file/get-file', objeto).subscribe(v => {

    this.pathEmitter.emit(v)
  });
}

public getFileByUserCreator(objeto:any) {
  return this.http.post('http://dlab.typsa.net/plataforma-montenegro/montenegro/file/get-file-by-user', objeto).subscribe(v => {
    this.profileEmitter.emit(v)
  });
}

public makeDirectory(objeto:any) {
  return this.http.post('http://dlab.typsa.net/plataforma-montenegro/montenegro/file/make-directory', objeto).subscribe(v => {

    this.createPathEmitter.emit(v)
  }, err => {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: err.error.msg
    }).then(result => {
      if (result.isConfirmed)
      location.reload()
    })
  });
}

public makeAnotherDirectory(objeto:any){
  return this.http.post('http://dlab.typsa.net/plataforma-montenegro/montenegro/file/make-directory', objeto)
}

public uploadFile(objeto: any){
  return this.http.post('http://dlab.typsa.net/plataforma-montenegro/montenegro/file/post-file', objeto, {headers: {'Accept': 'application/json'}} ).subscribe(v => {
    this.fileEmitter.emit(v)
  });
}

public uploadAnotherFile(objeto: any){
  return this.http.post('http://dlab.typsa.net/plataforma-montenegro/montenegro/file/post-file', objeto, {headers: {'Accept': 'application/json'}} )
}

public uploadFiles(objeto: any){
  return this.http.post('http://dlab.typsa.net/plataforma-montenegro/montenegro/file/upload-files', objeto, {headers: {'Accept': 'application/json'}} ).subscribe(v => {

  });
}

public moveFile(objeto: any){
  return this.http.post('http://dlab.typsa.net/plataforma-montenegro/montenegro/file/move-file', objeto, {headers: {'Accept': 'application/json'}} ).subscribe(v => {
    this.filesEmitter.emit(v)
  });
}

public getUsersInDB (){
return this.http.get('http://dlab.typsa.net/plataforma-montenegro/montenegro/users/get-users').subscribe(v => {
  this.usersEmitter.emit(v)
  this.users = v
})
}



public assignPermit(pathAndUserToAssignPermit:any){

  return this.http.post('http://dlab.typsa.net/plataforma-montenegro/montenegro/file/assign-permit', pathAndUserToAssignPermit).subscribe((v:any) => {

    this.verifyEmitter.emit(v)

    Swal.fire({
      icon: 'success',
      title: '¡Success!',
      text: 'Permissions have been successfully assigned'
    })


  }, err => {

    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: err.error.msg
    })

  }
  );

}

public postANewGroup(userData: any) {
  return this.http.post('http://dlab.typsa.net/plataforma-montenegro/montenegro/users/post-by-name/', userData ).subscribe(v => {
  this.userGroupEmitter.emit(v)
  this.users.push(v)
})
}

public postANewUserInSelectedGroup(userData: any) {
  return this.http.post('http://dlab.typsa.net/plataforma-montenegro/montenegro/users/post-by-username/', userData ).subscribe((v:any) => {
   this.usersInGroup.emit(v)
  })
}

public verifyFileOrFolder(fileWithuserVerifier:any){

  return this.http.post('http://dlab.typsa.net/plataforma-montenegro/montenegro/file/verify', fileWithuserVerifier).subscribe(v => {
    this.verifyEmitter.emit(v)
  });

}

public assignUserToVerify(userToVerify:any){
  return this.http.post<any>('http://dlab.typsa.net/plataforma-montenegro/montenegro/file/assign-to-verify', userToVerify).subscribe((v:Section) => {

this.fileWithVerifier.emit(v.userAssignedToVerify)

  });

}

public userHasRead(fullPathOfFile:any){
  return this.http.post<any>('http://dlab.typsa.net/plataforma-montenegro/montenegro/file/read-file', fullPathOfFile)
}

public deleteFilesByPath(pathToDelete:any) {
  return this.http.post('http://dlab.typsa.net/plataforma-montenegro/montenegro/file/delete-directory', pathToDelete).subscribe(v => {
    this.fileEmitter.emit(v)
  });
}

public deleteFiles(folder: any){

  return this.http.post('http://dlab.typsa.net/plataforma-montenegro/montenegro/file/delete-file', folder).subscribe(v => {
    console.log(v)
    this.deleteFileEmitter.emit(v)
  }
  );
}


}
