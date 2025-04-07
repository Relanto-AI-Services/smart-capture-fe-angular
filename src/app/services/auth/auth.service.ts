// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, Subject, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, public router: Router) { }
  public userData: any
  public userSession = new BehaviorSubject<any>('');
  public userLog = this.userSession.asObservable();

  public baseUrl = 'http://localhost:8000'
  // public baseUrl = 'http://34.173.40.128:8080'
  logeInUser(url: any): Observable<any> {
    const urls = this.baseUrl + url
    return this.http.get<any>(urls).pipe(
      tap(response => {
        this.userData = response
        localStorage.setItem('user', JSON.stringify(this.userData))
        localStorage.setItem('sid', response?.session_id)
        this.userSession.next(response?.session_id)
      })
    );
  }
  private getHeaders(): HttpHeaders {
    const sessionId = localStorage.getItem('sid') 
    return new HttpHeaders({
      'session-id': `${sessionId}`,
    });
  }

  getData(url: string): Observable<any> {
    const urls = this.baseUrl + url
    return this.http.get<any>(urls, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  postData(url: string, body: any): Observable<any> {
    const urls = this.baseUrl + url
    return this.http.post<any>(urls, body, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      console.error('API Error iffffffffffffffff:', error);
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      console.error('API Error elseeeeeeeeee:', error?.status);
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = 'Bad Request: Invalid request sent to the server.';
          break;
        case 401:
          localStorage.clear();
          this.userSession.next('');
          // this.router.navigate(['/login']);
          window.setTimeout(() => {
            this.router.navigate(['/login']);
          }, 0);
          errorMessage = 'Unauthorized: Access is denied due to invalid credentials.';
          break;
        case 403:
          errorMessage = 'Forbidden: You don’t have permission to access this resource.';
          break;
        case 404:
          errorMessage = 'Not Found: The requested resource was not found.';
          break;
        case 408:
          errorMessage = 'Request Timeout: The server took too long to respond.';
          break;
        case 500:
          errorMessage = 'Internal Server Error: Something went wrong on the server.';
          break;
        case 502:
          errorMessage = 'Bad Gateway: The server received an invalid response.';
          break;
        case 503:
          errorMessage = 'Service Unavailable: The server is overloaded or under maintenance.';
          break;
        case 504:
          errorMessage = 'Gateway Timeout: The server took too long to respond.';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.message}`;
          break;
      }
    }  
    return throwError(() => ({
      status: error.status,
      message: errorMessage
    }));
  }
  
}
