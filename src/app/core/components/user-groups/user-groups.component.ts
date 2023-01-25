import  Swal  from 'sweetalert2';
import { FilesService } from './../../services/files.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { isValidEmail } from 'src/app/helpers/isValidEmail';

@Component({
  selector: 'app-user-groups',
  templateUrl: './user-groups.component.html',
  styleUrls: ['./user-groups.component.scss']
})
export class UserGroupsComponent implements OnInit {
groupToRender: any = []
name: any = ""
groups: any = []
  constructor(
    public dialogRef: MatDialogRef<UserGroupsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fileService: FilesService
  ) {}

  ngOnInit(): void {
    this.fileService.getUsersInDB()
    this.fileService.usersEmitter.subscribe(v => this.groups = v)
    this.fileService.usersInGroup.subscribe(v => {
      this.groupToRender = v.users
      this.data.user = ""

    })
  }

  onSubmit() {

  }

  showUserWithPermit(groups:any) {

    this.fileService.getUsersInDB()
    this.fileService.usersEmitter.subscribe(v => {
      v.forEach((f:any) => {
        if(f._id === groups._id){
          this.groupToRender = f.users
          this.name = f.groupName;
        }
      })

    })


  }

  insertCollaborator():void{

    if(!isValidEmail(this.data.user)){
 Swal.fire({
  icon: 'error',
  title: 'Oops...',
  text: "Please insert a valid email"

})
return
    }
    let groupFiltered = {}
     this.groups.filter((g:any)=> g.groupName === this.name).map((v:any) => {

   v = {
    ...v,
    user : this.data.user
  }
  groupFiltered = {...v}

  return v
});

this.fileService.postANewUserInSelectedGroup(groupFiltered)


  }

  insertGroup(){

    const objectToSend = {
      groupName: this.data.groupName
    }

    this.fileService.postANewGroup(objectToSend)
    this.data.groupName = ""
  }

}
