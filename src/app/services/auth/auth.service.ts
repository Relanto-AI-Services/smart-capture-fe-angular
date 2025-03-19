// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://your-backend.com/api/auth/google-login';
  public userLog: any = 'sasa'
  constructor(private http: HttpClient) {
    // localStorage.setItem('user',this.userLog)
  }

  verifyGoogleToken(token: string): Observable<any> {
    return this.http.post(this.apiUrl, { token });
  }
}
