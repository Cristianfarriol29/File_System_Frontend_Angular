
import { Injectable, OnDestroy, OnInit,  } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { RegisterServiceService } from '../auth/auth-service/registerservice.service';


@Injectable({
  providedIn: 'root'
})
export class isAdminGuard implements CanActivate, CanLoad {
  constructor(private router: Router, public registerService: RegisterServiceService){

  }



  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean{

      let link:any = ''
      if(!document.location.href.includes('login'))
     link = localStorage.setItem('linkMontenegro', document.location.href)



        return this.registerService.verifyToken(localStorage.getItem('tokenMontenegro')!).pipe(map((response: any) => {
          if (response.admin === true){
          return true
          }else{
            this.router.navigate(['/auth/login'])
            return false
          }
          }))





  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
}
