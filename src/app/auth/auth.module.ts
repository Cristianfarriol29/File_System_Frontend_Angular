import { AdminPageComponent } from './pages/admin-page/admin-page/admin-page.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { UserConfirmComponent } from './pages/user-confirm/user-confirm/user-confirm.component';
import { RecoverPasswordComponent } from './pages/recover-password/recover-password/recover-password.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password/forgot-password.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';



@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    AuthRoutingModule
  ],
  declarations: [LoginPageComponent, RegisterPageComponent, UserConfirmComponent, RecoverPasswordComponent, ForgotPasswordComponent]
})
export class AuthModule { }
