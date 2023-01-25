
import { MatSelectionList } from '@angular/material/list';
import { PermissionDialogComponent } from './../core/components/permission-dialog/permission-dialog.component';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FilesService } from '../core/services/files.service';
import { transformLengthToTheTopNavigation } from '../helpers/transformLengthToTheTopNavigation';
import { transformPathToSendByHttp } from '../helpers/transformPathToSendByHttp';
import { getTheLastPosition } from '../helpers/getTheLastPosition';
import { userCreatorDB } from 'userCreator';
import Swal from 'sweetalert2'
import { CreateDialogComponent } from '../core/components/create-dialog/create-dialog.component';
import { UploadFileComponent } from '../core/components/upload-file/upload-file.component';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { VerificationFileComponent } from '../core/components/verification-file/verification-file.component';
import {processPathToNavigate} from "../helpers/processPathToNavigate"
import { UserGroupsComponent } from '../core/components/user-groups/user-groups.component';
import { RegisterServiceService } from '../auth/auth-service/registerservice.service';
import { User } from '../auth/interfaces/user-interface';
import { MoveFileComponent } from '../core/components/move-file/move-file.component';
import { processNavigationPathWithValidation, sendEmailToUserCreator} from './helpers';
import { from } from 'rxjs';

// import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';



export interface Section {
  createdAt: string;
  file: string;
  fullPath: string;
  isFile: boolean;
  isVerified: boolean;
  path: string;
  status: {
    Unassigned: boolean;
    Send: boolean;
    Read: boolean;
    PendingToVerify: boolean;
    Verified: boolean;
  };
  updatedAt: string;
  userAssignedToVerify: string;
  userCreator: string;
  usersWithPermission: string[];
  verifiedBy: string;
  __v: number;
  _id: string;
  comments: string;
  admin: boolean

}


@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss'],
})



export class FileListComponent implements OnInit, AfterViewInit{

  lastPositionOfThePaths!: number;
  userData: any = this.register.user.email;
  user: User = this.register.user;
  token: string = localStorage.getItem('tokenMontenegro')!.toString();
  name!: string;
  folders: Section[] = [];
  currentFolder = '';
  topNavigation: any;
  activeFolders: Section[] = [];
  _activeFolders: Section[] = [];
  selectedOption: any
  pathActive: any;
  pathToNavigate:any
  userGroups: any = []
  isTime: boolean = true
  InVerification: boolean = false;
  validation: boolean = false;
  referencia: string[] = []
  userCreatorToSendEmail: string = ""
  statusToSendEmail!: any;
  foldersToCheck: any = []


  // @ViewChild('childFolder') childFolder!: MatSelectionList

  constructor(public dialog: MatDialog, private fileService: FilesService, private _route: ActivatedRoute, private _router: Router, public register: RegisterServiceService) { }

  ngAfterViewInit(): void {
    for (let i = 1; i <= this.foldersToCheck.length; i++){

      if(this.foldersToCheck[i].isFile === true &&
         this.userData === this.foldersToCheck[i].userAssignedToVerify && this.foldersToCheck[i].status.Send === true) {
        this.validation = true
        this.userCreatorToSendEmail = this.foldersToCheck[i].userCreator
        this.statusToSendEmail = this.foldersToCheck[i].status
      }

      if(this.validation === true && this.foldersToCheck[i].status.Read === false && this.foldersToCheck[i].path === this.pathActive && this.userData === this.foldersToCheck[i].userAssignedToVerify ){

        sendEmailToUserCreator({archivo: location.href, emailVerifier: this.userData , emailCreator: this.foldersToCheck[i].userCreator, action: "read"} )
        this.fileService.userHasRead({path: this.pathActive, userAssignedToVerify: this.userData, file: this.foldersToCheck[i].file } ).subscribe()
        this.validation = false
        break
      }

    }
  }

