// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, Subject, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, public router: Router) { }
  public userData: any
  public userSession = new Subject<any>();
  // public baseUrl = 'http://localhost:8000'
  public baseUrl = 'http://34.173.40.128:8080'
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
    console.error('API Error:', error);
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = 'Bad Request: Invalid request sent to the server.';
          break;
        case 401:
          localStorage.clear()
          this.router.navigate(['/Login'])
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

    console.error(`API Error [${error.status}]:`, errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
