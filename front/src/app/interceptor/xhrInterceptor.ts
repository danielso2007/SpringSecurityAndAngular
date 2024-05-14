import { HttpErrorResponse, HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AppService } from '../service/app.service';
import { inject } from '@angular/core';

export const xhrInterceptor: HttpInterceptorFn = (req, next) => {
  const appService = inject(AppService);
  let nextValue: any;
  if (appService.isUserLoggedIn()) {
    console.log("Logado", appService.credentials);
    const authReq = req.clone({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Basic ${window.btoa(appService.credentials.username + ":" + appService.credentials.password)}`
      })
    });
    console.log(authReq);
    nextValue = authReq;
  } else {
    nextValue = req;
  }
  return next(nextValue).pipe(
    catchError((err: any) => {
      if (err instanceof HttpErrorResponse) {
        // Handle HTTP errors
        if (err.status === 401) {
          // Specific handling for unauthorized errors         
          console.error('Unauthorized request:', err);
          // You might trigger a re-authentication flow or redirect the user here
        } else {
          // Handle other HTTP error codes
          console.error('HTTP error:', err);
        }
      } else {
        // Handle non-HTTP errors
        console.error('An error occurred:', err);
      }

      // Re-throw the error to propagate it further
      return throwError(() => err);
    })
  );
};