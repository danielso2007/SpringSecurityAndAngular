import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AppService } from '../service/app.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs';
import { ErrorHandlerService } from '../service/error.handler.service';
import { LoggerService } from '../service/logger.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  title = 'Demo';
  greeting: any = {};
  private apiUrl = `${environment.API_PROT}://${environment.API_HOST}:${environment.API_PORT}${environment.API_PATH}`;

  constructor(
    private app: AppService,
    private http: HttpClient,
    private loggerService: LoggerService,
    private errorHandlerService: ErrorHandlerService) {
  }
  ngOnInit(): void {
    this.http.get(`${this.apiUrl}/resource`).pipe(
      catchError((error: any) => {
        this.loggerService.logError('An error occurred:', error);
        return this.loggerService.logErrorThrow('Something went wrong');
      })
    ).subscribe({
        next: (response: any) => {
          this.greeting = response;
        },
        error: (err: any) => {
          this.errorHandlerService.handle(err);
        }
      });
  }

  authenticated() { return this.app.isUserLoggedIn(); }
}
