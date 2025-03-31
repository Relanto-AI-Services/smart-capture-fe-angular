import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // private baseUrl = 'http://127.0.0.1:8000';
  private baseUrl = 'http://34.60.26.146:8080/';

  constructor(private http: HttpClient) {}

  saveSpendRequestTactic(
    spendRequestId: string,
    tacticNames: string[]
  ): Observable<any> {
    const url = `${this.baseUrl}/save_spend_request_tactic`;

    const sessionId = localStorage.getItem('sid') || ''; 

    const headers = new HttpHeaders({
      accept: 'application/json',
      'session-id': sessionId,
      'Content-Type': 'application/json',
    });

    const body = {
      spend_request_id: spendRequestId,
      tactic_names: tacticNames,
    };

    return this.http.post(url, body, { headers });
  }


  // getSpendRequestData(): Observable<any> {
  //   return this.http.get<any>( `${this.baseUrl}/tactic_listing`);
  // }

  getSpendRequest() {
    const sessionIdd = localStorage.getItem('sid') || '';
    const headers = new HttpHeaders({
      'session-id': sessionIdd, 
    });

    return this.http.get( `${this.baseUrl}/tactic_listing`, { headers });
  }
}
