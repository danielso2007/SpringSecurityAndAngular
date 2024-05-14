import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoggerService {
    logError(message: string, error: any): void {
        console.error(message, error);
    }
    logErrorThrow(message: string): any {
        return throwError(() => message);
    }
}