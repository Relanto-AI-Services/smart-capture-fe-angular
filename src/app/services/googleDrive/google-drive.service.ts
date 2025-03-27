import { Injectable, EventEmitter } from '@angular/core';

declare var google: any;
declare var gapi: any;

@Injectable({
  providedIn: 'root',
})
export class GoogleDriveService {
  public user = localStorage.getItem('user');
  public userData = JSON.parse(this.user ? this.user : '');
  private developerKey = 'AIzaSyCcqTIJCP411o-MU_fLrJJFiGhAu-kSSpk';
  private clientId = this.userData?.token?.client_id;
  private oauthToken: string = this.userData?.token?.token;

  public fileSelected = new EventEmitter<any>();

  constructor() {
    this.loadGoogleAPI();
  }

  loadGoogleAPI() {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = () => this.loadGapi();
    document.body.appendChild(script);
  }

  loadGapi() {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      gapi.load('client:picker', () => {
        console.log('Google API loaded');
        this.initAuth();
      });
    };
    document.body.appendChild(script);
  }

  initAuth() {
    try {
      
    if (!this.clientId) {
      console.error('Client ID is missing!');
      return;
    }

    if (this.oauthToken) {
      console.log('Using stored OAuth token');
      return;
    }

    if (!google?.accounts?.oauth2) {
      console.error('Google API not fully loaded!');
      return;
    }

    google.accounts.oauth2
      .initTokenClient({
        client_id: this.clientId,
        scope: 'https://www.googleapis.com/auth/drive.metadata.readonly',
        callback: (response: any) => {
          if (response.access_token) {
            this.oauthToken = response.access_token;
            localStorage.setItem('oauth_token', this.oauthToken);
          } else {
            console.error('Failed to obtain OAuth Token');
          }
        },
      })
      .requestAccessToken();
    } catch (error) {
      console.error('error',error)
    }
  }

  openPicker() {
    try {
      if (!this.oauthToken) {
        console.error('OAuth Token not found!');
        return;
      }

      const view = new google.picker.View(google.picker.ViewId.DOCS);
      view.setMimeTypes('application/vnd.google-apps.document,application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      // view.setMimeTypes('application/vnd.google-apps.document,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf');
      const picker = new google.picker.PickerBuilder()
        .enableFeature(google.picker.Feature.NAV_HIDDEN)
        .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
        .setOAuthToken(this.oauthToken)
        .setDeveloperKey(this.developerKey)
        .addView(view)
        .addView(google.picker.ViewId.DOCS)
        .addView(google.picker.ViewId.SPREADSHEETS)
        .addView(google.picker.ViewId.PRESENTATIONS)
        .setCallback(this.pickerCallback.bind(this))
        .build();

      picker.setVisible(true);
    } catch (error) {
      console.error('error', error)
    }
  }

  pickerCallback(data: any) {
    console.log('Picker Response:', data);
    if (data.action === google.picker.Action.PICKED) {
      const selectedFiles = data.docs.map((file: any) => ({
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
        url: file.url,
        fileSizeMB: (file.sizeBytes / (1024 * 1024)).toFixed(2) + ' MB'
      }));
      this.fileSelected.emit(selectedFiles);
    } else {
      console.error('No file selected or error in response');
    }
  }
}
