
import { Injectable, OnDestroy, OnInit,  } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { RegisterServiceService } from '../auth/auth-service/registerservice.service';


@Injectable({
  providedIn: 'root'
})
export class isAuthGuard implements CanActivate, CanLoad {
  constructor(private router: Router, public registerService: RegisterServiceService){

  }



  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean{

const isAuth = this.registerService.verifyToken(localStorage.getItem("tokenMontenegro")!).pipe(map((response: any) => {
   if(response.confirmed){
    this.router.navigate([''])
    return false
   }else {
    return true
   }


  }))

return isAuth

// console.log(isAuth)


  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
}
