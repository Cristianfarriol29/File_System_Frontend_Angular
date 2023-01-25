
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProfileComponent } from '../shared/components/user-profile/user-profile.component';
import { AdminPageComponent } from './pages/admin-page/admin-page/admin-page.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password/forgot-password.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RecoverPasswordComponent } from './pages/recover-password/recover-password/recover-password.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { UserConfirmComponent } from './pages/user-confirm/user-confirm/user-confirm.component';


const routes: Routes = [
{
  path: '',
  children: [{
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'register',
    component: RegisterPageComponent
  },
  {path: 'user-confirm/:token', component: UserConfirmComponent},
{path: 'forgot-password', component: ForgotPasswordComponent},
{path: 'recover-password/:token', component: RecoverPasswordComponent},
{path: 'profile', component: UserProfileComponent},


  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
