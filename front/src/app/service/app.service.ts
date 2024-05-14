import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs';
import { LoggerService } from './logger.service';
import { ErrorHandlerService } from './error.handler.service';

@Injectable({
    providedIn: 'root'
})
export class AppService {

    credentials: any = {};
    USER_NAME_SESSION_ATTRIBUTE_NAME = 'authenticatedUser'
    private apiUrl = `${environment.API_PROT}://${environment.API_HOST}:${environment.API_PORT}${environment.API_PATH}`;

    constructor(private http: HttpClient, private loggerService: LoggerService, private errorHandlerService: ErrorHandlerService) {
    }

    authenticate(credentials: any, callback: any) {

        const headers = new HttpHeaders(credentials ? { authorization: this.createBasicAuthToken(credentials.username, credentials.password) } : {});

        this.http.get(`${this.apiUrl}/user`, { headers: headers }).pipe(
            catchError((error: any) => {
              this.loggerService.logError('An error occurred:', error);
              return this.loggerService.logErrorThrow('Something went wrong');
            })
          )
          .subscribe({
            next: (response: any) => {
                if (response.authenticated) {
                    this.credentials = credentials;
                    this.registerSuccessfulLogin(credentials);
                } else {
                    this.credentials = {};
                }
                return callback && callback();
            },
            error: (err: any) => {
                this.credentials = {};
                this.errorHandlerService.handle(err);
            },
            complete: () => console.info("Login ok!")
        });
    }

    createBasicAuthToken(username: string, password: string) {
        return 'Basic ' + window.btoa(username + ":" + password);
    }

    registerSuccessfulLogin(credentials: any) {
        sessionStorage.setItem(this.USER_NAME_SESSION_ATTRIBUTE_NAME, credentials.username);
    }

    logout(callback: any) {
        sessionStorage.removeItem(this.USER_NAME_SESSION_ATTRIBUTE_NAME);
    }

    isUserLoggedIn() {
        let username = sessionStorage.getItem(this.USER_NAME_SESSION_ATTRIBUTE_NAME)
        if (username === null) {
            return false;
        }
        return true;
    }

    getLoggedInUserName() {
        let user = sessionStorage.getItem(this.USER_NAME_SESSION_ATTRIBUTE_NAME)
        if (user === null) return ''
        return user;
    }

}
