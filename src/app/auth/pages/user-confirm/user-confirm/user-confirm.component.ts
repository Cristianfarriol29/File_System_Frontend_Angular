

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterServiceService } from 'src/app/auth/auth-service/registerservice.service';

@Component({
  selector: 'app-user-confirm',
  templateUrl: './user-confirm.component.html',
  styleUrls: ['../../../auth.styles.scss']
})
export class UserConfirmComponent implements OnInit {

  msgOfTheResponse: string = ""
  token: string = ""

  constructor(private confirmService: RegisterServiceService, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params => {
      this.token = params['token']
      this.confirmService.userConfirm(this.token).subscribe((data:any) => {
        this.msgOfTheResponse = data.msg
      })
    })

  }

}