  ngOnInit(): void {
    this.fileService.getUsersInDB()



   this.userData = this.register.user.email
   this.fileService.getFiles({email: this.register.user.email, admin: this.register.user.admin})

// localStorage.setItem("emailMontenegro", v.email)
    this._route.queryParams.subscribe((params: Params) => {

      // this.currentFolder = params['path'];
      if(params['path']){
        // this.pathToNavigate = params['path'].split("/").filter((v:any) =>{
        //   return v !== 'validation' && v
        // }).join("/")

        this.pathToNavigate = params['path']

      this.pathActive = params['path'].split("/").filter((v:any) =>{
        if(v === 'validation'){
          this.validation = true
        }

        return v !== 'validation' && v
      }).join("/").replaceAll('%2F', '/');

    } else {
      this.pathActive = ''
      this.pathToNavigate =  ''
    }

    });



    this.fileService.filesEmitter.subscribe(value => {

      this.folders = value
      this.foldersToCheck = value
this.folders.forEach(v => !v.isFile && console.log(v))

      this.activeFolders = this.folders.filter((obj) => {

        return obj.path === this.pathActive;
      });


      this._activeFolders = this.folders.filter((obj) => {
        return obj.path === '';
      });

      this._activeFolders.forEach(v => v.status.PendingToVerify)



      if(this.pathToNavigate!='') {
      this.topNavigation = processPathToNavigate(this.pathToNavigate.split('/'))
      }else {
        this.topNavigation = []
      }

      if(this.pathToNavigate.substring(0,1) === "/"){
        this.pathToNavigate = this.pathToNavigate.substring(1, this.pathToNavigate.length)
      }

      value.forEach((v:any) => {

        if (v.fullPath === this.pathToNavigate){

              // this.goToOptionInThePrincipalPanel(v)
              if (v.path === ""){
                this.goToOptionInThePrincipalPanel(v)
              }else {

                this.goToOption(v)
              }
        }
      })





    })

    this.fileService.usersEmitter.subscribe(v => this.userGroups = v)
    this.fileService.timeEmitter.subscribe(v => this.isTime = v)



  }

  openUserGroupsDialog(){
    const dialogRef = this.dialog.open(UserGroupsComponent, {
      width: '500px',
      height: '600px',
      data: {
        userGroups : this.userGroups,
        groupName: "",
        user: ""
      },
    })
  }

  showComments(folder: any){

    function formatDate(fecha: any) {
      const date = new Date(fecha);
      const options:any = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZone: 'UTC'
      };




      return new Intl.DateTimeFormat('es-ES', options).format(date);
    }

