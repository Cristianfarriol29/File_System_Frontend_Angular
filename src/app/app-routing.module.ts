import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileListComponent } from './file-list/file-list.component';
import { AuthGuard } from './guard/auth.guard';
import { UserProfileComponent } from './shared/components/user-profile/user-profile.component';
import { isAuthGuard } from './guard/isAuth.guard';
import { isAdminGuard } from './guard/isAdmin.guard';
import { AdminPageComponent } from './auth/pages/admin-page/admin-page/admin-page.component';

// const routes: Routes = [
//   { path: '',  component: FileListComponent },
// {path: 'auth',  loadChildren: () => import('../app/auth/auth.module').then(m => m.AuthModule) },
// {path: 'auth/admin',  component: AdminPageComponent},
// {path: 'profile', component: UserProfileComponent},
// {path:"**", redirectTo: ""}
// ];

const routes: Routes = [
  { path: '', canActivate: [AuthGuard] , component: FileListComponent },
{path: 'auth', canActivate: [isAuthGuard] , loadChildren: () => import('../app/auth/auth.module').then(m => m.AuthModule) },
{path: 'auth/admin', canActivate: [isAdminGuard], component: AdminPageComponent},
{path: 'profile', canActivate: [AuthGuard] , component: UserProfileComponent},
{path:"**", redirectTo: ""}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
