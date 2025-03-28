import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://127.0.0.1:8000';
  // private baseUrl = 'http://34.173.40.128:8080';

  constructor(private http: HttpClient) {}

  saveSpendRequestTactic(
    spendRequestId: string,
    tacticNames: string[]
  ): Observable<any> {
    const url = `${this.baseUrl}/save_spend_request_tactic`;

    const sessionId = localStorage.getItem('sid') || ''; // Ensure it's not null

    const headers = new HttpHeaders({
      accept: 'application/json',
      'session-id': sessionId, // Use sessionId directly
      'Content-Type': 'application/json',
    });

    const body = {
      spend_request_id: spendRequestId,
      tactic_names: tacticNames,
    };

    return this.http.post(url, body, { headers });
  }
}