    return Swal.fire({
      title: '<strong>Comments</strong>',
      icon: 'info',
      html:
      folder.comments ?
        `
        Date: ${formatDate(folder.createdAt)}
        <br>
        <br>
        <strong style="color: green">The Verifying User: <b  style="color: black" >${folder.verifiedBy}</b></strong>
        <br>
        <br>
        <strong  style="color: black"><i>has left the following comment:</i></strong>
        <br>
        <br>
        <b>"${folder.comments}"</b>


        `
        :
        `No comments..`
        ,
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText:
        '<i class="fa fa-thumbs-up"></i> OK',
      confirmButtonAriaLabel: 'Thumbs up, great!',
      cancelButtonText:
        '<i class="fa fa-thumbs-down">Cancel</i>',
      cancelButtonAriaLabel: 'Thumbs down'
    })
  }

  //IMPLEMENTACION DE METODO PARA BUSQUEDA

  verifyFolderOrFile(folder: Section) {
    folder = {
      ...folder,
      verifiedBy: folder.userAssignedToVerify,
      isVerified: true
    }



    Swal.fire({
      title: 'Are you sure?',
      text: "Want to verify this file?",
      input: 'textarea',
      inputAttributes: {
        placeholder: 'insert your comments (optional)'
      },
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, I want to verify this file',

      preConfirm: (inputValue) => folder.comments = inputValue
    }).then((result) => {
//TODO - Permitir cargar comentarios aunque no lo verifique
      if (result.isConfirmed) {

        this.fileService.verifyFileOrFolder(folder)
       this.fileService.verifyEmitter.subscribe((v) => {

        this.activeFolders = this.activeFolders.map(f => f._id === v._id ? v : f)


              // if(v.fullPath === folder.fullPath){
              //   document.getElementById(`${folder.fullPath}`)?.classList.remove('none')
              //   document.getElementById(`${folder.fullPath}`)?.classList.add('display')
              // } if (v._id === folder._id){
              //   document.getElementById(`${folder._id}`)?.classList.remove('display')
              //   document.getElementById(`${folder._id}`)?.classList.add('none')
              // }
              this.register.changeFileStatus({email: v.userAssignedToVerify, fullPath: v.path})


            })
            sendEmailToUserCreator({archivo: location.href, emailVerifier: folder.userAssignedToVerify, emailCreator: folder.userCreator,  action: "verify", file: folder.file, comments: folder.comments} )
      }
    })



  }


  sendEmailToVerify(file:any){
    const dialogRef = this.dialog.open(VerificationFileComponent, {
      width: '450px',
      height: '400px',
      data: {
        emailVerifier: "",
        emailOfPetitioner: this.userData,
        file,

      },
    })
  }


  makeDirectory(principal = false) {

    const dialogRef = this.dialog.open(CreateDialogComponent, {
      width: '250px',
      data: {
        pathToProcess: !principal ? [...this.topNavigation] : [""],
        topNavigationIsEmpty: this.topNavigation.length,
        activeFolders: this.activeFolders,
        _activeFolders: this._activeFolders,
        userData: this.userData
      },
    })


  }

  moveFile(folder: any){

    const dialogRef = this.dialog.open(MoveFileComponent, {
      width: '450px',
      data: {
        activeFolders: this.activeFolders,
        _activeFolders: this._activeFolders,
        folder: folder
      },
    })
  }

  uploadFile() {


    const dialogRef = this.dialog.open(UploadFileComponent, {
      width: '40%',
      data: {
        pathToProcess: [...this.topNavigation],
        topNavigationIsEmpty: this.topNavigation.length,
        activeFolders: this.activeFolders,
        _activeFolders: this._activeFolders,
        userCreator: this.userData,
        userData: this.register.user.email,
        admin: this.register.user.admin,
        referencia: this.referencia
      },
    })

  }

  goToOption(folder: any) {

    const userStorage = this.userData;


    if(folder.isFile){

      if (this.userData === folder.userAssignedToVerify) {
       sendEmailToUserCreator({archivo: location.href, emailVerifier: this.userData , emailCreator: folder.userCreator,action: "download", file: folder.file, fullPath: folder.fullPath} )
      }else{
        window.location.href = "https://dlab.typsa.net/montenegro-back/server/" + folder.fullPath;
      }


    }

    else {

      this.activeFolders = []
      this.fileService.getFileByPath({ path: folder.path !== "" ? `${folder.path}/${folder.file}` : folder.file, userSession: userStorage, admin: this.register.user.admin })
      this.fileService.pathEmitter.subscribe(value => {
        this.activeFolders = value;

      })


      this.currentFolder = folder.path;
      ;
      // this.activeFolders = this.folders.filter((obj) => {
      //   return obj.path = folder.path + '/' + folder.file;
      // });
      this.topNavigation.push(folder.file);
      this.lastPositionOfThePaths = getTheLastPosition(this.topNavigation)

      this._router.navigate([''], {
        queryParams: { path: folder.path + '/' + folder.file },
      });

    }



  }


  processPath(path:string){

   return path.split("/")[0]
  }

  goToOptionInThePrincipalPanel(folder: any) {

this.referencia = this._activeFolders.map(v => {
  return v._id
})



this.referencia.forEach((v:any) => {
  if(folder._id === v){

    const optionSelected:any = document.getElementById(v)
  optionSelected.style.background ="#0078d4";
  optionSelected.style.color ="#dddd";

  }else{

    const optionSelected:any = document.getElementById(v)
    optionSelected.style.background ="";
    optionSelected.style.color ="";
  }


})



    this.activeFolders = []
    this.topNavigation = []
    this.fileService.getFileByPath({ path: folder.path !== "" ? `${folder.path}/${folder.file}` : folder.file, userSession: this.userData, admin: this.register.user.admin })
    this.fileService.pathEmitter.subscribe(value => {
      this.activeFolders = value;
    })
    this.currentFolder = folder.path;
    // this.activeFolders = this.folders.filter((obj) => {
    //   return obj.path = folder.path + '/' + folder.file;
    // });
    if (!this.topNavigation.includes(folder.file)) {
      this.topNavigation = [folder.file]
    }

    this.lastPositionOfThePaths = getTheLastPosition(this.topNavigation)
    this._router.navigate([''], {
      queryParams: { path: folder.path + '/' + folder.file },
    });



  }


  getNavigation(index: any) {
    this.activeFolders = []

    this.currentFolder = index;
    this.topNavigation.length = transformLengthToTheTopNavigation(this.topNavigation.length, index)
    this.topNavigation[this.topNavigation.length - 1]
    const path = transformPathToSendByHttp(this.topNavigation)
    this.fileService.getFileByPath({ path, userSession: this.userData, admin: this.register.user.admin })
    this.fileService.pathEmitter.subscribe(value => {

      this.activeFolders = value;
    })

    this.currentFolder = '';
    for (let i of this.topNavigation) {
      this.currentFolder = this.currentFolder + '/' + i;
    }

    this.activeFolders = this.folders.filter((obj) => {
      this._router.navigate([''], {
        queryParams: { path: this.currentFolder },

      });
      return obj.path === this.currentFolder;
    });

    this.lastPositionOfThePaths = getTheLastPosition(this.topNavigation)


  }

  deleteFile(folder: any) {

    if (folder.isFile == true) {
      const objectToDelete = {
        file: folder.path !== "" ? `${folder.path}/${folder.file}` : folder.file,
        userCreator: folder.userCreator,
      }

      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.fileService.deleteFiles(objectToDelete)
          this.fileService.deleteFileEmitter.subscribe(v => {
            this.activeFolders = this.activeFolders.filter((v: any) => v._id !== folder._id)
            this._activeFolders = this._activeFolders.filter((v: any) => v._id !== folder._id)
          })

          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
        }
      })

      return
    }

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.fileService.deleteFilesByPath(folder)
        this.activeFolders = this.activeFolders.filter((v: any) => v._id !== folder._id)
        this._activeFolders = this._activeFolders.filter((v: any) => v._id !== folder._id)
        this.fileService.fileEmitter.emit(this.activeFolders)

        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        ).then(result => {
          if (folder.path === "" && this.topNavigation[0] === folder.file) {
            const path = this.pathActive.split("/")
            let string = ""
            for( let i = 0; i <= path.length - 1; i++){

              string = string !== "" ? string + '/' + path[i] :  string + path[i]
              this.activeFolders = this.activeFolders.filter(v => v.fullPath !== path);
              this._activeFolders = this._activeFolders.filter(v => v.fullPath !== path);
              this.topNavigation = this.topNavigation.filter((v:any) => v !== path[i])
            }

            if(!this.topNavigation.length){
              this._router.navigate(['']).then((v)=> {
                this.activeFolders = this.activeFolders.filter((v):any => {
                    if(this._activeFolders.some(f => f.file === v.fullPath.split("/")[0])){
                      return v
                    }
                })
              })
            }

          }
        })
      }
    })

  }

  assignPermit(folder: any) {


    const dialogRef = this.dialog.open(PermissionDialogComponent, {
      width: '500px',
      height: '600px',
      data: {
        folder: folder,
        userCreator: this.userData,
        users: ['rcebrian@typsa.es', 'cfarriol@typsa.es'],
        name: this.name,
        activeFolders: this.activeFolders,
        _activeFolders: this._activeFolders,
      },
    })
  }

  checkPermissions(folder: any) {

    const users = folder.usersWithPermission.toString().replace(/[,]+/g, "<br>").trim();

    return Swal.fire({
      title: '<strong>Permissions <u>to manage folders and files</u></strong>',
      icon: 'info',
      html:
        `<b>${users}</b>`,
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText:
        '<i class="fa fa-thumbs-up"></i> OK',
      confirmButtonAriaLabel: 'Thumbs up, great!',
      cancelButtonText:
        '<i class="fa fa-thumbs-down">Cancel</i>',
      cancelButtonAriaLabel: 'Thumbs down'
    })
  }



  openPermission() {
    const dialogRef = this.dialog.open(PermissionDialogComponent, {
      width: '250px',
      data: {
        folder: this.topNavigation[this.topNavigation.length - 1],
        users: ['rcebrian@typsa.es', 'cfarriol@typsa.es'],

      },
    });
  }

  isFormat(folder: any) {
    if (folder.file.endsWith('xlsx') || folder.file.endsWith('docx') || folder.file.endsWith('pdf')) {
      return true;
    }
    return false;
  }

  getImg(file: any) {
    if (file.endsWith('xlsx')) {
      return "../../assets/icons/excel.png";
    }
    else if (file.endsWith('pdf')) {
      return "../../assets/icons/pdf.png";
    }
    else if (file.endsWith('docx')) {
      return "../../assets/icons/word.png";
    }
    else return ''
  }



  verifyOrSendToVerify(folder: Section){

    if(this.userData === folder.userAssignedToVerify){
      return this.verifyFolderOrFile(folder)
    } else if(this.userData === folder.userCreator){
     return this.sendEmailToVerify(folder)
    }

  }



}


