import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // private baseUrl = 'http://127.0.0.1:8000';
  private baseUrl = 'http://34.173.40.128:8080';

  constructor(private http: HttpClient) {}

  saveSpendRequestTactic(
    spendRequestId: string,
    tacticDetails: Array<any>
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
      tactic_details: tacticDetails,
    };
    return this.http.post(url, body, { headers });
  }



  getSpendRequest() {
    const sessionIdd = localStorage.getItem('sid') || '';
    const headers = new HttpHeaders({
      'session-id': sessionIdd, 
    });

    return this.http.get( `${this.baseUrl}/tactic_listing`, { headers });
  }

  refreshSpendRequest() {
    const sessionIdd = localStorage.getItem('sid') || '';
    const headers = new HttpHeaders({
      'session-id': sessionIdd, 
    });

    return this.http.get( `${this.baseUrl}/tactics_refresh`, { headers });
  }

  saveRisk(
    spendRequestId: string,
    sowForm: {},
    riskfields: any 
    
  ): Observable<any> {
    const url = `${this.baseUrl}/save_risk_fields`;
    const sessionId = localStorage.getItem('sid') || ''; 
    const headers = new HttpHeaders({
      accept: 'application/json',
      'session-id': sessionId,
      'Content-Type': 'application/json',
    });
    const body = {
      spend_request_id: spendRequestId,
      risk_form: riskfields,  
      sow_form: sowForm
    };
    return this.http.post(url, body, { headers });
  }


  getReviewAndSubmitData(
    spendRequestId: string,


  ): Observable<any> {
    const url = `${this.baseUrl}/review_pull`;
    const sessionId = localStorage.getItem('sid') || ''; 
    const headers = new HttpHeaders({
      accept: 'application/json',
      'session-id': sessionId,
      'Content-Type': 'application/json',
    });
    const body = {
      spend_request_id: spendRequestId,
    };
    return this.http.post(url, body, { headers });
  }

  postReviewAndSubmitData(
    spendRequestId: string,

  ): Observable<any> {
    const url = `${this.baseUrl}/update_spend_req_status`;
    const sessionId = localStorage.getItem('sid') || ''; 
    const headers = new HttpHeaders({
      accept: 'application/json',
      'session-id': sessionId,
      'Content-Type': 'application/json',
    });
    const body = {
      spend_request_id: spendRequestId,
    };
    return this.http.post(url, body, { headers });
  }




}
